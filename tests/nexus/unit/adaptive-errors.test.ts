import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { buildNexusPairCombo } from "../../../src/nexus/pairs/definition";
import type { LeadExecutionPlan } from "../../../src/nexus/jev/executionPlan";

const directory = mkdtempSync(join(tmpdir(), "nexus-errors-"));
process.env.DATA_DIR = directory;
const { handleNexusPairComboChat } = await import("../../../src/nexus/pairs/runtime");
const { resetDbInstance } = await import("../../../src/lib/db/core");
const { PROVIDER_MODELS } = await import("../../../open-sse/config/providerModels");
// Isolated transport fixture metadata; not a production catalog entry.
PROVIDER_MODELS["fixture"] = [
  { id: "worker", name: "Controlled fixture worker", supportsReasoning: false },
];
test.after(() => {
  resetDbInstance();
  rmSync(directory, { recursive: true, force: true });
});

const combo = buildNexusPairCombo({
  name: "Error test",
  leadModel: "fixture/lead",
  workerModel: "fixture/worker",
  compressionMode: "off",
  jevMode: "adaptive",
});
const plan: LeadExecutionPlan = {
  version: 1,
  goal: "Write a helper.",
  risk: "low",
  scope: "localized",
  touchesAuth: false,
  confidence: 0.95,
  reviewRequired: false,
  steps: [
    {
      id: "helper",
      kind: "generate",
      instruction: "Write a complete helper.",
      acceptance: { format: "text", minLength: 5 },
    },
  ],
};
const log = { info() {}, warn() {}, debug() {}, error() {} };
const completion = (content: string) =>
  Response.json({ choices: [{ message: { role: "assistant", content }, finish_reason: "stop" }] });

for (const failedStage of ["plan", "worker"] as const) {
  test(`Lead recovers when the ${failedStage} response reader fails`, async () => {
    // Given a response that fails at the actual response-reader boundary.
    const calls: string[] = [];
    const failureIndex = failedStage === "plan" ? 1 : 2;
    // When the inherited combo dispatch completes but its response stream fails.
    const response = await handleNexusPairComboChat({
      combo,
      body: { messages: [{ role: "user", content: "Write a helper." }] },
      log,
      settings: {},
      allCombos: [],
      handleSingleModel: async (_body, model) => {
        calls.push(model);
        if (calls.length === failureIndex)
          return new Response(
            new ReadableStream({
              start(controller) {
                controller.error(new TypeError("upstream read failed"));
              },
            })
          );
        return completion(calls.length === 1 ? JSON.stringify(plan) : "Lead recovered answer");
      },
    });
    // Then one bounded Lead escalation answers instead of leaking the I/O error.
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("X-Nexus-Path"), "lead_escalation");
    assert.deepEqual(
      calls,
      failedStage === "plan"
        ? ["fixture/lead", "fixture/lead"]
        : ["fixture/lead", "fixture/worker", "fixture/lead"]
    );
  });
}

test("Worker reasoning output forces one Lead escalation", async () => {
  // Given a Worker that ignores the disabled reasoning directive.
  const calls: string[] = [];
  // When an otherwise valid generated answer contains reasoning tokens.
  const response = await handleNexusPairComboChat({
    combo,
    body: { messages: [{ role: "user", content: "Write a helper." }] },
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (_body, model) => {
      calls.push(model);
      if (calls.length === 2)
        return Response.json({
          choices: [
            { message: { content: "generated helper", reasoning_content: "unexpected reasoning" } },
          ],
        });
      return completion(calls.length === 1 ? JSON.stringify(plan) : "Lead corrected answer");
    },
  });
  // Then the response explains the measured reason for the extra Lead call.
  assert.ok(response.headers.get("X-Nexus-Reasons")?.includes("worker_reasoning_observed"));
  assert.deepEqual(calls, ["fixture/lead", "fixture/worker", "fixture/lead"]);
});

test("cancellation before dispatch never invokes either model", async () => {
  // Given a cancelled client request.
  const controller = new AbortController();
  controller.abort();
  const calls: string[] = [];
  // When the adaptive runtime begins, then cancellation propagates without fallback.
  await assert.rejects(
    handleNexusPairComboChat({
      combo,
      body: { messages: [] },
      signal: controller.signal,
      log,
      settings: {},
      allCombos: [],
      handleSingleModel: async (_body, model) => {
        calls.push(model);
        return completion("unused");
      },
    }),
    { name: "AbortError" }
  );
  assert.deepEqual(calls, []);
});
