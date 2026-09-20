import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { buildNexusPairCombo } from "../../../src/nexus/pairs/definition";

const directory = mkdtempSync(join(tmpdir(), "nexus-protocol-"));
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
  name: "Protocol test",
  leadModel: "fixture/lead",
  workerModel: "fixture/worker",
  compressionMode: "rtk",
  jevMode: "adaptive",
});
const log = { info() {}, warn() {}, debug() {} };

test("unsupported adaptive protocol escalates to Lead only without rewriting the native request or response", async () => {
  // Given a native Responses request that the adaptive executor does not yet parse.
  const body = { input: "Write a helper.", stream: true, reasoning: { effort: "high" } };
  const upstreamBody = 'event: response.completed\ndata: {"type":"response.completed"}\n\n';
  const calls: Array<{ model: string; body: Record<string, unknown> }> = [];
  // When the request uses the selected adaptive pair.
  const response = await handleNexusPairComboChat({
    combo,
    body,
    sourceFormat: "openai-responses",
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (request, model) => {
      calls.push({ model, body: request });
      return new Response(upstreamBody, { headers: { "Content-Type": "text/event-stream" } });
    },
  });
  // Then only the Lead executes, and the native protocol passes through unchanged.
  assert.deepEqual(
    calls.map((call) => call.model),
    ["fixture/lead"]
  );
  assert.deepEqual(calls[0]?.body, body);
  assert.equal(await response.text(), upstreamBody);
  assert.equal(response.headers.get("X-Nexus-Path"), "lead_escalation");
  assert.equal(response.headers.get("X-Nexus-Jev-Mode"), "inactive");
  assert.equal(response.headers.get("X-Nexus-Reasons"), "unsupported_protocol");
});

test("ordinary native-protocol combos remain delegated unchanged", async () => {
  // Given an ordinary combo without NEXUS metadata.
  const body = { input: "Original request", stream: false };
  const calls: Array<Record<string, unknown>> = [];
  // When it crosses the NEXUS seam.
  const response = await handleNexusPairComboChat({
    combo: { name: "ordinary-native", strategy: "pipeline", models: ["fixture/ordinary"] },
    body,
    sourceFormat: "openai-responses",
    log,
    settings: {},
    allCombos: [],
    handleSingleModel: async (request) => {
      calls.push(request);
      return Response.json({ object: "response", output: [] });
    },
  });
  // Then neither the body nor the response contract is replaced by NEXUS.
  assert.deepEqual(calls, [body]);
  assert.equal(response.headers.get("X-Nexus-Path"), null);
  assert.deepEqual(await response.json(), { object: "response", output: [] });
});
