import { z } from "zod";

import { handleComboChat } from "../compat/engine";
import type { HandleComboChatOptions } from "../compat/engine";
import { errorResponse } from "../compat/errors";

import { withWorkerReasoningDisabled } from "./workerReasoning";
import { readPairCompletion, type PairCompletion } from "./response";

const modelTargetSchema = z
  .object({
    kind: z.literal("model").optional(),
    model: z.string().min(1),
  })
  .passthrough();

export function findPairTarget(models: unknown[], model: string): Record<string, unknown> | null {
  for (const value of models) {
    if (value === model) return { kind: "model", model };
    const target = modelTargetSchema.safeParse(value);
    if (target.success && target.data.model === model) return target.data;
  }
  return null;
}

export type PairStage = {
  readonly role: "plan" | "worker" | "review";
  readonly target: Record<string, unknown>;
  readonly prompt: string;
  readonly context?: string;
  readonly final: boolean;
};

export async function executePairStage(
  options: HandleComboChatOptions,
  stage: PairStage
): Promise<Response | PairCompletion | null> {
  options.signal?.throwIfAborted();
  const body: Record<string, unknown> = { ...options.body, stream: false, n: 1 };
  delete body.stream_options;
  if (!stage.final) {
    for (const key of ["tools", "tool_choice", "functions", "function_call", "response_format"]) {
      delete body[key];
    }
  }
  if (stage.context) {
    body.messages = [
      ...(Array.isArray(options.body.messages) ? options.body.messages : []),
      { role: "user", content: stage.context },
    ];
  }
  try {
    const response = await handleComboChat({
      ...options,
      body: stage.role === "worker" ? withWorkerReasoningDisabled(body) : body,
      combo: {
        ...options.combo,
        strategy: "pipeline",
        context_cache_protection: false,
        models: [{ ...stage.target, prompt: stage.prompt }],
      },
    });
    return response.ok ? await readPairCompletion(response, options.signal) : response;
  } catch (error) {
    if (!(error instanceof Error) || options.signal?.aborted) throw error;
    const report =
      stage.role === "review" ? (options.log.error ?? options.log.warn) : options.log.warn;
    report("NEXUS_PAIR", "Stage execution failed", {
      combo: options.combo.name,
      role: stage.role,
      errorType: error.name,
    });
    return errorResponse(502, "NEXUS stage execution failed");
  }
}
