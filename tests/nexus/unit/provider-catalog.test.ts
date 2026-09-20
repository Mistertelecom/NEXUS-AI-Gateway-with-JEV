import assert from "node:assert/strict";
import test from "node:test";

import { deriveProviderCatalog } from "../../../src/app/(dashboard)/dashboard/nexus/providers/providerCatalog";

test("derives provider readiness and verification from the runtime catalog", () => {
  // Given
  const payload = {
    totalCount: 2,
    activeCount: 1,
    statusSummary: {
      catalogued: 0,
      configured: 1,
      ready: 0,
      liveVerified: 1,
      unavailable: 0,
    },
    providers: [
      {
        id: "runtime/verified",
        name: "Verified runtime",
        category: "local",
        status: "active",
        readiness: "live_verified",
        verification: "verified_live",
        statusSummary: "Persisted verification is available.",
        serviceKinds: ["llm", "code"],
      },
      {
        id: "runtime/configured",
        name: "Configured runtime",
        category: "apikey",
        status: "configured",
        readiness: "configured",
        verification: "not_run",
        statusSummary: "Configuration exists without a live check.",
        color: "#10a37f",
        icon: "auto_awesome",
        textIcon: "CR",
        website: "https://example.com",
      },
    ],
    jev: {
      id: "typesafe-jev",
      name: "TypeSafe JEV",
      status: "configured",
      readiness: "configured",
      verification: "not_run",
      statusSummary: "Cloud credentials are configured.",
      mode: "cloud_typesafe",
    },
  };

  // When
  const catalog = deriveProviderCatalog(payload);

  // Then
  assert.deepEqual(catalog?.summary, {
    totalCount: 2,
    activeCount: 1,
    catalogued: 0,
    configured: 1,
    ready: 0,
    liveVerified: 1,
    unavailable: 0,
  });
  assert.deepEqual(
    catalog?.providers.map((provider) => [provider.id, provider.readiness, provider.verification]),
    [
      ["runtime/configured", "configured", "not_run"],
      ["runtime/verified", "live_verified", "verified_live"],
    ]
  );
  assert.equal(catalog?.providers[0]?.color, "#10a37f");
  assert.equal(catalog?.providers[0]?.textIcon, "CR");
  assert.equal(catalog?.providers[0]?.website, "https://example.com");
  assert.equal(catalog?.jev.readiness, "configured");
});

test("rejects a provider payload that is missing runtime evidence", () => {
  // Given
  const payload = { providers: [{ id: "runtime/missing" }] };

  // When
  const catalog = deriveProviderCatalog(payload);

  // Then
  assert.equal(catalog, null);
});
