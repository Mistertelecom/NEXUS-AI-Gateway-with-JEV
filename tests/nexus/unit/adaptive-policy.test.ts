import assert from "node:assert/strict";
import test from "node:test";

import * as policy from "../../../src/nexus/jev/executionPolicy";
import { buildNexusPairCombo } from "../../../src/nexus/pairs/definition";
import { createComboSchema } from "../../../src/shared/validation/schemas/combo";

const plan = {
  version: 1 as const,
  goal: "Create a bounded string helper.",
  risk: "low" as const,
  scope: "localized" as const,
  touchesAuth: false,
  confidence: 0.95,
  reviewRequired: false,
  steps: [
    {
      id: "generate-helper",
      kind: "generate" as const,
      instruction: "Implement the specified helper and include an example.",
      acceptance: { format: "text" as const, minLength: 10 },
    },
  ],
};

test("uses one Lead planning call and one economical Worker for a bounded Lead plan", () => {
  const decision = policy.evaluateLeadPlan(plan, "Write a pure string helper.");
  assert.equal(decision.path, "cheap_worker");
  assert.equal(decision.estimatedCallClass, "lead_worker");
  assert.equal(decision.leadCalls, 1);
  assert.equal(decision.workerCalls, 1);
  assert.equal(decision.requiresReview, false);
  assert.equal(decision.mode, "local_deterministic");
  assert.equal(decision.estimatedCostUsd, null);
});

test("allows jev_direct only when the Lead plan contains supported local operations", () => {
  const decision = policy.evaluateLeadPlan(
    {
      ...plan,
      steps: [
        {
          id: "format",
          kind: "local",
          task: { kind: "format_json", source: '{"v":42}' },
          acceptance: { format: "json", minLength: 1 },
        },
      ],
    },
    "Format the supplied JSON."
  );
  assert.equal(decision.path, "jev_direct");
  assert.equal(decision.estimatedCallClass, "lead_only");
  assert.equal(decision.leadCalls, 1);
  assert.equal(decision.workerCalls, 0);
});

for (const request of [
  "Implement authentication with JWT and password recovery.",
  "Refactor multiple services and migrate the database architecture.",
  `Write a function. ${"x".repeat(18000)}`,
]) {
  test(`requires Lead review despite an under-scoped plan: ${request.slice(0, 65)}`, () => {
    const decision = policy.evaluateLeadPlan(plan, request);
    assert.equal(decision.path, "lead_escalation");
    assert.equal(decision.requiresReview, true);
    assert.equal(decision.leadCalls, 2);
  });
}

test("requires Lead review for uncertain planning", () => {
  const decision = policy.evaluateLeadPlan({ ...plan, confidence: 0.4 }, "Write a helper.");
  assert.equal(decision.path, "lead_escalation");
  assert.ok(decision.reasons.includes("low_plan_confidence"));
});

test("persists Lead-plan-once policy with exact models and compression", () => {
  const combo = buildNexusPairCombo({
    name: "Adaptive code",
    leadModel: "configured/lead-v1",
    workerModel: "configured/chat-v2",
    compressionMode: "stacked",
    jevMode: "adaptive",
  });
  const persisted = createComboSchema.parse(combo);
  assert.deepEqual(
    combo.models.map((step) => step.model),
    ["configured/lead-v1", "configured/chat-v2", "configured/lead-v1"]
  );
  assert.deepEqual(persisted.config?.nexusPair, {
    version: 1,
    policy: "lead-plan-once-jev-execute",
    leadModel: "configured/lead-v1",
    workerModel: "configured/chat-v2",
    workerReasoning: "none",
  });
  assert.equal(persisted.config?.compressionMode, "stacked");
});
