import assert from "node:assert/strict";
import test from "node:test";

import {
  RETIRED_NEXUS_ALIAS_IDS,
  requireNexusModelSelection,
} from "../../../src/nexus/catalog/virtualAliases.ts";

test("retired virtual aliases cannot be used as NEXUS model selections", () => {
  for (const alias of RETIRED_NEXUS_ALIAS_IDS) {
    assert.throws(() => requireNexusModelSelection(alias), /no longer supported/i);
  }
});

test("NEXUS model selections require an explicit physical model or saved Pair ID", () => {
  assert.equal(
    requireNexusModelSelection("openrouter/deepseek/deepseek-chat"),
    "openrouter/deepseek/deepseek-chat"
  );
  assert.equal(requireNexusModelSelection("nexus/saved-pair"), "nexus/saved-pair");
  assert.throws(() => requireNexusModelSelection(), /select a discovered model ID/i);
  assert.throws(() => requireNexusModelSelection("unqualified-model"), /provider-qualified/i);
});
