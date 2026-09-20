import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { evaluateBoot } from "../../../scripts/check/check-pack-boot.mjs";
import * as packIdentity from "../../../scripts/check/pack-boot-identity.mjs";

const product = { name: "nexus-ai-control-plane", version: "0.4.0-alpha.2" } as const;
const engineVersion = "4.3.2";

test("pack boot selects separate NEXUS CLI and inherited engine versions", () => {
  // Given distinct product and engine versions, neither may substitute for the other.
  // When deriving the two independent artifact checks.
  const versions = packIdentity.resolvePackBootVersions(product, engineVersion);
  // Then each surface must match its own authoritative metadata.
  assert.deepEqual(versions, {
    cliVersion: "NEXUS 0.4.0-alpha.2",
    healthVersion: "4.3.2",
  });
});

test("legacy OmniRoute pack boot retains one manifest version for both surfaces", () => {
  // Given the inherited product rather than the NEXUS distribution.
  const legacy = { name: "omniroute", version: "3.9.1" };
  // When an unrelated engine version is supplied.
  const versions = packIdentity.resolvePackBootVersions(legacy, engineVersion);
  // Then the existing package's version contract is unchanged.
  assert.deepEqual(versions, { cliVersion: "3.9.1", healthVersion: "3.9.1" });
});

test("pack boot accepts the exact product CLI version with a trailing newline", () => {
  // Given the installed command's stdout and expected product identity.
  const expected = "NEXUS 0.4.0-alpha.2";
  // When evaluating the version output.
  const verdict = packIdentity.evaluateCliVersion(`${expected}\n`, expected);
  // Then normal terminal line endings do not alter identity.
  assert.deepEqual(verdict, { ok: true, failures: [] });
});

for (const output of ["NEXUS 0.4.0-alpha.1", "4.3.2", ""]) {
  test(`pack boot rejects an incorrect CLI identity: ${JSON.stringify(output)}`, () => {
    // Given an older product, inherited engine, or missing version output.
    // When checking it against the expected product release.
    const verdict = packIdentity.evaluateCliVersion(output, "NEXUS 0.4.0-alpha.2");
    // Then boot cannot be approved on the wrong installed executable.
    assert.equal(verdict.ok, false);
    assert.equal(verdict.failures.length, 1);
  });
}

test("NEXUS health cannot pass by reporting the product version instead of the engine", () => {
  // Given the independently derived engine identity.
  const versions = packIdentity.resolvePackBootVersions(product, engineVersion);
  // When health incorrectly reports the alpha product version.
  const verdict = evaluateBoot(200, { version: product.version }, versions.healthVersion);
  // Then the exact engine check fails rather than accepting either version.
  assert.equal(verdict.ok, false);
});

test("pack boot rejects a NEXUS manifest that exposes only the legacy executable", () => {
  // Given a package identity with an incorrectly inherited public bin map.
  const manifest = { ...product, bin: { omniroute: "bin/omniroute.mjs" } };
  // When resolving the isolated installation.
  const resolve = () => packIdentity.resolvePackBootPaths(path.join("/tmp", "pack"), manifest);
  // Then no fallback may select the independently installed OmniRoute command.
  assert.throws(resolve, /does not declare its nexus executable/u);
});
