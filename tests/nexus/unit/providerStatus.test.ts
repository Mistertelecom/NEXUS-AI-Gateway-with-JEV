import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { buildJevStatus } from "../../../src/app/api/nexus/providers/route";
import { deriveProviderReadiness, ProviderManager } from "../../../src/nexus/providers/manager";

describe("NEXUS provider status truthfulness", () => {
  test("Given Antigravity has no local binary, when the catalog is read, then it is unavailable and not active", async () => {
    const previousBinaryPath = process.env.ANTIGRAVITY_CLI_PATH;
    process.env.ANTIGRAVITY_CLI_PATH = ".nexus-missing-antigravity-binary";

    try {
      const catalog = await ProviderManager.getInstance().getAllProvidersCatalog();
      const antigravity = catalog.find((provider) => provider.id === "antigravity-cli");

      assert.ok(antigravity);
      assert.equal(antigravity.status, "requires_key");
      assert.equal(antigravity.readiness, "unavailable");
      assert.equal(antigravity.verification, "unavailable");
      assert.notEqual(antigravity.status, "active");
    } finally {
      if (previousBinaryPath === undefined) delete process.env.ANTIGRAVITY_CLI_PATH;
      else process.env.ANTIGRAVITY_CLI_PATH = previousBinaryPath;
    }
  });

  test("Given a catalogued provider without configuration, when readiness is derived, then it is not active", () => {
    const readiness = deriveProviderReadiness({
      hasConfiguredConnection: false,
      hasEnvironmentKey: false,
      isLiveVerified: false,
      localBinaryAvailable: false,
      requiresLocalBinary: false,
    });

    assert.equal(readiness.status, "requires_key");
    assert.equal(readiness.readiness, "catalogued");
    assert.equal(readiness.verification, "not_configured");
    assert.notEqual(readiness.status, "active");
  });

  test("Given provider credentials are configured but unverified, when readiness is derived, then it is configured and not active", () => {
    const readiness = deriveProviderReadiness({
      hasConfiguredConnection: false,
      hasEnvironmentKey: true,
      isLiveVerified: false,
      localBinaryAvailable: false,
      requiresLocalBinary: false,
    });

    assert.equal(readiness.status, "configured");
    assert.equal(readiness.readiness, "configured");
    assert.equal(readiness.verification, "not_run");
    assert.notEqual(readiness.status, "active");
  });

  test("Given the Antigravity local binary is missing, when readiness is derived, then it is unavailable and not active", () => {
    const readiness = deriveProviderReadiness({
      hasConfiguredConnection: false,
      hasEnvironmentKey: false,
      isLiveVerified: false,
      localBinaryAvailable: false,
      requiresLocalBinary: true,
    });

    assert.equal(readiness.status, "requires_key");
    assert.equal(readiness.readiness, "unavailable");
    assert.equal(readiness.verification, "unavailable");
    assert.notEqual(readiness.status, "active");
  });

  test("Given JEV has no cloud credential, when its status is built, then it reports rules-only unavailable", () => {
    const status = buildJevStatus("local_deterministic");

    assert.equal(status.status, "rules_only_unavailable");
    assert.equal(status.readiness, "unavailable");
    assert.equal(status.verification, "not_configured");
    assert.equal(status.hasKey, false);
    assert.ok(!status.status.includes("active"));
  });
});
