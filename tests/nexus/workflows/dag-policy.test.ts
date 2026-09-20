import assert from "node:assert/strict";
import test from "node:test";
import { assertWorkflowExecutable } from "../../../src/nexus/workflows/executionPolicy";
import type { WorkflowDefinition, WorkflowStep } from "../../../src/nexus/workflows/schema";

const input: WorkflowStep = { id: "input", name: "Input", type: "input", config: {} };
const definition = (steps: WorkflowStep[]): WorkflowDefinition => ({
  schemaVersion: "nexus.workflow/v1",
  id: "dag-policy",
  name: "DAG policy",
  steps,
});
for (const [label, steps] of Object.entries({
  empty: [],
  duplicate: [input, input],
  missing: [{ ...input, dependsOn: ["missing"] }],
  cycle: [{ ...input, dependsOn: ["input"] }],
})) {
  test(`workflow rejects ${label} DAG before creating a run`, () => {
    assert.throws(
      () => assertWorkflowExecutable(definition(steps)),
      /Workflow|workflow|Duplicate|Unknown/
    );
  });
}
test("workflow rejects unenforced retry and budget contracts", () => {
  assert.throws(() => assertWorkflowExecutable({ ...definition([input]), maxBudgetTokens: 10 }));
  assert.throws(() =>
    assertWorkflowExecutable(
      definition([{ ...input, retryPolicy: { maxAttempts: 2 } as WorkflowStep["retryPolicy"] }])
    )
  );
});
test("workflow accepts an executable bounded DAG", () => {
  assert.doesNotThrow(() =>
    assertWorkflowExecutable(
      definition([
        input,
        { id: "output", name: "Output", type: "output", config: {}, dependsOn: ["input"] },
      ])
    )
  );
});
