import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  jevCallRecordSchema,
  parseProviderUsageReport,
  telemetryTestRequestSchema,
} from "../../../src/nexus/telemetry/telemetryContracts";
import {
  NexusTelemetryStore,
  type JevCallRecord,
} from "../../../src/nexus/telemetry/telemetryStore";

function createRecordedCall(overrides: Partial<JevCallRecord> = {}): JevCallRecord {
  return {
    id: "call-1",
    timestamp: "2026-09-19T12:00:00.000Z",
    client: "NEXUS telemetry test",
    modelRequested: "antigravity/test-model",
    jevUsed: true,
    jev: {
      taskKind: "explanation",
      confidence: 0.8,
      touchesAuth: false,
      authProbability: 0,
      scope: "localized",
      latencyMs: 12,
      selectedRoute: "antigravity/gemini",
      mode: "local_deterministic",
    },
    engine: "antigravity-cli",
    targetModel: "antigravity/gemini",
    promptPreview: "telemetry test",
    responsePreview: "response",
    totalLatencyMs: 40,
    status: "success",
    ...overrides,
  };
}

describe("NEXUS telemetry truthfulness", () => {
  test("Given a call without provider-reported usage or cost, when stats are derived, then unmeasured totals stay absent", () => {
    const store = NexusTelemetryStore.getInstance();
    store.clear();
    store.recordCall(createRecordedCall());

    const stats = store.getStats();

    assert.equal(stats.usageMeasuredCalls, 0);
    assert.equal(stats.totalTokens, undefined);
    assert.equal(stats.costMeasuredCalls, 0);
    assert.equal(stats.totalCostUsd, undefined);
    store.clear();
  });

  test("Given provider-reported usage and cost, when stats are derived, then only those reported values are aggregated", () => {
    const store = NexusTelemetryStore.getInstance();
    store.clear();
    store.recordCall(
      createRecordedCall({
        usage: {
          promptTokens: 12,
          completionTokens: 8,
          totalTokens: 20,
        },
        cost: {
          amountUsd: 0.0025,
          source: "provider_reported",
        },
      })
    );

    const stats = store.getStats();

    assert.equal(stats.usageMeasuredCalls, 1);
    assert.equal(stats.totalTokens, 20);
    assert.equal(stats.costMeasuredCalls, 1);
    assert.equal(stats.totalCostUsd, 0.0025);
    store.clear();
  });

  test("Given a telemetry test payload with omitted or unknown fields, when it is parsed, then the strict POST contract rejects it", () => {
    const missingPrompt = telemetryTestRequestSchema.safeParse({});
    const missingModel = telemetryTestRequestSchema.safeParse({ prompt: "valid prompt" });
    const unknownField = telemetryTestRequestSchema.safeParse({
      prompt: "valid prompt",
      model: "antigravity/test-model",
      unknown: true,
    });

    assert.equal(missingPrompt.success, false);
    assert.equal(missingModel.success, false);
    assert.equal(unknownField.success, false);
  });

  test("Given a partial provider usage payload, when it is normalized, then telemetry remains unmeasured", () => {
    const usage = parseProviderUsageReport({ inputTokens: 12 });

    assert.equal(usage, undefined);
  });

  test("Given a cloud Typesafe JEV decision, when its record crosses the telemetry contract, then its source mode is retained", () => {
    const parsed = jevCallRecordSchema.safeParse(
      createRecordedCall({
        jev: {
          ...createRecordedCall().jev,
          mode: "cloud_typesafe",
        },
      })
    );

    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.jev.mode, "cloud_typesafe");
    }
  });
});

test("explicit provider zero usage is measured, unlike absent usage", () => {
  assert.deepEqual(parseProviderUsageReport({ inputTokens: 12, outputTokens: 0 }), {
    promptTokens: 12,
    completionTokens: 0,
    totalTokens: 12,
  });
  assert.equal(parseProviderUsageReport(undefined), undefined);
  assert.equal(parseProviderUsageReport({ inputTokens: -1, outputTokens: 2 }), undefined);
});
