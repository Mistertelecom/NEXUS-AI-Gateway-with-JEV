import assert from "node:assert/strict";
import test from "node:test";

import { JevDecisionCache } from "../../../src/nexus/jev/cache";
import { NexusDecisionEngine } from "../../../src/nexus/jev/decisionEngine";
import type { SystemOneResponse } from "../../../src/nexus/jev/types";

const REQUEST = "Implement a localized formatter.";
const POLICY_VERSION = "nexus-policy-2026.1";

function cachedEngine(response: SystemOneResponse): NexusDecisionEngine {
  const cache = new JevDecisionCache();
  const key = JevDecisionCache.computeKey(
    { request: REQUEST, evidence: "" },
    "classification-rubric",
    "jev-latest",
    POLICY_VERSION
  );
  cache.set(key, response);
  return new NexusDecisionEngine(undefined, cache);
}

test("keeps model selection outside JEV when a cached classification is available", async () => {
  // Given: a measured semantic classification already stored in the JEV cache.
  const engine = cachedEngine({
    model: "jev-test",
    answers: {
      task_kind: {
        type: "choice",
        choice: "implementation",
        probabilities: { implementation: 0.96 },
        confidence: 0.96,
      },
      touches_auth: { type: "noul", noul: 0.1 },
      scope: {
        type: "score",
        score: 0.2,
        legend: { localized: "localized" },
        probabilities: { localized: 0.9 },
        confidence: 0.9,
      },
    },
    usage: { input_tokens: 8, output_tokens: 3 },
  });

  // When: the deterministic decision policy consumes that classification.
  const decision = await engine.decideRoute({ request: REQUEST });

  // Then: JEV requests review but invents neither a model selection nor a cost.
  assert.equal(decision.requiresReview, true);
  assert.equal(decision.estimatedCostUsd, null);
  assert.equal("selectedModel" in decision, false);
});

test("fails closed when a cached task kind is not recognized", async () => {
  // Given: a provider response containing a task kind unknown to this policy version.
  const engine = cachedEngine({
    model: "jev-test",
    answers: {
      task_kind: {
        type: "choice",
        choice: "future_kind",
        probabilities: { future_kind: 1 },
        confidence: 1,
      },
      touches_auth: { type: "noul", noul: 0 },
      scope: {
        type: "score",
        score: 0,
        legend: { localized: "localized" },
        probabilities: { localized: 1 },
        confidence: 1,
      },
    },
    usage: { input_tokens: 1, output_tokens: 1 },
  });

  // When: the cached response is parsed.
  const decision = await engine.decideRoute({ request: REQUEST });

  // Then: the unknown value becomes the conservative "other" category.
  assert.equal(decision.classification.taskKind, "other");
});
