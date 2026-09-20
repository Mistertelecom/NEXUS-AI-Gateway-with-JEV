import type { WorkflowRun, WorkflowStepDefinition } from "./schema";
import {
  UnsupportedWorkflowStepError,
  WorkflowCommandFailedError,
  WorkflowCommandMissingError,
} from "./executionPolicy";
import type { JevSemanticClassifier } from "../jev/classifier";
import { ManagedRunner } from "../runner/managedRunner";
import { validateRunnerCommand } from "../runner/commandPolicy";

export type WorkflowStepResult = {
  readonly outputs?: Record<string, unknown>;
  readonly tokensUsed?: { readonly input: number; readonly output: number; readonly total: number };
  readonly requiresApproval?: boolean;
  readonly approvalTitle?: string;
  readonly approvalDescription?: string;
};

export type WorkflowStepExecutorDependencies = {
  readonly runner: ManagedRunner;
  readonly jevClassifier: JevSemanticClassifier;
};

type WorkflowStepConfig = Record<string, unknown>;

function firstNonEmptyString(values: readonly unknown[], fallback: string): string {
  for (const value of values) {
    if (typeof value === "string" && value) return value;
  }
  return fallback;
}

function positiveNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && value ? value : fallback;
}

export async function executeWorkflowStep(
  step: WorkflowStepDefinition,
  run: WorkflowRun,
  dependencies: WorkflowStepExecutorDependencies
): Promise<WorkflowStepResult> {
  const config: WorkflowStepConfig = step.config;
  const workspace = firstNonEmptyString(
    [config["workspace"], run.inputs["workspace"]],
    process.cwd()
  );

  switch (step.type) {
    case "input":
      return { outputs: { ...run.inputs } };
    case "jev_eval": {
      const prompt = firstNonEmptyString([config["prompt"], run.inputs["objective"]], "");
      const taskKind = await dependencies.jevClassifier.classifyTaskKind(prompt);
      const touchesAuth = await dependencies.jevClassifier.touchesAuthentication(prompt);
      const scope = await dependencies.jevClassifier.classifyScope(prompt);
      return {
        outputs: {
          task_kind: taskKind.answer,
          task_kind_confidence: taskKind.confidence,
          touches_auth: touchesAuth.answer,
          touches_auth_confidence: touchesAuth.confidence,
          scope: scope.answer,
          scope_confidence: scope.confidence,
        },
      };
    }
    case "test_runner": {
      const command = validateRunnerCommand(config["command"]);
      const result = await dependencies.runner.executeCommand(command, workspace, {
        timeoutMs: Math.min(
          positiveNumber(config["timeoutMs"], 60000),
          (step.timeoutSeconds ?? 60) * 1000
        ),
      });
      if (result.exitCode !== 0) {
        throw new WorkflowCommandFailedError("test_runner", result.exitCode);
      }
      return {
        outputs: {
          command,
          exitCode: result.exitCode,
          stdout: result.stdout.slice(-10000),
          stderr: result.stderr.slice(-5000),
          durationMs: result.durationMs,
          success: true,
        },
      };
    }
    case "tool_exec": {
      const command = config["command"];
      if (command === undefined) {
        throw new WorkflowCommandMissingError("tool_exec");
      }
      const result = await dependencies.runner.executeCommand(command, workspace, {
        timeoutMs: Math.min(
          positiveNumber(config["timeoutMs"], 60000),
          (step.timeoutSeconds ?? 60) * 1000
        ),
      });
      if (result.exitCode !== 0) {
        throw new WorkflowCommandFailedError("tool_exec", result.exitCode);
      }
      return { outputs: { ...result } };
    }
    case "human_approval":
      return {
        requiresApproval: true,
        approvalTitle: firstNonEmptyString([config["title"]], `Aprovação de Entrega: ${step.name}`),
        approvalDescription: firstNonEmptyString(
          [config["description"]],
          "Por favor revise o snapshot congelado do código e o relatório de testes antes da conclusão."
        ),
        outputs: {
          readyForApproval: true,
          snapshotReview: run.stepRuns["review"]?.outputs || {},
          testResults: run.stepRuns["test_runner"]?.outputs || {},
        },
      };
    case "output":
      return {
        outputs: {
          completed: true,
          finalSummary: "Workflow concluído com as etapas executadas.",
        },
      };
    default:
      throw new UnsupportedWorkflowStepError(step.type);
  }
}
