/**
 * Workflow Schema & Type Definitions for NEXUS Gateway
 * Implements schema version `nexus.workflow/v1` for persistent DAG workflows.
 */

export type StepType =
  | "input"
  | "rule"
  | "jev_eval"
  | "llm_call"
  | "agent_task"
  | "tool_exec"
  | "test_runner"
  | "review"
  | "condition"
  | "parallel"
  | "join"
  | "human_approval"
  | "output";

export type WorkflowStatus =
  "queued" | "running" | "waiting_approval" | "retrying" | "succeeded" | "failed" | "cancelled";

export type StepStatus =
  "pending" | "running" | "succeeded" | "failed" | "skipped" | "waiting_approval";

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  exponential?: boolean;
}

export interface WorkflowStepDefinition {
  id: string;
  name: string;
  type: StepType;
  description?: string;
  dependsOn?: string[]; // IDs of predecessor steps
  when?: string; // Safe boolean condition expression evaluated via AST
  timeoutSeconds?: number;
  retryPolicy?: RetryPolicy;
  config: Record<string, any>;
}

export interface WorkflowDefinition {
  schemaVersion: "nexus.workflow/v1";
  id: string;
  name: string;
  description?: string;
  maxBudgetTokens?: number;
  defaultInputs?: Record<string, any>;
  steps: WorkflowStepDefinition[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StepRun {
  id: string;
  runId: string;
  stepId: string;
  type: StepType;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  error?: string;
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  startedAt: string;
  completedAt?: string;
  currentStepId?: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  stepRuns: Record<string, StepRun>;
  leaseOwner?: string;
  leaseExpiresAt?: string;
  totalTokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  error?: string;
}

export interface ApprovalRequest {
  id: string;
  runId: string;
  stepId: string;
  title: string;
  description: string;
  data: Record<string, any>;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  respondedAt?: string;
  feedback?: string;
}
