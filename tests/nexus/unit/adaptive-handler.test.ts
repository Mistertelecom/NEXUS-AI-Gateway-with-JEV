import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { z } from "zod";

import { buildNexusPairCombo } from "../../../src/nexus/pairs/definition";
import type { LeadExecutionPlan } from "../../../src/nexus/jev/executionPlan";

const directory = mkdtempSync(join(tmpdir(), "nexus-handler-"));
process.env.DATA_DIR = directory;
process.env.NODE_ENV = "test";
const { resetDbInstance } = await import("../../../src/lib/db/core");
const { createProviderConnection } = await import("../../../src/lib/db/providers");
const { createCombo } = await import("../../../src/lib/db/combos");
const { createReasoningRoutingRule } = await import("../../../src/lib/db/reasoningRoutingRules");
const { POST } = await import("../../../src/app/api/v1/chat/completions/route");
const { closeCallLogSaves } = await import("../../../src/lib/usage/callLogs");
const { flushProxyLogsSync } = await import("../../../src/lib/proxyLogger");
const originalFetch = globalThis.fetch;
const upstreamSchema = z
  .object({ model: z.string(), reasoning_effort: z.string().optional() })
  .passthrough();
const answerSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) })),
});
const pair = buildNexusPairCombo({
  name: "handler-proof",
  leadModel: "openai/gpt-5.4",
  workerModel: "openai/gpt-5.4-mini",
  compressionMode: "off",
  jevMode: "adaptive",
});
const plan: LeadExecutionPlan = {
  version: 1,
  goal: "Produce a helper.",
  risk: "low",
  scope: "localized",
  touchesAuth: false,
  confidence: 0.95,
  reviewRequired: false,
  steps: [
    {
      id: "helper",
      kind: "generate",
      instruction: "Produce a complete pure helper.",
      acceptance: { format: "text", minLength: 5 },
    },
  ],
};

test.before(async () => {
  const connection = await createProviderConnection({
    provider: "openai",
    authType: "apikey",
    name: "isolated-nexus-test",
    apiKey: "isolated-test-value",
    isActive: true,
    testStatus: "active",
  });
  const { id } = z.object({ id: z.string() }).parse(connection);
  await createReasoningRoutingRule({
    name: "force-medium-on-connection",
    description: "",
    scope: "connection",
    apiKeyId: null,
    comboId: null,
    connectionId: id,
    modelPattern: null,
    sourceEffort: "any",
    requestTags: [],
    tagMatchMode: "any",
    effortMode: "force",
    targetEffort: "medium",
    targetKind: "keep",
    targetModel: null,
    targetComboId: null,
    budgetAction: "preserve",
    budgetTokens: null,
    priority: 1,
    enabled: true,
  });
  await createCombo(pair);
  await createCombo({
    name: "ordinary-handler-proof",
    strategy: "priority",
    models: ["openai/gpt-5.4-mini"],
  });
});

test.after(async () => {
  globalThis.fetch = originalFetch;
  await closeCallLogSaves();
  flushProxyLogsSync();
  resetDbInstance();
  rmSync(directory, { recursive: true, force: true });
});

async function requestCombo(model: string, answers: readonly string[]) {
  const calls: Array<z.infer<typeof upstreamSchema>> = [];
  globalThis.fetch = async (url, init: RequestInit = {}) => {
    assert.match(String(url), /^https:\/\/api\.openai\.com\/v1\/chat\/completions/u);
    assert.equal(typeof init.body, "string");
    const value: unknown = JSON.parse(String(init.body));
    calls.push(upstreamSchema.parse(value));
    return Response.json({
      id: `isolated-${calls.length}`,
      model: calls.at(-1)?.model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: answers[calls.length - 1] ?? "unexpected-stage" },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 2, completion_tokens: 3, total_tokens: 5 },
    });
  };
  try {
    const response = await POST(
      new Request("http://localhost/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          stream: false,
          reasoning_effort: "high",
          messages: [{ role: "user", content: "Write a pure string helper." }],
        }),
      })
    );
    const value: unknown = await response.json();
    return { response, value, calls };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("adaptive HTTP handler preserves Lead reasoning but prevents connection rules re-enabling Worker reasoning", async () => {
  // Given a high-reasoning request and a distinct forced-medium connection rule.
  const answers = [JSON.stringify(plan), "worker-complete-helper"];
  // When the real POST handler dispatches the adaptive pair.
  const { response, value, calls } = await requestCombo(pair.name, answers);
  // Then only the selected Worker runs without reasoning, after the selected Lead.
  assert.equal(response.status, 200, JSON.stringify(value));
  assert.deepEqual(
    calls.map(({ model, reasoning_effort }) => ({ model, reasoning_effort })),
    [
      { model: "gpt-5.4", reasoning_effort: "medium" },
      { model: "gpt-5.4-mini", reasoning_effort: "none" },
    ]
  );
  assert.equal(answerSchema.parse(value).choices[0]?.message.content, "worker-complete-helper");
  assert.equal(response.headers.get("X-Nexus-Path"), "cheap_worker");
});

test("ordinary HTTP combo keeps the existing connection reasoning override", async () => {
  // Given the same high-reasoning request and forced-medium connection rule.
  const answers = ["ordinary-completion"];
  // When an ordinary combo uses the real POST handler.
  const { response, value, calls } = await requestCombo("ordinary-handler-proof", answers);
  // Then the original reasoning policy remains effective.
  assert.equal(response.status, 200, JSON.stringify(value));
  assert.deepEqual(
    calls.map((call) => call.reasoning_effort),
    ["medium"]
  );
  assert.equal(response.headers.get("X-Nexus-Path"), null);
});
