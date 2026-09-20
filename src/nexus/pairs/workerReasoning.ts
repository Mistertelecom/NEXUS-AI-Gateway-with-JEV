import { z } from "zod";

import { sanitizeReasoningEffortForProvider } from "../compat/worker";
import { getProviderModels } from "../compat/modelCapabilities";
import { documentedNoneEffort } from "./workerCapabilities";

export { isNexusWorkerStage, withWorkerReasoningDisabled } from "./workerStage";

const reasoningProbeSchema = z.object({
  reasoning_effort: z.string().optional(),
  chat_template_kwargs: z.object({ enable_thinking: z.boolean().optional() }).optional(),
});

export function supportsReasoningFreeWorker(model: string): boolean {
  const separator = model.indexOf("/");
  const provider = separator < 0 ? "" : model.slice(0, separator);
  const modelId = separator < 0 ? model : model.slice(separator + 1);
  const entry = getProviderModels(provider).find((candidate) => candidate.id === modelId);
  // Passing an unknown parameter through a permissive sanitizer is not capability evidence.
  if (!entry) return false;
  if (entry.supportsReasoning === false) return true;
  if (!entry.supportedThinkingEfforts?.includes("none") && !documentedNoneEffort.has(model))
    return false;
  const probe = reasoningProbeSchema.safeParse(
    sanitizeReasoningEffortForProvider({ reasoning_effort: "none" }, provider, modelId)
  );
  return (
    probe.success &&
    (probe.data.reasoning_effort === "none" ||
      probe.data.chat_template_kwargs?.enable_thinking === false)
  );
}
