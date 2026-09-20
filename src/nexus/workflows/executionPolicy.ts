import type { StepType, WorkflowDefinition } from "./schema";

const EXECUTABLE_STEP_TYPES = new Set<StepType>([
  "input",
  "jev_eval",
  "tool_exec",
  "test_runner",
  "human_approval",
  "output",
]);

export class UnsupportedWorkflowStepError extends Error {
  public readonly code = "NEXUS_WORKFLOW_STEP_UNSUPPORTED";

  public constructor(public readonly stepType: StepType) {
    super(`Workflow step '${stepType}' does not have a real executor in this alpha release.`);
    this.name = "UnsupportedWorkflowStepError";
  }
}

export class WorkflowCommandFailedError extends Error {
  public readonly code = "NEXUS_WORKFLOW_COMMAND_FAILED";

  public constructor(
    public readonly stepType: "test_runner" | "tool_exec",
    public readonly exitCode: number
  ) {
    super(`Workflow ${stepType} command failed with exit code ${exitCode}.`);
    this.name = "WorkflowCommandFailedError";
  }
}

export class WorkflowCommandMissingError extends Error {
  public readonly code = "NEXUS_WORKFLOW_COMMAND_MISSING";

  public constructor(public readonly stepType: "tool_exec") {
    super(`Workflow ${stepType} requires a command.`);
    this.name = "WorkflowCommandMissingError";
  }
}

export function assertWorkflowExecutable(workflow: WorkflowDefinition): void {
  const unsupportedStep = workflow.steps.find((step) => !EXECUTABLE_STEP_TYPES.has(step.type));
  if (unsupportedStep) {
    throw new UnsupportedWorkflowStepError(unsupportedStep.type);
  }
  assertExecutableDag(workflow);
}

export class InvalidWorkflowDefinitionError extends Error {
  public readonly code = "NEXUS_WORKFLOW_INVALID";
  public constructor(message: string) {
    super(message);
    this.name = "InvalidWorkflowDefinitionError";
  }
}

function assertExecutableDag(workflow: WorkflowDefinition): void {
  if (!workflow.steps.length || workflow.steps.length > 100)
    throw new InvalidWorkflowDefinitionError(
      "Workflow must contain between 1 and 100 executable steps."
    );
  if (
    workflow.maxBudgetTokens !== undefined ||
    workflow.steps.some((step) => step.retryPolicy !== undefined)
  ) {
    throw new InvalidWorkflowDefinitionError(
      "Budgets and retries are not enforced in this alpha and cannot be requested."
    );
  }
  const steps = new Map(workflow.steps.map((step) => [step.id, step]));
  if (steps.size !== workflow.steps.length)
    throw new InvalidWorkflowDefinitionError("Duplicate workflow step IDs.");
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    const step = steps.get(id);
    if (!step) throw new InvalidWorkflowDefinitionError(`Unknown workflow dependency: ${id}`);
    if (visiting.has(id)) throw new InvalidWorkflowDefinitionError("Workflow dependency cycle.");
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of step.dependsOn ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of steps.keys()) visit(id);
}
