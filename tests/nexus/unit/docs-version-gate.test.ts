import assert from "node:assert/strict";
import test from "node:test";
import { makeVersionClaimValidator } from "../../../scripts/check/check-docs-counts-sync.mjs";

test("documentation version gate recognizes the full NEXUS prerelease", () => {
  const validate = makeVersionClaimValidator("0.1.0-alpha.1");
  assert.equal(validate("**Current version:** 0.1.0-alpha.1").ok, true);
  assert.equal(validate("NEXUS v0.1.0-alpha.1").ok, true);
  assert.equal(validate("**Current version:** 0.1.0").ok, false);
  assert.equal(validate("NEXUS v0.1.0-alpha.2").ok, false);
  assert.equal(validate("OmniRoute v3.8.51").ok, false);
});
