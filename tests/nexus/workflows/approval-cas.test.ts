import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import * as db from "../../../src/lib/db/nexusWorkflows.ts";

test("approval is consumed once and only by its owning workflow run", () => {
  const suffix = randomUUID();
  const workflowId = `workflow_${suffix}`;
  const runId = `run_${suffix}`;
  const approvalId = `approval_${suffix}`;

  db.upsertWorkflow({
    schemaVersion: "nexus.workflow/v1",
    id: workflowId,
    name: "Approval CAS",
    steps: [],
  });
  db.insertWorkflowRun({
    id: runId,
    workflowId,
    status: "waiting_approval",
    startedAt: new Date().toISOString(),
    inputs: {},
    outputs: {},
    stepRuns: {},
    totalTokensUsed: { input: 0, output: 0, total: 0 },
  });
  db.createApproval({
    id: approvalId,
    runId,
    stepId: "approve",
    title: "Approve",
    description: "Approve once",
    data: {},
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  assert.equal(
    db.consumePendingApproval(`wrong_${suffix}`, approvalId, "approved", "wrong run"),
    null
  );
  const consumed = db.consumePendingApproval(runId, approvalId, "approved", "ok");
  assert.equal(consumed?.id, approvalId);
  assert.equal(consumed?.runId, runId);
  assert.equal(consumed?.status, "approved");
  assert.equal(db.consumePendingApproval(runId, approvalId, "rejected", "duplicate"), null);
});

test("workflow run lease excludes another owner and releases for the next pass", () => {
  // Given one persisted workflow run and two independent scheduler owners.
  const suffix = randomUUID();
  const workflowId = `workflow_lease_${suffix}`;
  const runId = `run_lease_${suffix}`;
  db.upsertWorkflow({
    schemaVersion: "nexus.workflow/v1",
    id: workflowId,
    name: "Lease ownership",
    steps: [],
  });
  db.insertWorkflowRun({
    id: runId,
    workflowId,
    status: "running",
    startedAt: new Date().toISOString(),
    inputs: {},
    outputs: {},
    stepRuns: {},
    totalTokensUsed: { input: 0, output: 0, total: 0 },
  });

  // When the first owner holds the lease and then releases it.
  const firstAcquired = db.acquireWorkflowRunLease(runId, "first-owner", 60000);
  const secondBlocked = db.acquireWorkflowRunLease(runId, "second-owner", 60000);
  const wrongOwnerReleased = db.releaseWorkflowRunLease(runId, "second-owner");
  const firstReleased = db.releaseWorkflowRunLease(runId, "first-owner");
  const secondAcquired = db.acquireWorkflowRunLease(runId, "second-owner", 60000);

  // Then another DAG pass cannot overlap, but it can continue after release.
  assert.equal(firstAcquired, true);
  assert.equal(secondBlocked, false);
  assert.equal(wrongOwnerReleased, false);
  assert.equal(firstReleased, true);
  assert.equal(secondAcquired, true);
});

test("step run upsert preserves one logical step for a workflow run", () => {
  // Given one run and two updates for its same logical step.
  const suffix = randomUUID();
  const workflowId = `workflow_step_${suffix}`;
  const runId = `run_step_${suffix}`;
  db.upsertWorkflow({
    schemaVersion: "nexus.workflow/v1",
    id: workflowId,
    name: "Logical step uniqueness",
    steps: [],
  });
  db.insertWorkflowRun({
    id: runId,
    workflowId,
    status: "running",
    startedAt: new Date().toISOString(),
    inputs: {},
    outputs: {},
    stepRuns: {},
    totalTokensUsed: { input: 0, output: 0, total: 0 },
  });
  db.upsertStepRun({
    id: `step_first_${suffix}`,
    runId,
    stepId: "validate",
    type: "test_runner",
    status: "running",
    inputs: {},
    outputs: { phase: "started" },
  });

  // When completion is recorded for that same run and step id.
  db.upsertStepRun({
    id: `step_second_${suffix}`,
    runId,
    stepId: "validate",
    type: "test_runner",
    status: "succeeded",
    inputs: {},
    outputs: { phase: "completed" },
  });
  const stepRuns = db.getWorkflowRun(runId)?.stepRuns;

  // Then the original row is updated instead of creating another logical step.
  assert.equal(Object.keys(stepRuns || {}).length, 1);
  assert.equal(stepRuns?.["validate"]?.id, `step_first_${suffix}`);
  assert.equal(stepRuns?.["validate"]?.status, "succeeded");
  assert.deepEqual(stepRuns?.["validate"]?.outputs, { phase: "completed" });
});
