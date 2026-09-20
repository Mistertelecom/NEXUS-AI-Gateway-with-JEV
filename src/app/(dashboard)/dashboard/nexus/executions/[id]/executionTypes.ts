export type NexusStepOutput = {
  task_kind?: string;
  task_kind_confidence?: number;
  touches_auth?: boolean;
  scope?: string;
  modelUsed?: string;
  isLocalAgy?: boolean;
  compression?: {
    profile?: string;
    engine?: string;
    savingsRatio?: number;
  };
  message?: string;
  command?: string | { executable: string; args: string[] };
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  commitSha?: string;
  changedFiles?: string[];
  [key: string]: unknown;
};
export type NexusStepRun = {
  id?: string;
  stepId?: string;
  type?: string;
  status?: string;
  tokensUsed?: { input?: number; output?: number; total?: number };
  outputs?: NexusStepOutput;
  error?: string;
};

export type NexusExecutionRun = {
  id: string;
  workflowId: string;
  status: string;
  inputs?: { objective?: string };
  stepRuns?: Record<string, NexusStepRun>;
  totalTokensUsed?: { input?: number; output?: number; total?: number };
};
export type PendingApproval = { id: string; runId: string; stepId: string };
export type ExecutionResponse = { run: NexusExecutionRun; pendingApprovals: PendingApproval[] };
