import { randomUUID } from "crypto";

import * as db from "@/lib/db/nexusWorkflows";
import { SafeConditionEvaluator } from "./evaluator";
import { assertWorkflowExecutable } from "./executionPolicy";
import type { StepRun, WorkflowDefinition, WorkflowRun, WorkflowStepDefinition } from "./schema";
import type { WorkflowEvent } from "./workflowEvents";
import { executeWorkflowStep, type WorkflowStepExecutorDependencies } from "./workflowStepExecutor";

type WorkflowDagExecutorDependencies = WorkflowStepExecutorDependencies & {
  readonly leaseOwner: string;
  readonly emit: (event: WorkflowEvent) => void;
  readonly failRun: (runId: string, errorMessage: string) => Promise<void>;
  readonly completeRun: (runId: string, outputs: Record<string, unknown>) => Promise<void>;
};

const WORKFLOW_LEASE_DURATION_MS = 360000;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function createSkippedStepRun(step: WorkflowStepDefinition, runId: string): StepRun {
  return {
    id: `step_${randomUUID()}`,
    runId,
    stepId: step.id,
    type: step.type,
    status: "skipped",
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    inputs: {},
    outputs: { skippedReason: "Condition evaluated to false" },
  };
}

function createRunningStepRun(step: WorkflowStepDefinition, runId: string): StepRun {
  return {
    id: `step_${randomUUID()}`,
    runId,
    stepId: step.id,
    type: step.type,
    status: "running",
    startedAt: new Date().toISOString(),
    inputs: step.config,
  };
}

function completedStepIds(run: WorkflowRun): Set<string> {
  return new Set(
    Object.values(run.stepRuns)
      .filter((stepRun) => stepRun.status === "succeeded" || stepRun.status === "skipped")
      .map((stepRun) => stepRun.stepId)
  );
}

function getReadySteps(workflow: WorkflowDefinition, run: WorkflowRun): WorkflowStepDefinition[] {
  const completed = completedStepIds(run);
  return workflow.steps.filter((step) => {
    if (completed.has(step.id)) return false;
    return (step.dependsOn || []).every((dependencyId) => completed.has(dependencyId));
  });
}

function isPending(run: WorkflowRun): boolean {
  return Object.values(run.stepRuns).some(
    (stepRun) => stepRun.status === "running" || stepRun.status === "waiting_approval"
  );
}

function shouldSkip(step: WorkflowStepDefinition, run: WorkflowRun): boolean {
  if (!step.when) return false;
  return !SafeConditionEvaluator.evaluate(step.when, {
    inputs: run.inputs,
    outputs: run.outputs,
    steps: Object.fromEntries(
      Object.entries(run.stepRuns).map(([stepId, stepRun]) => [
        stepId,
        { status: stepRun.status, outputs: stepRun.outputs || {} },
      ])
    ),
  });
}

export async function executeWorkflowDag(
  workflow: WorkflowDefinition,
  runId: string,
  dependencies: WorkflowDagExecutorDependencies
): Promise<void> {
  if (!db.acquireWorkflowRunLease(runId, dependencies.leaseOwner, WORKFLOW_LEASE_DURATION_MS)) {
    return;
  }

  try {
    await executeLeasedWorkflowDag(workflow, runId, dependencies);
  } finally {
    db.releaseWorkflowRunLease(runId, dependencies.leaseOwner);
  }
}

async function executeLeasedWorkflowDag(
  workflow: WorkflowDefinition,
  runId: string,
  dependencies: WorkflowDagExecutorDependencies
): Promise<void> {
  assertWorkflowExecutable(workflow);
  if (!db.refreshWorkflowRunLease(runId, dependencies.leaseOwner, WORKFLOW_LEASE_DURATION_MS)) {
    return;
  }
  let run = db.getWorkflowRun(runId);
  if (!run || run.status === "failed" || run.status === "cancelled") return;

  const readySteps = getReadySteps(workflow, run);
  if (readySteps.length === 0) {
    if (completedStepIds(run).size === workflow.steps.length) {
      await dependencies.completeRun(runId, run.outputs);
    } else if (!isPending(run)) {
      await dependencies.failRun(
        runId,
        "Execução interrompida: etapas restantes possuem dependências não satisfeitas ou inacessíveis no fluxo DAG."
      );
    }
    return;
  }

  for (const step of readySteps) {
    if (!db.refreshWorkflowRunLease(runId, dependencies.leaseOwner, WORKFLOW_LEASE_DURATION_MS)) {
      return;
    }
    const refreshedRun = db.getWorkflowRun(runId);
    if (!refreshedRun || refreshedRun.status !== "running") return;
    run = refreshedRun;

    if (shouldSkip(step, run)) {
      db.upsertStepRun(createSkippedStepRun(step, runId));
      continue;
    }

    const stepRun = createRunningStepRun(step, runId);
    db.upsertStepRun(stepRun);
    db.updateWorkflowRun({ id: runId, currentStepId: step.id });
    dependencies.emit({
      type: "step_started",
      runId,
      stepId: step.id,
      timestamp: stepRun.startedAt || new Date().toISOString(),
      data: { stepName: step.name, type: step.type },
    });

    try {
      const result = await executeWorkflowStep(step, run, dependencies);
      if (result.requiresApproval) {
        stepRun.status = "waiting_approval";
        stepRun.outputs = result.outputs;
        db.upsertStepRun(stepRun);
        db.updateWorkflowRun({ id: runId, status: "waiting_approval" });

        const approvalId = `appr_${randomUUID()}`;
        db.createApproval({
          id: approvalId,
          runId,
          stepId: step.id,
          title: result.approvalTitle || `Aprovação: ${step.name}`,
          description: result.approvalDescription || "Aprovação humana necessária para prosseguir.",
          data: result.outputs || {},
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        dependencies.emit({
          type: "approval_required",
          runId,
          stepId: step.id,
          timestamp: new Date().toISOString(),
          data: { approvalId, title: step.name, outputs: result.outputs },
        });
        return;
      }

      stepRun.status = "succeeded";
      stepRun.outputs = result.outputs;
      stepRun.completedAt = new Date().toISOString();
      if (result.tokensUsed) {
        stepRun.tokensUsed = result.tokensUsed;
        run.totalTokensUsed.input += result.tokensUsed.input;
        run.totalTokensUsed.output += result.tokensUsed.output;
        run.totalTokensUsed.total += result.tokensUsed.total;
        db.updateWorkflowRun({ id: runId, totalTokensUsed: run.totalTokensUsed });
      }
      db.upsertStepRun(stepRun);

      if (step.type === "output" || result.outputs?.["publish"]) {
        run.outputs = { ...run.outputs, ...result.outputs };
        db.updateWorkflowRun({ id: runId, outputs: run.outputs });
      }
      dependencies.emit({
        type: "step_completed",
        runId,
        stepId: step.id,
        timestamp: stepRun.completedAt,
        data: { outputs: result.outputs, tokensUsed: result.tokensUsed },
      });
    } catch (error) {
      const message = errorMessage(error);
      stepRun.status = "failed";
      stepRun.error = message;
      stepRun.completedAt = new Date().toISOString();
      db.upsertStepRun(stepRun);
      await dependencies.failRun(runId, `Falha na etapa '${step.name}': ${message}`);
      return;
    }
  }

  await executeLeasedWorkflowDag(workflow, runId, dependencies);
}
