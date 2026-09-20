import { z } from "zod";

import { jevLocalTaskSchema } from "./localExecution";

const acceptanceSchema = z
  .object({
    format: z.enum(["text", "json"]),
    minLength: z.number().int().min(1).max(16_000),
  })
  .strict();
const stepFields = { id: z.string().min(1).max(80), acceptance: acceptanceSchema };
export const leadExecutionPlanSchema = z
  .object({
    version: z.literal(1),
    goal: z.string().min(1).max(2000),
    risk: z.enum(["low", "medium", "high"]),
    scope: z.enum(["localized", "multi_component", "architectural"]),
    touchesAuth: z.boolean(),
    confidence: z.number().min(0).max(1),
    reviewRequired: z.boolean(),
    steps: z
      .array(
        z.discriminatedUnion("kind", [
          z
            .object({
              ...stepFields,
              kind: z.literal("local"),
              task: jevLocalTaskSchema,
              inputFrom: z.string().max(80).optional(),
            })
            .strict(),
          z
            .object({
              ...stepFields,
              kind: z.literal("generate"),
              instruction: z.string().min(1).max(8000),
            })
            .strict(),
        ])
      )
      .min(1)
      .max(6),
  })
  .strict()
  .superRefine((plan, context) => {
    const prior = new Set<string>();
    for (const [index, step] of plan.steps.entries()) {
      if (prior.has(step.id))
        context.addIssue({
          code: "custom",
          message: "Duplicate step id",
          path: ["steps", index, "id"],
        });
      if (step.kind === "local" && step.inputFrom && !prior.has(step.inputFrom)) {
        context.addIssue({
          code: "custom",
          message: "Input must reference a preceding step",
          path: ["steps", index, "inputFrom"],
        });
      }
      prior.add(step.id);
    }
  });

export type LeadExecutionPlan = z.infer<typeof leadExecutionPlanSchema>;
export type ExecutionStep = LeadExecutionPlan["steps"][number];

export function parseLeadExecutionPlan(content: string): LeadExecutionPlan | null {
  if (content.length > 100_000) return null;
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/u, "")
    .replace(/\s*```$/u, "");
  try {
    const value: unknown = JSON.parse(cleaned);
    const parsed = leadExecutionPlanSchema.safeParse(value);
    return parsed.success ? parsed.data : null;
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return null;
  }
}

export function validateStepOutput(content: string, step: ExecutionStep): boolean {
  if (content.trim().length < step.acceptance.minLength) return false;
  switch (step.acceptance.format) {
    case "text":
      return true;
    case "json":
      try {
        JSON.parse(content);
        return true;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        return false;
      }
    default: {
      const exhaustive: never = step.acceptance.format;
      return exhaustive;
    }
  }
}

export const LEAD_PLAN_PROMPT = [
  "Interpret the complete user request and design the solution. Return only a JSON execution plan matching the supplied schema.",
  "You are the thinking Lead. JEV cannot think or invent a plan: it only executes supported deterministic operations and dispatches your explicit generation instructions to an economical Worker.",
  "Use the fewest steps needed. Local operations only transform explicitly provided text, never read/write files, run commands, or claim repository changes. For code generation use generate, preserving all user constraints and concrete acceptance requirements.",
  "A local step may read an earlier step via inputFrom; otherwise task.source must be the exact supplied source. The final step must produce the entire requested answer. Flag uncertainty, auth/security sensitivity, architectural scope and indispensable review truthfully.",
  JSON.stringify(z.toJSONSchema(leadExecutionPlanSchema, { io: "input" })),
].join("\n");
