export type WorkflowEventType =
  | "run_started"
  | "step_started"
  | "step_completed"
  | "step_failed"
  | "approval_required"
  | "run_completed"
  | "run_failed";

export interface WorkflowEvent {
  readonly type: WorkflowEventType;
  readonly runId: string;
  readonly stepId?: string;
  readonly timestamp: string;
  readonly data: Record<string, unknown>;
}
