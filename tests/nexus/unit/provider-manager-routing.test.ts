import assert from "node:assert/strict";
import test from "node:test";

import { ProviderManager } from "../../../src/nexus/providers/manager.ts";

test("ProviderManager fails closed for retired and unqualified model selections", () => {
  const manager = ProviderManager.getInstance();

  assert.throws(() => manager.resolveRouting("nexus/auto"), /provider-qualified|supported/i);
  assert.throws(() => manager.resolveRouting("unqualified-model"), /provider-qualified/i);
});

test("ProviderManager preserves an explicit provider selection without model substitution", () => {
  const manager = ProviderManager.getInstance();

  const route = manager.resolveRouting("opencode/deepseek-coder");
  assert.equal(route.connector.id, "opencode");
  assert.equal(route.targetModel, "deepseek-coder");
  assert.equal(route.isLocalAgy, false);
});
