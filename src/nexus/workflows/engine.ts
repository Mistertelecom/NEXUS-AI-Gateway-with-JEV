import { randomUUID } from "crypto";

import * as db from "@/lib/db/nexusWorkflows";
import { assertWorkflowExecutable } from "./executionPolicy";
import type { WorkflowDefinition, WorkflowRun } from "./schema";
import { executeWorkflowDag } from "./workflowDagExecutor";
import type { WorkflowEvent } from "./workflowEvents";
import { JevClassifier, type JevSemanticClassifier } from "../jev/classifier";
import { ManagedRunner } from "../runner/managedRunner";

export type { WorkflowEvent } from "./workflowEvents";

type WorkflowEventListener = (event: WorkflowEvent) => void;

function suppressListenerFailure(error: unknown): void {
  if (error instanceof Error) return;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private readonly runner: ManagedRunner;
  private readonly jevClassifier: JevSemanticClassifier;
  private readonly eventListeners = new Map<string, WorkflowEventListener[]>();
  private readonly activePasses = new Map<string, Promise<void>>();

  private constructor() {
    this.runner = new ManagedRunner();
    this.jevClassifier = new JevClassifier();
  }

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  public subscribe(runId: string, listener: WorkflowEventListener): () => void {
    const listeners = this.eventListeners.get(runId) || [];
    listeners.push(listener);
    this.eventListeners.set(runId, listeners);

    return () => {
      const currentListeners = this.eventListeners.get(runId) || [];
      this.eventListeners.set(
        runId,
        currentListeners.filter((currentListener) => currentListener !== listener)
      );
    };
  }

  public async startRun(
    workflow: WorkflowDefinition,
    inputs: Record<string, unknown> = {}
  ): Promise<WorkflowRun> {
    assertWorkflowExecutable(workflow);
    db.upsertWorkflow(workflow);

    const runId = `run_${randomUUID()}`;
    const initialRun: WorkflowRun = {
      id: runId,
      workflowId: workflow.id,
      status: "running",
      startedAt: new Date().toISOString(),
      inputs: { ...workflow.defaultInputs, ...inputs },
      outputs: {},
      stepRuns: {},
      totalTokensUsed: { input: 0, output: 0, total: 0 },
    };
    db.insertWorkflowRun(initialRun);
    this.emit({
      type: "run_started",
      runId,
      timestamp: initialRun.startedAt,
      data: { workflowId: workflow.id, inputs: initialRun.inputs },
    });
    this.runDag(workflow, runId);

    return initialRun;
  }

  public async handleApproval(
    runId: string,
    approvalId: string,
    decision: "approved" | "rejected",
    feedback?: string
  ): Promise<boolean> {
    const target = db.consumePendingApproval(runId, approvalId, decision, feedback);
    if (!target) return false;

    const run = db.getWorkflowRun(runId);
    if (!run) return false;

    const workflow = db.getWorkflow(run.workflowId);
    if (!workflow) return false;

    const stepRun = run.stepRuns[target.stepId];
    if (decision === "rejected") {
      if (stepRun) {
        stepRun.status = "failed";
        stepRun.error = `Rejeitado na aprovação humana: ${feedback || "Sem justificativa"}`;
        stepRun.completedAt = new Date().toISOString();
        db.upsertStepRun(stepRun);
      }
      await this.failRun(run.id, `Execução rejeitada na aprovação humana: ${feedback || ""}`);
      return true;
    }

    if (stepRun) {
      stepRun.status = "succeeded";
      stepRun.completedAt = new Date().toISOString();
      stepRun.outputs = { approved: true, feedback };
      db.upsertStepRun(stepRun);
    }
    db.updateWorkflowRun({ id: run.id, status: "running" });
    this.runDag(workflow, run.id);

    return true;
  }

  private emit(event: WorkflowEvent): void {
    for (const listener of this.eventListeners.get(event.runId) || []) {
      try {
        listener(event);
      } catch (error) {
        suppressListenerFailure(error);
      }
    }
  }

  private runDag(workflow: WorkflowDefinition, runId: string): void {
    const execute = () =>
      executeWorkflowDag(workflow, runId, {
        leaseOwner: `workflow-engine_${randomUUID()}`,
        runner: this.runner,
        jevClassifier: this.jevClassifier,
        emit: (event) => this.emit(event),
        failRun: (failedRunId, message) => this.failRun(failedRunId, message),
        completeRun: (completedRunId, outputs) => this.completeRun(completedRunId, outputs),
      });
    // A fast approval may arrive while the preceding pass is releasing its lease.
    // Queue the continuation after that pass; never overlap or silently lose it.
    const previous = this.activePasses.get(runId);
    const pass = (previous ? previous.then(execute) : execute()).catch((error) =>
      this.failRun(runId, errorMessage(error))
    );
    this.activePasses.set(runId, pass);
    void pass.then(() => {
      if (this.activePasses.get(runId) === pass) this.activePasses.delete(runId);
    });
  }

  private async failRun(runId: string, error: string): Promise<void> {
    const now = new Date().toISOString();
    db.updateWorkflowRun({ id: runId, status: "failed", completedAt: now, error });
    this.emit({ type: "run_failed", runId, timestamp: now, data: { error } });
  }

  private async completeRun(runId: string, outputs: Record<string, unknown>): Promise<void> {
    const now = new Date().toISOString();
    db.updateWorkflowRun({ id: runId, status: "succeeded", completedAt: now, outputs });
    this.emit({ type: "run_completed", runId, timestamp: now, data: { outputs } });
  }
}
