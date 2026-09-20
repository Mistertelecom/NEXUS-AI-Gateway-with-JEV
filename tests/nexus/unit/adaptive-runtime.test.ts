import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { buildNexusPairCombo } from "../../../src/nexus/pairs/definition";
import type { LeadExecutionPlan } from "../../../src/nexus/jev/executionPlan";

const directory = mkdtempSync(join(tmpdir(), "nexus-adaptive-"));
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
  name: "Runtime test",
  leadModel: "fixture/lead",
  workerModel: "fixture/worker",
  compressionMode: "rtk",
  jevMode: "adaptive",
});
const plan: LeadExecutionPlan = {
  version: 1,
  goal: "Write a pure helper.",
  risk: "low",
  scope: "localized",
  touchesAuth: false,
  confidence: 0.95,
  reviewRequired: false,
  steps: [
    {
      id: "implement",
      kind: "generate",
      instruction: "Write a pure upper-case helper.",
      acceptance: { format: "text", minLength: 10 },
    },
  ],
};
const log = { info() {}, warn() {}, debug() {} };
const completion = (content: string) =>
  new Response(
    JSON.stringify({
      id: "fixture-response",
      model: "fixture",
      choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
    }),
    { headers: { "Content-Type": "application/json" } }
  );

test("real combo executor plans once, runs the selected Worker, preserves compression and disables Worker reasoning", async () => {
  const calls: Array<{ model: string; body: Record<string, unknown> }> = [];
  const response = await handleNexusPairComboChat({
    combo,
    body: { messages: [{ role: "user", content: "Write a string helper." }] },
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (body, model) => {
      calls.push({ model, body });
      return completion(
        calls.length === 1 ? JSON.stringify(plan) : "function upper(s) { return s.toUpperCase(); }"
      );
    },
  });
  assert.deepEqual(
    calls.map((call) => call.model),
    ["fixture/lead", "fixture/worker"]
  );
  assert.equal(calls[1]?.body.reasoning_effort, "none");
  assert.equal(response.headers.get("X-Nexus-Path"), "cheap_worker");
  assert.equal(response.headers.get("X-Nexus-Compression"), "rtk");
  assert.equal(response.headers.get("X-Nexus-Lead-Stages"), "1");
});

test("JEV completes an explicit Lead local plan with no Worker and returns real transformed output", async () => {
  const calls: string[] = [];
  const localPlan: LeadExecutionPlan = {
    ...plan,
    steps: [
      {
        id: "format",
        kind: "local",
        task: { kind: "format_json", source: '{"v":42}' },
        acceptance: { format: "json", minLength: 1 },
      },
    ],
  };
  const response = await handleNexusPairComboChat({
    combo,
    body: { messages: [{ role: "user", content: 'Format JSON {"v":42}.' }] },
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (_body, model) => {
      calls.push(model);
      return completion(JSON.stringify(localPlan));
    },
  });
  assert.deepEqual(calls, ["fixture/lead"]);
  assert.equal(response.headers.get("X-Nexus-Path"), "jev_direct");
  const value = await response.json();
  assert.equal(value.choices[0].message.content, '{\n  "v": 42\n}');
});

test("high-risk plan runs Lead review after Worker output", async () => {
  const calls: string[] = [];
  const response = await handleNexusPairComboChat({
    combo,
    body: { messages: [{ role: "user", content: "Implement password recovery." }] },
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (_body, model) => {
      calls.push(model);
      return completion(calls.length === 1 ? JSON.stringify(plan) : "reviewable implementation");
    },
  });
  assert.deepEqual(calls, ["fixture/lead", "fixture/worker", "fixture/lead"]);
  assert.equal(response.headers.get("X-Nexus-Path"), "lead_escalation");
});

test("invalid Worker output escalates once instead of passing an empty answer", async () => {
  const calls: string[] = [];
  const response = await handleNexusPairComboChat({
    combo,
    body: { messages: [{ role: "user", content: "Write a helper." }] },
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (_body, model) => {
      calls.push(model);
      return completion(
        calls.length === 1
          ? JSON.stringify(plan)
          : calls.length === 2
            ? ""
            : "Lead corrected answer"
      );
    },
  });
  assert.deepEqual(calls, ["fixture/lead", "fixture/worker", "fixture/lead"]);
  assert.ok(response.headers.get("X-Nexus-Reasons")?.includes("worker_invalid_output"));
});

test("malformed Lead plan escalates directly to Lead without inventing local work", async () => {
  const calls: string[] = [];
  const response = await handleNexusPairComboChat({
    combo,
    body: { messages: [{ role: "user", content: "Write a helper." }] },
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (_body, model) => {
      calls.push(model);
      return completion("not a structured plan");
    },
  });
  assert.deepEqual(calls, ["fixture/lead", "fixture/lead"]);
  assert.ok(response.headers.get("X-Nexus-Reasons")?.includes("invalid_lead_plan"));
});

test("cloud JEV absence keeps deterministic execution and valid SSE framing", async () => {
  const calls: string[] = [];
  const response = await handleNexusPairComboChat({
    combo,
    body: { stream: true, messages: [{ role: "user", content: "Write a helper." }] },
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (_body, model) => {
      calls.push(model);
      return completion(calls.length === 1 ? JSON.stringify(plan) : "Worker final content");
    },
  });
  assert.equal(response.headers.get("X-Nexus-Jev-Mode"), "local_deterministic");
  assert.equal(response.headers.get("Content-Type"), "text/event-stream");
  assert.match(await response.text(), /data: \[DONE\]/u);
  assert.deepEqual(calls, ["fixture/lead", "fixture/worker"]);
});
