import { z } from "zod";

const WORKER_STAGE = Symbol("nexus.worker.stage");
const nativeParametersSchema = z.record(z.string(), z.unknown());

export function withWorkerReasoningDisabled(
  body: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string | symbol, unknown> = { ...body, [WORKER_STAGE]: true };
  for (const key of [
    "reasoning",
    "thinking",
    "reasoning_effort",
    "effort",
    "output_config",
    "thinking_budget",
    "thinkingBudget",
    "thinkingBudgetTokens",
    "_omnirouteReasoningRule",
    "_omnirouteReasoningRouteTrace",
    "enable_thinking",
    "enableThinking",
    "thinkingConfig",
    "thinking_level",
    "thinkingLevel",
  ])
    delete result[key];
  if (body.chat_template_kwargs !== undefined) {
    const kwargs = nativeParametersSchema.safeParse(body.chat_template_kwargs);
    result.chat_template_kwargs = {
      ...(kwargs.success ? kwargs.data : {}),
      enable_thinking: false,
    };
  }
  if (body.generationConfig !== undefined) {
    const config = nativeParametersSchema.safeParse(body.generationConfig);
    delete result.generationConfig;
    if (config.success) {
      const generationConfig = { ...config.data };
      delete generationConfig.thinkingConfig;
      result.generationConfig = generationConfig;
    }
  }
  return { ...result, reasoning_effort: "none", thinking: { type: "disabled" } };
}

// A symbol survives internal object spreads but cannot be forged in JSON or sent upstream.
export function isNexusWorkerStage(body: unknown): boolean {
  return (
    typeof body === "object" && body !== null && WORKER_STAGE in body && body[WORKER_STAGE] === true
  );
}
