import { handleComboChat } from "../compat/engine";
import type { HandleComboChatOptions } from "../compat/engine";
import { acceptHeaderForcesStream } from "../compat/protocol";
import { errorResponse } from "../compat/errors";

import { LEAD_PLAN_PROMPT, parseLeadExecutionPlan, validateStepOutput } from "../jev/executionPlan";
import { evaluateLeadPlan } from "../jev/executionPolicy";
import { executeJevLocalTask, JevLocalTaskError } from "../jev/localExecution";
import { nexusPairPolicySchema } from "./definition";
import { executePairStage, findPairTarget } from "./stage";
import { localPairCompletion, pairCompletionResponse, type PairCompletion } from "./response";
import { supportsReasoningFreeWorker } from "./workerReasoning";

export async function handleNexusPairComboChat<Options extends HandleComboChatOptions>(
  options: Options
): Promise<Response> {
  const policyInput = options.combo.config?.nexusPair;
  if (policyInput === undefined) return handleComboChat(options);
  const parsedPolicy = nexusPairPolicySchema.safeParse(policyInput);
  if (!parsedPolicy.success) return errorResponse(400, "Invalid NEXUS pair policy");
  const policy = parsedPolicy.data;
  const leadTarget = findPairTarget(options.combo.models, policy.leadModel);
  const workerTarget = findPairTarget(options.combo.models, policy.workerModel);
  if (!leadTarget || !workerTarget)
    return errorResponse(400, "NEXUS pair models must match saved combo targets");
  if (
    (options.sourceFormat && options.sourceFormat !== "openai") ||
    !Array.isArray(options.body.messages) ||
    options.body.input !== undefined ||
    options.body.contents !== undefined
  ) {
    const response = await handleComboChat({
      ...options,
      combo: {
        ...options.combo,
        strategy: "pipeline",
        context_cache_protection: false,
        models: [{ ...leadTarget, prompt: undefined }],
      },
    });
    response.headers.set("X-Nexus-Path", "lead_escalation");
    response.headers.set("X-Nexus-Jev-Mode", "inactive");
    response.headers.set("X-Nexus-Reasons", "unsupported_protocol");
    return response;
  }
  const accept =
    options.requestHeaders instanceof Headers
      ? options.requestHeaders.get("accept")
      : options.requestHeaders?.accept;
  const stream =
    options.body.stream === true || acceptHeaderForcesStream(accept, options.body.stream);
  let leadStages = 0;
  let workerStages = 0;
  let path = "lead_escalation";
  let reasons: readonly string[] = [];
  const outputs = new Map<string, string>();
  const finish = (response: Response): Response => {
    response.headers.set("X-Nexus-Path", path);
    response.headers.set("X-Nexus-Jev-Mode", "local_deterministic");
    response.headers.set("X-Nexus-Lead-Stages", String(leadStages));
    response.headers.set("X-Nexus-Worker-Stages", String(workerStages));
    response.headers.set(
      "X-Nexus-Compression",
      String(options.combo.config?.compressionMode ?? "inherit")
    );
    response.headers.set("X-Nexus-Reasons", reasons.join(","));
    response.headers.set("X-Nexus-Usage-Scope", "final-stage-only");
    return response;
  };
  const review = async (reason: string): Promise<Response> => {
    options.signal?.throwIfAborted();
    reasons = [...reasons, reason];
    path = "lead_escalation";
    options.log.warn("NEXUS_PAIR", "Lead review required", { combo: options.combo.name, reasons });
    leadStages += 1;
    const result = await executePairStage(options, {
      role: "review",
      target: leadTarget,
      final: true,
      prompt:
        "Resolve the original request. Review the execution evidence, correct defects and return the final answer. Do not claim that code or tools were executed unless evidence proves it.",
      context: JSON.stringify({ reasons, completedSteps: Object.fromEntries(outputs) }),
    });
    if (result instanceof Response) return finish(result);
    if (!result || result.truncated || (!result.content.trim() && !result.toolCalls)) {
      options.log.error?.("NEXUS_PAIR", "Lead returned invalid final output", {
        combo: options.combo.name,
      });
      return finish(errorResponse(502, "NEXUS Lead returned invalid final output"));
    }
    return finish(pairCompletionResponse(result, stream));
  };
  leadStages += 1;
  const planned = await executePairStage(options, {
    role: "plan",
    target: leadTarget,
    prompt: LEAD_PLAN_PROMPT,
    final: false,
  });
  if (planned instanceof Response) {
    await planned.body?.cancel();
    return review("lead_plan_failed");
  }
  const plan = planned && !planned.truncated ? parseLeadExecutionPlan(planned.content) : null;
  if (!plan) return review("invalid_lead_plan");
  const decision = evaluateLeadPlan(plan, JSON.stringify(options.body.messages));
  path = decision.path;
  reasons = decision.reasons;
  let result: PairCompletion | null = null;
  for (const [index, step] of plan.steps.entries()) {
    options.signal?.throwIfAborted();
    switch (step.kind) {
      case "local": {
        try {
          const task = step.inputFrom
            ? { ...step.task, source: outputs.get(step.inputFrom) ?? "" }
            : step.task;
          const output = executeJevLocalTask(task);
          if (!validateStepOutput(output.content, step)) return review("local_invalid_output");
          result = localPairCompletion(output.content, options.combo.name);
        } catch (error) {
          if (!(error instanceof JevLocalTaskError)) throw error;
          return review(`local_${error.code.toLowerCase()}`);
        }
        break;
      }
      case "generate": {
        if (!supportsReasoningFreeWorker(policy.workerModel))
          return review("worker_reasoning_required");
        workerStages += 1;
        const generated = await executePairStage(options, {
          role: "worker",
          target: workerTarget,
          prompt: step.instruction,
          final: index === plan.steps.length - 1 && !decision.requiresReview,
          context: JSON.stringify({
            goal: plan.goal,
            step,
            completedSteps: Object.fromEntries(outputs),
          }),
        });
        if (generated instanceof Response) {
          await generated.body?.cancel();
          return review("worker_execution_failed");
        }
        result = generated;
        if (result?.reasoningObserved) return review("worker_reasoning_observed");
        const terminalTools =
          index === plan.steps.length - 1 && !decision.requiresReview && result?.toolCalls;
        if (
          !result ||
          result.truncated ||
          (!terminalTools && !validateStepOutput(result.content, step))
        ) {
          return review("worker_invalid_output");
        }
        break;
      }
      default: {
        const exhaustive: never = step;
        return exhaustive;
      }
    }
    if (result) outputs.set(step.id, result.content);
  }
  if (decision.requiresReview) return review("mandatory_review");
  if (!result) return review("missing_execution_output");
  return finish(pairCompletionResponse(result, stream));
}
