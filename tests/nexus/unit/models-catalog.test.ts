import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveNexusModelsCatalog,
  filterAndSortNexusModels,
  formatProviderDisplayName,
  extractProviderId,
} from "../../../src/app/(dashboard)/dashboard/nexus/models/modelsCatalogData";

test("extractProviderId extracts provider from owned_by or prefix", () => {
  assert.equal(extractProviderId({ id: "claude-3-5-sonnet", owned_by: "anthropic" }), "anthropic");
  assert.equal(extractProviderId({ id: "openai/gpt-4o", owned_by: undefined }), "openai");
  assert.equal(extractProviderId({ id: "groq/llama-3.3-70b", owned_by: "" }), "groq");
  assert.equal(extractProviderId({ id: "raw-model", owned_by: null }), "other");
});

test("formatProviderDisplayName returns clean title for known providers", () => {
  assert.equal(formatProviderDisplayName("anthropic"), "Anthropic");
  assert.equal(formatProviderDisplayName("openai"), "OpenAI");
  assert.equal(formatProviderDisplayName("deepseek"), "DeepSeek");
  assert.equal(formatProviderDisplayName("custom-provider"), "Custom-provider");
});

test("deriveNexusModelsCatalog derives enriched models with capabilities and configured status", () => {
  const payload = {
    data: [
      {
        id: "anthropic/claude-3-5-sonnet",
        name: "Claude 3.5 Sonnet",
        owned_by: "anthropic",
        context_length: 200000,
        capabilities: { supportsThinking: false, supportsTools: true, supportsVision: true },
        pricing: { input: 3, output: 15 },
      },
      {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        owned_by: "deepseek",
        context_length: 64000,
        capabilities: { supportsThinking: true },
        pricing: { input: 0.55, output: 2.19 },
      },
      {
        id: "openai/text-embedding-3-small",
        name: "Embedding Small",
        owned_by: "openai",
        type: "embedding",
      },
      {
        id: "unconfigured/model-a",
        name: "Model A",
        owned_by: "unconfigured",
      },
    ],
  };

  const configuredSet = new Set(["anthropic", "openai"]);

  const models = deriveNexusModelsCatalog(payload, configuredSet);

  assert.equal(models.length, 4);

  const sonnet = models.find((m) => m.id === "anthropic/claude-3-5-sonnet");
  assert.ok(sonnet);
  assert.equal(sonnet.isConfigured, true);
  assert.equal(sonnet.providerName, "Anthropic");
  assert.equal(sonnet.supportsTools, true);
  assert.equal(sonnet.supportsVision, true);
  assert.equal(sonnet.contextLength, 200000);
  assert.equal(sonnet.costScore, 18);

  const r1 = models.find((m) => m.id === "deepseek/deepseek-r1");
  assert.ok(r1);
  assert.equal(r1.isConfigured, false);
  assert.equal(r1.supportsThinking, true);
  assert.equal(r1.modality, "reasoning");

  const embed = models.find((m) => m.id === "openai/text-embedding-3-small");
  assert.ok(embed);
  assert.equal(embed.modality, "embedding");

  const unconfigured = models.find((m) => m.id === "unconfigured/model-a");
  assert.ok(unconfigured);
  assert.equal(unconfigured.isConfigured, false);
});

test("filterAndSortNexusModels filters by configuredOnly, search, provider, modality, and capability", () => {
  const models = [
    {
      id: "anthropic/claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
      providerId: "anthropic",
      providerName: "Anthropic",
      isConfigured: true,
      contextLength: 200000,
      supportsThinking: false,
      supportsTools: true,
      supportsVision: true,
      modality: "vision" as const,
      pricing: { input: 3, output: 15 },
      costScore: 18,
    },
    {
      id: "deepseek/deepseek-r1",
      name: "DeepSeek R1",
      providerId: "deepseek",
      providerName: "DeepSeek",
      isConfigured: false,
      contextLength: 64000,
      supportsThinking: true,
      supportsTools: true,
      supportsVision: false,
      modality: "reasoning" as const,
      pricing: { input: 0.55, output: 2.19 },
      costScore: 2.74,
    },
    {
      id: "openai/gpt-4o-mini",
      name: "GPT-4o Mini",
      providerId: "openai",
      providerName: "OpenAI",
      isConfigured: true,
      contextLength: 128000,
      supportsThinking: false,
      supportsTools: true,
      supportsVision: true,
      modality: "chat" as const,
      pricing: { input: 0.15, output: 0.6 },
      costScore: 0.75,
    },
  ];

  // 1. Filter by configuredOnly
  const configuredOnly = filterAndSortNexusModels(models, { configuredOnly: true });
  assert.equal(configuredOnly.length, 2);
  assert.deepEqual(
    configuredOnly.map((m) => m.id),
    ["anthropic/claude-3-5-sonnet", "openai/gpt-4o-mini"]
  );

  // 2. Filter by search
  const searched = filterAndSortNexusModels(models, { search: "deepseek" });
  assert.equal(searched.length, 1);
  assert.equal(searched[0]?.id, "deepseek/deepseek-r1");

  // 3. Filter by provider
  const byProvider = filterAndSortNexusModels(models, { providerId: "anthropic" });
  assert.equal(byProvider.length, 1);
  assert.equal(byProvider[0]?.id, "anthropic/claude-3-5-sonnet");

  // 4. Filter by capability
  const withThinking = filterAndSortNexusModels(models, { capability: "thinking" });
  assert.equal(withThinking.length, 1);
  assert.equal(withThinking[0]?.id, "deepseek/deepseek-r1");

  // 5. Filter by modality
  const reasoningOnly = filterAndSortNexusModels(models, { modality: "reasoning" });
  assert.equal(reasoningOnly.length, 1);
  assert.equal(reasoningOnly[0]?.id, "deepseek/deepseek-r1");

  // 6. Sort by cost ascending
  const sortedByCost = filterAndSortNexusModels(models, { sortBy: "cost-asc" });
  assert.deepEqual(
    sortedByCost.map((m) => m.id),
    ["openai/gpt-4o-mini", "deepseek/deepseek-r1", "anthropic/claude-3-5-sonnet"]
  );

  // 7. Sort by context descending
  const sortedByContext = filterAndSortNexusModels(models, { sortBy: "context" });
  assert.deepEqual(
    sortedByContext.map((m) => m.id),
    ["anthropic/claude-3-5-sonnet", "openai/gpt-4o-mini", "deepseek/deepseek-r1"]
  );
});
