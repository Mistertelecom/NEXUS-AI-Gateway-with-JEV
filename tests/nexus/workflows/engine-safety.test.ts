import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import type { WorkflowEvent } from "../../../src/nexus/workflows/engine";
import type { StepType, WorkflowDefinition } from "../../../src/nexus/workflows/schema";

const directory = mkdtempSync(join(tmpdir(), "nexus-workflow-safety-"));
process.env.DATA_DIR = directory;
process.env.NEXUS_WORKSPACE_ROOT = directory;
mkdirSync(join(directory, ".git"));

const { resetDbInstance } = await import("../../../src/lib/db/core");
const db = await import("../../../src/lib/db/nexusWorkflows");
const { WorkflowEngine } = await import("../../../src/nexus/workflows/engine");

function waitForEvent(
  engine: InstanceType<typeof WorkflowEngine>,
  runId: string,
  terminalTypes: readonly WorkflowEvent["type"][]
): Promise<WorkflowEvent> {
  return new Promise<WorkflowEvent>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Workflow event timed out.")), 5000);
    const unsubscribe = engine.subscribe(runId, (event) => {
      if (!terminalTypes.includes(event.type)) return;
      clearTimeout(timeout);
      unsubscribe();
      resolve(event);
    });
  });
}

test.after(() => {
  resetDbInstance();
  rmSync(directory, { recursive: true, force: true });
});

for (const stepType of ["llm_call", "agent_task", "review"] satisfies readonly StepType[]) {
  test(`workflow rejects ${stepType} until it has a real executor`, async () => {
    // Given a workflow step whose alpha implementation previously fabricated success.
    const workflow: WorkflowDefinition = {
      schemaVersion: "nexus.workflow/v1",
      id: `unsupported-${stepType}`,
      name: `Unsupported ${stepType}`,
      steps: [{ id: "step", name: "Step", type: stepType, config: {} }],
    };

    // When execution starts, then the request fails closed before a run is persisted.
    await assert.rejects(WorkflowEngine.getInstance().startRun(workflow), (error: unknown) => {
      return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "NEXUS_WORKFLOW_STEP_UNSUPPORTED"
      );
    });
  });
}

test("workflow fails when a test command exits nonzero", async () => {
  // Given a real test step whose command reports failure.
  const workflow: WorkflowDefinition = {
    schemaVersion: "nexus.workflow/v1",
    id: "failing-test-command",
    name: "Failing test command",
    steps: [
      {
        id: "test",
        name: "Test",
        type: "test_runner",
        config: {
          command: { executable: "git", args: ["rev-parse", "HEAD"] },
          workspace: directory,
        },
      },
    ],
  };
  const engine = WorkflowEngine.getInstance();

  // When the workflow executes the command.
  const run = await engine.startRun(workflow);
  const terminalEvent = await new Promise<WorkflowEvent>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Workflow terminal event timed out.")), 5000);
    const unsubscribe = engine.subscribe(run.id, (event) => {
      if (event.type !== "run_failed" && event.type !== "run_completed") return;
      clearTimeout(timeout);
      unsubscribe();
      resolve(event);
    });
  });

  // Then a failing command cannot be recorded as a successful workflow.
  assert.equal(terminalEvent.type, "run_failed");
  assert.match(db.getWorkflowRun(run.id)?.error || "", /exit code 128/);
});

test("workflow fails when tool_exec has no command", async () => {
  // Given an executable step type without the command required by its contract.
  const workflow: WorkflowDefinition = {
    schemaVersion: "nexus.workflow/v1",
    id: "tool-command-missing",
    name: "Tool command missing",
    steps: [{ id: "tool", name: "Tool", type: "tool_exec", config: {} }],
  };
  const engine = WorkflowEngine.getInstance();

  // When the workflow reaches the tool step.
  const run = await engine.startRun(workflow);
  const persistedRun = db.getWorkflowRun(run.id);

  // Then it fails instead of treating the missing command as an empty success.
  assert.equal(persistedRun?.status, "failed");
  assert.match(persistedRun?.error || "", /requires a command/);
});

test("workflow completes an executable input to output DAG", async () => {
  // Given an executable DAG that exposes the input through an output step.
  const workflow: WorkflowDefinition = {
    schemaVersion: "nexus.workflow/v1",
    id: "input-to-output",
    name: "Input to output",
    defaultInputs: { objective: "preserve workflow behavior" },
    steps: [
      { id: "input", name: "Input", type: "input", config: {} },
      { id: "output", name: "Output", type: "output", dependsOn: ["input"], config: {} },
    ],
  };
  const engine = WorkflowEngine.getInstance();

  // When the workflow is started.
  const run = await engine.startRun(workflow);
  const terminalEvent = await new Promise<WorkflowEvent>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Workflow terminal event timed out.")), 5000);
    const unsubscribe = engine.subscribe(run.id, (event) => {
      if (event.type !== "run_failed" && event.type !== "run_completed") return;
      clearTimeout(timeout);
      unsubscribe();
      resolve(event);
    });
  });

  // Then the output step completes the DAG and publishes its final result.
  assert.equal(terminalEvent.type, "run_completed");
  assert.deepEqual(terminalEvent.data.outputs, {
    completed: true,
    finalSummary: "Workflow concluído com as etapas executadas.",
  });
});

test("workflow consumes approval once and only from its owning run", async () => {
  // Given a run paused at a human approval gate.
  const workflow: WorkflowDefinition = {
    schemaVersion: "nexus.workflow/v1",
    id: "approval-cas-engine",
    name: "Approval CAS engine",
    steps: [
      { id: "gate", name: "Gate", type: "human_approval", config: {} },
      { id: "output", name: "Output", type: "output", dependsOn: ["gate"], config: {} },
    ],
  };
  const engine = WorkflowEngine.getInstance();
  const run = await engine.startRun(workflow);
  const [approval] = db.getPendingApprovals(run.id);
  assert.ok(approval);
  const terminalEvent = waitForEvent(engine, run.id, ["run_completed", "run_failed"]);

  // When a mismatched run and then a duplicate decision are submitted.
  const wrongRunAccepted = await engine.handleApproval("another-run", approval.id, "approved");
  const firstDecisionAccepted = await engine.handleApproval(run.id, approval.id, "approved");
  const duplicateAccepted = await engine.handleApproval(run.id, approval.id, "rejected");

  // Then only the owning run's first decision resumes the DAG.
  assert.equal(wrongRunAccepted, false);
  assert.equal(firstDecisionAccepted, true);
  assert.equal(duplicateAccepted, false);
  assert.equal((await terminalEvent).type, "run_completed");
  assert.equal(db.getPendingApprovals(run.id).length, 0);
});

test("workflow cannot bypass human approval through autoApprove", async () => {
  const workflow: WorkflowDefinition = {
    schemaVersion: "nexus.workflow/v1",
    id: "automatic-approval-denied",
    name: "Human gate",
    steps: [
      { id: "gate", name: "Gate", type: "human_approval", config: { autoApprove: true } },
      { id: "output", name: "Output", type: "output", dependsOn: ["gate"], config: {} },
    ],
  };
  const engine = WorkflowEngine.getInstance();
  const run = await engine.startRun(workflow);
  const [approval] = db.getPendingApprovals(run.id);
  assert.ok(approval);
  assert.equal(db.getWorkflowRun(run.id)?.status, "waiting_approval");
  const terminal = waitForEvent(engine, run.id, ["run_completed", "run_failed"]);
  assert.equal(await engine.handleApproval(run.id, approval.id, "approved"), true);
  assert.equal((await terminal).type, "run_completed");
});
