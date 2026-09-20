import { z } from "zod";
import { runnerCommandSchema } from "../runner/commandPolicy";

const stepTypeSchema = z.enum([
  "input",
  "jev_eval",
  "tool_exec",
  "test_runner",
  "human_approval",
  "output",
]);

const retryPolicySchema = z
  .object({
    maxRetries: z.number().int().min(0).max(10),
    backoffMs: z.number().int().min(0).max(300000),
    exponential: z.boolean().optional(),
  })
  .strict();

const workflowStepSchema = z
  .object({
    id: z.string().min(1).max(128),
    name: z.string().min(1).max(256),
    type: stepTypeSchema,
    description: z.string().max(10000).optional(),
    dependsOn: z.array(z.string().min(1).max(128)).max(100).optional(),
    when: z.string().max(2000).optional(),
    timeoutSeconds: z.number().int().min(1).max(3600).optional(),
    retryPolicy: retryPolicySchema.optional(),
    config: z.record(z.string(), z.unknown()),
  })
  .strict();

export const workflowDefinitionSchema = z
  .object({
    schemaVersion: z.literal("nexus.workflow/v1"),
    id: z.string().min(1).max(128),
    name: z.string().min(1).max(256),
    description: z.string().max(10000).optional(),
    maxBudgetTokens: z.number().int().min(1).max(10000000).optional(),
    defaultInputs: z.record(z.string(), z.unknown()).optional(),
    steps: z.array(workflowStepSchema).max(100),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .strict();

export const approvalRequestSchema = z
  .object({
    approvalId: z.string().min(1).max(128),
    decision: z.enum(["approved", "rejected"]),
    feedback: z.string().max(10000).optional(),
  })
  .strict();

export const workflowRunRequestSchema = z
  .object({
    workflowId: z.string().min(1).max(128).optional(),
    workflow: workflowDefinitionSchema.optional(),
    pipelineConfig: z
      .object({
        name: z.string().min(1).max(256).optional(),
        reviewerModel: z.string().min(1).max(256).optional(),
        implementerModel: z.string().min(1).max(256).optional(),
        jevBackend: z.enum(["jev-latest", "deterministic", "disabled"]).optional(),
        compressionProfile: z.enum(["off", "caveman", "headroom", "omniglyph"]).optional(),
        testCommand: runnerCommandSchema.optional(),
        requireHumanApproval: z.boolean().optional(),
      })
      .strict()
      .optional(),
    inputs: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type WorkflowRunRequest = z.infer<typeof workflowRunRequestSchema>;
