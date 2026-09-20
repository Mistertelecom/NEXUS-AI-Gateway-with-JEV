import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { NextRequest } from "next/server";

const directory = mkdtempSync(join(tmpdir(), "nexus-workflow-api-"));
process.env.DATA_DIR = directory;

const { resetDbInstance } = await import("../../../src/lib/db/core");
const db = await import("../../../src/lib/db/nexusWorkflows");
const workflowsRoute = await import("../../../src/app/api/nexus/workflows/route");
const runsRoute = await import("../../../src/app/api/nexus/workflows/runs/route");
const approvalRoute = await import("../../../src/app/api/nexus/workflows/runs/[id]/approval/route");
const eventsRoute = await import("../../../src/app/api/nexus/workflows/runs/[id]/events/route");

function request(url: string, body?: Record<string, unknown>): NextRequest {
  return new NextRequest(url, {
    method: body ? "POST" : "GET",
    ...(body
      ? { body: JSON.stringify(body), headers: { "content-type": "application/json" } }
      : {}),
  });
}

test.after(() => {
  resetDbInstance();
  rmSync(directory, { recursive: true, force: true });
});

test("workflow routes reject invalid JSON shapes with a client error", async () => {
  // Given bodies that do not satisfy the workflow and run schemas.
  const invalidWorkflow = request("http://nexus.test/api/nexus/workflows", {});
  const invalidRun = request("http://nexus.test/api/nexus/workflows/runs", {
    pipelineConfig: { jevBackend: "unknown" },
  });

  // When each boundary parses the body.
  const workflowResponse = await workflowsRoute.POST(invalidWorkflow);
  const runResponse = await runsRoute.POST(invalidRun);

  // Then neither invalid body reaches the workflow engine.
  assert.equal(workflowResponse.status, 400);
  assert.equal(runResponse.status, 400);
});

test("approval route binds its decision to the path run identifier", async () => {
  // Given one pending approval owned by a persisted run.
  const workflowId = "api-approval-workflow";
  const runId = "api-approval-run";
  const approvalId = "api-approval";
  db.upsertWorkflow({
    schemaVersion: "nexus.workflow/v1",
    id: workflowId,
    name: "API approval",
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
    stepId: "approval",
    title: "Approval",
    description: "Bound to run",
    data: {},
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // When the approval id is sent through another run's route.
  const response = await approvalRoute.POST(
    request("http://nexus.test/api/nexus/workflows/runs/another-run/approval", {
      approvalId,
      decision: "approved",
    }),
    { params: Promise.resolve({ id: "another-run" }) }
  );

  // Then the approval remains pending for its owner.
  assert.equal(response.status, 404);
  assert.equal(db.getPendingApprovals(runId).length, 1);
});

test("events route returns not found for an unknown run", async () => {
  // Given an event stream request for no persisted run.
  const req = request("http://nexus.test/api/nexus/workflows/runs/missing/events");

  // When the route resolves the run before opening a stream.
  const response = await eventsRoute.GET(req, { params: Promise.resolve({ id: "missing" }) });

  // Then it returns a regular not-found response, not an open SSE stream.
  assert.equal(response.status, 404);
});
