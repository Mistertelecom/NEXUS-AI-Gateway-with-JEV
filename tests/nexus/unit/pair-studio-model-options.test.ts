import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPairStudioSavePayload,
  derivePairStudioProviderEvidence,
  derivePairStudioModelOptions,
  isPairStudioSelectionReady,
} from "../../../src/app/(dashboard)/dashboard/nexus/components/pairStudioModelOptions";

test("derives every discovered model for Lead and observed-cost models for Worker", () => {
  // Given
  const catalog = {
    data: [
      {
        id: "runtime/lead-model",
        owned_by: "runtime",
        capabilities: { supportsThinking: true },
        pricing: { input: 4, output: 5 },
      },
      {
        id: "runtime/economical-model",
        owned_by: "runtime",
        pricing: { input: 1, output: 1 },
      },
      { id: "runtime/unknown-cost-model", owned_by: "runtime" },
    ],
  };

  // When
  const options = derivePairStudioModelOptions(catalog);

  // Then
  assert.deepEqual(
    options.leadOptions.map((option) => option.id),
    ["runtime/economical-model", "runtime/lead-model", "runtime/unknown-cost-model"]
  );
  assert.deepEqual(
    options.workerOptions.map((option) => option.id),
    ["runtime/economical-model", "runtime/lead-model"]
  );
  assert.equal(options.leadOptions[1]?.thinkingEvidence, "observed");
  assert.equal(options.workerOptions[0]?.costEvidence, "observed");
});

test("builds the adaptive save payload from discovered model selections", () => {
  // Given
  const selection = {
    name: "Par de revisão",
    leadModel: "runtime/lead-model",
    workerModel: "runtime/economical-model",
    compressionMode: "stacked" as const,
    jevMode: "adaptive" as const,
  };

  // When
  const payload = buildPairStudioSavePayload(selection);

  // Then
  assert.equal(
    isPairStudioSelectionReady(selection, [selection.leadModel], [selection.workerModel]),
    true
  );
  assert.deepEqual(payload.config.nexusPair, {
    version: 1,
    policy: "lead-plan-once-jev-execute",
    leadModel: "runtime/lead-model",
    workerModel: "runtime/economical-model",
    workerReasoning: "none",
  });
  assert.deepEqual(
    payload.models.map((step) => step.model),
    ["runtime/lead-model", "runtime/economical-model", "runtime/lead-model"]
  );
});

test("rejects selections that did not come from the current discovery", () => {
  // Given
  const selection = {
    name: "Par inválido",
    leadModel: "runtime/discovered-lead",
    workerModel: "runtime/manual-worker",
    compressionMode: "standard" as const,
    jevMode: "adaptive" as const,
  };

  // When
  const ready = isPairStudioSelectionReady(
    selection,
    ["runtime/discovered-lead"],
    ["runtime/discovered-worker"]
  );

  // Then
  assert.equal(ready, false);
});

test("counts every configured provider readiness state from the provider summary", () => {
  // Given
  const payload = {
    totalCount: 12,
    statusSummary: {
      configured: 2,
      ready: 3,
      liveVerified: 4,
    },
    jev: {
      readiness: "configured",
      verification: "not_run",
    },
  };

  // When
  const evidence = derivePairStudioProviderEvidence(payload);

  // Then
  assert.equal(evidence?.configuredCount, 9);
  assert.equal(evidence?.liveVerifiedCount, 4);
  assert.equal(evidence?.totalCount, 12);
});

test("filters model options to only include models from configured providers", async () => {
  const { deriveConfiguredProviderIdentifiers, isModelFromConfiguredProvider } =
    await import("../../../src/app/(dashboard)/dashboard/nexus/components/pairStudioModelOptions");

  // Given
  const providersPayload = {
    providers: [
      { id: "anthropic", alias: "claude", status: "active", readiness: "ready" },
      { id: "openai", status: "configured", readiness: "configured" },
      { id: "unconfigured-prov", status: "requires_key", readiness: "catalogued" },
    ],
  };

  const catalog = {
    data: [
      {
        id: "anthropic/claude-3-5-sonnet",
        owned_by: "anthropic",
        pricing: { input: 3, output: 15 },
      },
      { id: "openai/gpt-4o", owned_by: "openai", pricing: { input: 2.5, output: 10 } },
      {
        id: "unconfigured-prov/some-model",
        owned_by: "unconfigured-prov",
        pricing: { input: 1, output: 1 },
      },
      { id: "claude/claude-3-haiku", owned_by: "claude" },
    ],
  };

  // When
  const configuredIds = deriveConfiguredProviderIdentifiers(providersPayload);

  // Then
  assert.equal(configuredIds.has("anthropic"), true);
  assert.equal(configuredIds.has("claude"), true);
  assert.equal(configuredIds.has("openai"), true);
  assert.equal(configuredIds.has("unconfigured-prov"), false);

  assert.equal(
    isModelFromConfiguredProvider(
      { id: "anthropic/claude-3-5-sonnet", owned_by: "anthropic" },
      configuredIds
    ),
    true
  );
  assert.equal(
    isModelFromConfiguredProvider(
      { id: "unconfigured-prov/some-model", owned_by: "unconfigured-prov" },
      configuredIds
    ),
    false
  );

  const filteredOptions = derivePairStudioModelOptions(catalog, configuredIds);

  assert.deepEqual(
    filteredOptions.leadOptions.map((o) => o.id),
    ["anthropic/claude-3-5-sonnet", "claude/claude-3-haiku", "openai/gpt-4o"]
  );
  assert.equal(
    filteredOptions.leadOptions.some((o) => o.id.includes("unconfigured-prov")),
    false
  );
});
