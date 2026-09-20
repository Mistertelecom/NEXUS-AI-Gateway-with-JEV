import { getDbInstance } from "./core";
import type { ApprovalRequest } from "@/nexus/workflows/schema";

type ApprovalRow = {
  id: string;
  run_id: string;
  step_id: string;
  title: string;
  description: string;
  data: string | null;
  status: "pending" | "approved" | "rejected";
  feedback: string | null;
  created_at: string;
  responded_at: string | null;
};

function approvalFromRow(row: ApprovalRow): ApprovalRequest {
  return {
    id: row.id,
    runId: row.run_id,
    stepId: row.step_id,
    title: row.title,
    description: row.description,
    data: row.data ? JSON.parse(row.data) : {},
    status: row.status,
    feedback: row.feedback || undefined,
    createdAt: row.created_at,
    respondedAt: row.responded_at || undefined,
  };
}

export function createApproval(approval: ApprovalRequest): void {
  getDbInstance()
    .prepare(
      `INSERT INTO nexus_approvals (id, run_id, step_id, title, description, data, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      approval.id,
      approval.runId,
      approval.stepId,
      approval.title,
      approval.description,
      JSON.stringify(approval.data || {}),
      approval.status,
      approval.createdAt
    );
}

export function updateApproval(
  id: string,
  status: "approved" | "rejected",
  feedback?: string
): boolean {
  return (
    getDbInstance()
      .prepare("UPDATE nexus_approvals SET status = ?, feedback = ?, responded_at = ? WHERE id = ?")
      .run(status, feedback || null, new Date().toISOString(), id).changes > 0
  );
}

export function consumePendingApproval(
  runId: string,
  id: string,
  status: "approved" | "rejected",
  feedback?: string
): ApprovalRequest | null {
  const db = getDbInstance();
  const result = db
    .prepare(
      `UPDATE nexus_approvals SET status = ?, feedback = ?, responded_at = ?
       WHERE id = ? AND run_id = ? AND status = 'pending'`
    )
    .run(status, feedback || null, new Date().toISOString(), id, runId);
  if (result.changes !== 1) return null;

  const row = db
    .prepare(
      `SELECT id, run_id, step_id, title, description, data, status, feedback, created_at, responded_at
       FROM nexus_approvals WHERE id = ? AND run_id = ?`
    )
    .get(id, runId) as ApprovalRow | undefined;
  return row ? approvalFromRow(row) : null;
}

export function getPendingApprovals(runId?: string): ApprovalRequest[] {
  const query = runId
    ? "SELECT * FROM nexus_approvals WHERE status = 'pending' AND run_id = ? ORDER BY created_at ASC"
    : "SELECT * FROM nexus_approvals WHERE status = 'pending' ORDER BY created_at ASC";
  const rows = (
    runId ? getDbInstance().prepare(query).all(runId) : getDbInstance().prepare(query).all()
  ) as ApprovalRow[];
  return rows.map(approvalFromRow);
}

export function acquireWorkflowRunLease(runId: string, owner: string, durationMs: number): boolean {
  const now = new Date();
  const result = getDbInstance()
    .prepare(
      `UPDATE nexus_workflow_runs SET lease_owner = ?, lease_expires_at = ?
       WHERE id = ? AND (lease_owner = ? OR lease_owner IS NULL OR lease_expires_at IS NULL OR lease_expires_at <= ?)`
    )
    .run(
      owner,
      new Date(now.getTime() + durationMs).toISOString(),
      runId,
      owner,
      now.toISOString()
    );
  return result.changes === 1;
}

export function refreshWorkflowRunLease(runId: string, owner: string, durationMs: number): boolean {
  const now = new Date();
  const result = getDbInstance()
    .prepare(
      `UPDATE nexus_workflow_runs SET lease_expires_at = ?
       WHERE id = ? AND lease_owner = ? AND lease_expires_at > ?`
    )
    .run(new Date(now.getTime() + durationMs).toISOString(), runId, owner, now.toISOString());
  return result.changes === 1;
}

export function releaseWorkflowRunLease(runId: string, owner: string): boolean {
  return (
    getDbInstance()
      .prepare(
        "UPDATE nexus_workflow_runs SET lease_owner = NULL, lease_expires_at = NULL WHERE id = ? AND lease_owner = ?"
      )
      .run(runId, owner).changes === 1
  );
}
