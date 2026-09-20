import assert from "node:assert/strict";
import test from "node:test";

import { createComboSchema } from "../../../src/shared/validation/schemas/combo";
import { buildNexusPairCombo } from "../../../src/nexus/pairs/definition";

test("buildNexusPairCombo maps Lead and Worker to the persisted pipeline", () => {
  const combo = buildNexusPairCombo({
    name: "Equipe principal",
    leadModel: "anthropic/lead-model",
    workerModel: "google/worker-model",
    compressionMode: "stacked",
    jevMode: "advisory",
  });

  assert.equal(combo.strategy, "pipeline");
  assert.deepEqual(
    combo.models.map((step) => step.model),
    ["anthropic/lead-model", "google/worker-model", "anthropic/lead-model"]
  );
  assert.deepEqual(
    combo.models.map((step) => step.label),
    ["Lead · Plan", "Worker · Execute", "Lead · Check"]
  );
  assert.deepEqual(combo.config, {
    compressionMode: "stacked",
    trackMetrics: true,
  });
  assert.equal(createComboSchema.safeParse(combo).success, true);
});

test("buildNexusPairCombo keeps generated names inside the NEXUS namespace", () => {
  const combo = buildNexusPairCombo({
    name: " NEXUS/../ Pair 🚀 / [review]. ",
    leadModel: "lead",
    workerModel: "worker",
    compressionMode: "standard",
    jevMode: "off",
  });

  assert.equal(combo.name, "nexus/Pair/[review]");
  assert.equal(combo.name.includes(".."), false);
  assert.equal(combo.name.startsWith("nexus/nexus/"), false);
  assert.equal(createComboSchema.safeParse(combo).success, true);
});

test("buildNexusPairCombo uses a stable fallback for an empty display name", () => {
  const combo = buildNexusPairCombo({
    name: "   ",
    leadModel: " lead ",
    workerModel: " worker ",
    compressionMode: "rtk",
    jevMode: "advisory",
  });

  assert.equal(combo.name, "nexus/NEXUS-Intelligence-Pair");
  assert.equal(combo.displayName, "NEXUS Intelligence Pair");
  assert.deepEqual(
    combo.models.map((step) => step.model),
    ["lead", "worker", "lead"]
  );
});
