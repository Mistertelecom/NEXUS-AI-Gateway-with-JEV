import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const directory = mkdtempSync(join(tmpdir(), "nexus-reasoning-"));
process.env.DATA_DIR = directory;
const { isNexusWorkerStage, supportsReasoningFreeWorker, withWorkerReasoningDisabled } =
  await import("../../../src/nexus/pairs/workerReasoning");
const { resetDbInstance } = await import("../../../src/lib/db/core");
const { translateRequest } = await import("../../../open-sse/translator/index");
const { FORMATS } = await import("../../../open-sse/translator/formats");
const { DEFAULT_THINKING_CONFIG, setThinkingBudgetConfig, ThinkingMode } =
  await import("../../../open-sse/services/thinkingBudget");
test.after(() => {
  setThinkingBudgetConfig(DEFAULT_THINKING_CONFIG);
  resetDbInstance();
  rmSync(directory, { recursive: true, force: true });
});

test("Worker override removes all captured reasoning controls without mutating the original request", () => {
  // Given a request with competing high-effort controls and a connection directive.
  const body = {
    reasoning_effort: "high",
    reasoning: { effort: "max" },
    thinking: { type: "enabled", budget_tokens: 8000 },
    effort: "high",
    output_config: { effort: "high" },
    thinking_budget: 8000,
    thinkingBudget: 8000,
    thinkingBudgetTokens: 8000,
    _omnirouteReasoningRule: { effortMode: "force", targetEffort: "high" },
    _omnirouteReasoningRouteTrace: { rule: "captured" },
  };
  // When the Worker execution stage is prepared.
  const result = withWorkerReasoningDisabled(body);
  // Then only explicit disabled controls remain and the original remains intact.
  assert.deepEqual(JSON.parse(JSON.stringify(result)), {
    reasoning_effort: "none",
    thinking: { type: "disabled" },
  });
  assert.equal(body.reasoning_effort, "high");
  assert.equal(body._omnirouteReasoningRule.targetEffort, "high");
});

test("Worker stage marker survives inherited object spreads but cannot come from JSON", () => {
  // Given a marked internal body and its serialized public shape.
  const body = withWorkerReasoningDisabled({});
  const publicBody: unknown = JSON.parse(JSON.stringify(body));
  // When the inherited combo pipeline spreads the internal body.
  const forwarded = { ...body, stream: false };
  // Then the private marker remains only on the trusted internal object.
  assert.equal(isNexusWorkerStage(forwarded), true);
  assert.equal(isNexusWorkerStage(publicBody), false);
  assert.equal(isNexusWorkerStage({ "nexus.worker.stage": true }), false);
});

test("models whose provider contract raises none to positive effort cannot be Workers", () => {
  // Given a catalogued model requiring nonzero reasoning.
  const model = "openai/gpt-6-astra";
  // When the existing provider sanitizer checks the request contract.
  const supported = supportsReasoningFreeWorker(model);
  // Then the adaptive runtime must escalate before calling that model as Worker.
  assert.equal(supported, false);
});

test("native thinking knobs cannot override the Worker's disabled reasoning", () => {
  // Given native knobs that the provider honors ahead of canonical none.
  const body = {
    chat_template_kwargs: { enable_thinking: true, json_support: true },
    enable_thinking: true,
    thinkingConfig: { thinkingBudget: 4096 },
    generationConfig: { temperature: 0.2, thinkingConfig: { thinkingBudget: 8192 } },
  };
  // When the Worker body is prepared.
  const result = withWorkerReasoningDisabled(body);
  // Then provider overrides are cleared without removing unrelated parameters.
  assert.deepEqual(result.chat_template_kwargs, { enable_thinking: false, json_support: true });
  assert.deepEqual(result.generationConfig, { temperature: 0.2 });
  assert.equal(result.enable_thinking, undefined);
  assert.equal(result.thinkingConfig, undefined);
});

test("global custom thinking budget cannot reactivate reasoning for the Worker", () => {
  // Given a Worker request after the global policy is configured to spend reasoning tokens.
  setThinkingBudgetConfig({ mode: ThinkingMode.CUSTOM, customBudget: 8192 });
  const body = withWorkerReasoningDisabled({
    model: "gpt-5.4-mini",
    messages: [{ role: "user", content: "Implement the bounded task." }],
  });

  try {
    // When the request crosses the shared provider translation boundary.
    const result = translateRequest(
      FORMATS.OPENAI,
      FORMATS.OPENAI,
      "gpt-5.4-mini",
      body,
      false,
      null,
      "openai"
    );

    // Then the Worker contract remains reasoning-free on the outbound payload.
    assert.equal(result.reasoning_effort, "none");
    assert.notEqual(result.thinking?.type, "enabled");
    assert.equal(result.thinking?.budget_tokens, undefined);
  } finally {
    setThinkingBudgetConfig(DEFAULT_THINKING_CONFIG);
  }
});

test("unknown models cannot become reasoning-free Workers by parameter pass-through", () => {
  assert.equal(supportsReasoningFreeWorker("unknown/not-discovered"), false);
  assert.equal(supportsReasoningFreeWorker("openai/o1"), false);
  assert.equal(supportsReasoningFreeWorker("openai/gpt-5.4-mini"), true);
});
