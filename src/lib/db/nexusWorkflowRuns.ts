import { getDbInstance } from "./core";
import type { StepRun, WorkflowRun, WorkflowStatus } from "@/nexus/workflows/schema";

type WorkflowRunRow = {
  id: string;
  workflow_id: string;
  status: WorkflowStatus;
  inputs: string | null;
  outputs: string | null;
  current_step_id: string | null;
  lease_owner: string | null;
  lease_expires_at: string | null;
  started_at: string;
  completed_at: string | null;
  total_tokens_used: string | null;
  error: string | null;
};

type StepRunRow = {
  id: string;
  run_id: string;
  step_id: string;
  type: StepRun["type"];
  status: StepRun["status"];
  started_at: string | null;
  completed_at: string | null;
  inputs: string | null;
  outputs: string | null;
  tokens_used: string | null;
  error: string | null;
};

type QueryParameter = string | number | null;

const EMPTY_TOKENS = { input: 0, output: 0, total: 0 };

export function insertWorkflowRun(run: WorkflowRun): void {
  getDbInstance()
    .prepare(
      `INSERT INTO nexus_workflow_runs (
        id, workflow_id, status, inputs, outputs, current_step_id, lease_owner, lease_expires_at,
        started_at, completed_at, total_tokens_used, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      run.id,
      run.workflowId,
      run.status,
      JSON.stringify(run.inputs || {}),
      JSON.stringify(run.outputs || {}),
      run.currentStepId || null,
      run.leaseOwner || null,
      run.leaseExpiresAt || null,
      run.startedAt,
      run.completedAt || null,
      JSON.stringify(run.totalTokensUsed || EMPTY_TOKENS),
      run.error || null
    );
}

export function updateWorkflowRun(updates: Partial<WorkflowRun> & { id: string }): void {
  const fields: string[] = [];
  const parameters: QueryParameter[] = [];
  const values = [
    ["status = ?", updates.status],
    ["outputs = ?", updates.outputs === undefined ? undefined : JSON.stringify(updates.outputs)],
    ["current_step_id = ?", updates.currentStepId],
    ["lease_owner = ?", updates.leaseOwner],
    ["lease_expires_at = ?", updates.leaseExpiresAt],
    ["completed_at = ?", updates.completedAt],
    [
      "total_tokens_used = ?",
      updates.totalTokensUsed === undefined ? undefined : JSON.stringify(updates.totalTokensUsed),
    ],
    ["error = ?", updates.error],
  ] as const;

  for (const [field, value] of values) {
    if (value === undefined) continue;
    fields.push(field);
    parameters.push(value);
  }
  if (fields.length === 0) return;

  parameters.push(updates.id);
  getDbInstance()
    .prepare(`UPDATE nexus_workflow_runs SET ${fields.join(", ")} WHERE id = ?`)
    .run(...parameters);
}

export function getWorkflowRun(id: string): WorkflowRun | null {
  const db = getDbInstance();
  const row = db.prepare("SELECT * FROM nexus_workflow_runs WHERE id = ?").get(id) as
    WorkflowRunRow | undefined;
  if (!row) return null;

  const stepRuns: Record<string, StepRun> = {};
  const stepRows = db
    .prepare("SELECT * FROM nexus_step_runs WHERE run_id = ?")
    .all(id) as StepRunRow[];
  for (const step of stepRows) {
    stepRuns[step.step_id] = {
      id: step.id,
      runId: step.run_id,
      stepId: step.step_id,
      type: step.type,
      status: step.status,
      startedAt: step.started_at || undefined,
      completedAt: step.completed_at || undefined,
      inputs: step.inputs ? JSON.parse(step.inputs) : {},
      outputs: step.outputs ? JSON.parse(step.outputs) : {},
      error: step.error || undefined,
      tokensUsed: step.tokens_used ? JSON.parse(step.tokens_used) : EMPTY_TOKENS,
    };
  }

  return {
    id: row.id,
    workflowId: row.workflow_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at || undefined,
    currentStepId: row.current_step_id || undefined,
    inputs: row.inputs ? JSON.parse(row.inputs) : {},
    outputs: row.outputs ? JSON.parse(row.outputs) : {},
    stepRuns,
    leaseOwner: row.lease_owner || undefined,
    leaseExpiresAt: row.lease_expires_at || undefined,
    totalTokensUsed: row.total_tokens_used ? JSON.parse(row.total_tokens_used) : EMPTY_TOKENS,
    error: row.error || undefined,
  };
}

export function listWorkflowRuns(workflowId?: string, limit = 50): WorkflowRun[] {
  const query = workflowId
    ? "SELECT id FROM nexus_workflow_runs WHERE workflow_id = ? ORDER BY started_at DESC LIMIT ?"
    : "SELECT id FROM nexus_workflow_runs ORDER BY started_at DESC LIMIT ?";
  const parameters: QueryParameter[] = workflowId ? [workflowId, limit] : [limit];
  const rows = getDbInstance()
    .prepare(query)
    .all(...parameters) as { id: string }[];
  return rows.flatMap((row) => {
    const run = getWorkflowRun(row.id);
    return run ? [run] : [];
  });
}

export function upsertStepRun(stepRun: StepRun): void {
  getDbInstance()
    .prepare(
      `INSERT INTO nexus_step_runs (
        id, run_id, step_id, type, status, inputs, outputs, tokens_used, error, started_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(run_id, step_id) DO UPDATE SET
        status = excluded.status, inputs = excluded.inputs, outputs = excluded.outputs,
        tokens_used = excluded.tokens_used, error = excluded.error, started_at = excluded.started_at,
        completed_at = excluded.completed_at`
    )
    .run(
      stepRun.id,
      stepRun.runId,
      stepRun.stepId,
      stepRun.type,
      stepRun.status,
      JSON.stringify(stepRun.inputs || {}),
      JSON.stringify(stepRun.outputs || {}),
      JSON.stringify(stepRun.tokensUsed || EMPTY_TOKENS),
      stepRun.error || null,
      stepRun.startedAt || null,
      stepRun.completedAt || null
    );
}
