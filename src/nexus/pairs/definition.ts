import { z } from "zod";

export const nexusPairPolicySchema = z
  .object({
    version: z.literal(1),
    policy: z.literal("lead-plan-once-jev-execute"),
    leadModel: z.string().trim().min(1).max(300),
    workerModel: z.string().trim().min(1).max(300),
    workerReasoning: z.literal("none"),
  })
  .strict();

export type NexusPairPolicy = z.infer<typeof nexusPairPolicySchema>;
export type PairCompressionMode = "off" | "standard" | "rtk" | "stacked";

export type NexusPairDraft = {
  name: string;
  leadModel: string;
  workerModel: string;
  compressionMode: PairCompressionMode;
  jevMode: "adaptive" | "advisory" | "off";
};

export type NexusPairComboInput = {
  name: string;
  displayName: string;
  description: string;
  strategy: "pipeline";
  models: Array<{
    kind: "model";
    model: string;
    label: string;
    prompt: string;
  }>;
  config: {
    compressionMode: PairCompressionMode;
    trackMetrics: true;
    nexusPair?: NexusPairPolicy;
  };
};

function normalizePairName(value: string): string {
  const normalized = value
    .trim()
    .replace(/^nexus\/+/i, "")
    .split("/")
    .map((segment) =>
      segment
        .trim()
        .replace(/[^a-zA-Z0-9_.\[\] -]+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^[-.]+|[-.]+$/g, "")
    )
    .filter((segment) => segment.length > 0)
    .join("/")
    .slice(0, 88)
    .replace(/[-/.]+$/g, "");

  return `nexus/${normalized || "intelligence-pair"}`;
}

export function buildNexusPairCombo(draft: NexusPairDraft): NexusPairComboInput {
  const leadModel = draft.leadModel.trim();
  const workerModel = draft.workerModel.trim();
  const displayName = draft.name.trim() || "NEXUS Intelligence Pair";
  const boundaries = {
    adaptive:
      "Lead plans once; JEV executes the typed plan locally and delegates generation to the Worker. Lead returns only for validation failure or required review.",
    advisory: "JEV is advisory; this pair uses the fixed Lead/Worker/Lead pipeline.",
    off: "JEV is disabled for this saved pair.",
  };

  return {
    name: normalizePairName(displayName),
    displayName,
    description: `NEXUS Pair. Lead: ${leadModel}. Worker: ${workerModel}. ${boundaries[draft.jevMode]}`,
    strategy: "pipeline",
    models: [
      {
        kind: "model",
        model: leadModel,
        label: "Lead · Plan",
        prompt:
          "Analyze the request and produce a concise execution plan. Identify important constraints and risks before the work begins.",
      },
      {
        kind: "model",
        model: workerModel,
        label: "Worker · Execute",
        prompt:
          "Execute the plan efficiently. Return a complete, useful answer and preserve every explicit constraint from the request.",
      },
      {
        kind: "model",
        model: leadModel,
        label: "Lead · Check",
        prompt:
          "Review the worker result for correctness, omissions, and risk. Return the corrected final answer without review preamble.",
      },
    ],
    config: {
      compressionMode: draft.compressionMode,
      trackMetrics: true,
      ...(draft.jevMode === "adaptive"
        ? {
            nexusPair: nexusPairPolicySchema.parse({
              version: 1,
              policy: "lead-plan-once-jev-execute",
              leadModel,
              workerModel,
              workerReasoning: "none",
            }),
          }
        : {}),
    },
  };
}
