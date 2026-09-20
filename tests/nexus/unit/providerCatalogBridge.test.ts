import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { NextRequest } from "next/server";

import { POST } from "../../../src/app/api/nexus/providers/route";
import {
  buildNexusProviderCatalogSnapshot,
  selectProviderTestConnection,
  type ProviderConnectionEvidence,
} from "../../../src/nexus/providers/catalogBridge";

describe("NEXUS authoritative provider catalog bridge", () => {
  test("Given catalogued, configured, ready, and verified connection evidence, when the snapshot is built, then each readiness is factual", () => {
    const catalogued = buildNexusProviderCatalogSnapshot([]);
    const configured = buildNexusProviderCatalogSnapshot([
      {
        id: "configured-openai",
        provider: "openai",
        isActive: false,
        testStatus: null,
      },
    ]);
    const ready = buildNexusProviderCatalogSnapshot([
      {
        id: "ready-openai",
        provider: "openai",
        isActive: true,
        testStatus: null,
      },
    ]);
    const verified = buildNexusProviderCatalogSnapshot([
      {
        id: "verified-openai",
        provider: "openai",
        isActive: true,
        testStatus: "active",
      },
    ]);

    const cataloguedOpenAi = catalogued.providers.find((provider) => provider.id === "openai");
    const configuredOpenAi = configured.providers.find((provider) => provider.id === "openai");
    const readyOpenAi = ready.providers.find((provider) => provider.id === "openai");
    const verifiedOpenAi = verified.providers.find((provider) => provider.id === "openai");

    assert.ok(cataloguedOpenAi);
    assert.ok(configuredOpenAi);
    assert.ok(readyOpenAi);
    assert.ok(verifiedOpenAi);
    assert.equal(cataloguedOpenAi.readiness, "catalogued");
    assert.equal(configuredOpenAi.readiness, "configured");
    assert.equal(readyOpenAi.readiness, "ready");
    assert.equal(verifiedOpenAi.readiness, "live_verified");
    assert.equal(verifiedOpenAi.status, "active");
  });

  test("Given authoritative provider snapshot data, when it is serialized for NEXUS, then no parallel model catalog is included", () => {
    const snapshot = buildNexusProviderCatalogSnapshot([]);

    assert.ok(snapshot.totalCount > 0);
    assert.equal("models" in snapshot, false);
  });

  test("Given one or multiple persisted connections, when a provider test target is selected, then only an unambiguous connection is delegated", () => {
    const singleConnection: readonly ProviderConnectionEvidence[] = [
      {
        id: "openai-primary",
        provider: "openai",
        isActive: true,
        testStatus: "active",
      },
    ];
    const multipleConnections: readonly ProviderConnectionEvidence[] = [
      ...singleConnection,
      {
        id: "openai-secondary",
        provider: "openai",
        isActive: false,
        testStatus: null,
      },
    ];

    const selected = selectProviderTestConnection(singleConnection);
    const ambiguous = selectProviderTestConnection(multipleConnections);

    assert.equal(selected.kind, "selected");
    if (selected.kind === "selected") {
      assert.equal(selected.connectionId, "openai-primary");
    }
    assert.equal(ambiguous.kind, "ambiguous");
    if (ambiguous.kind === "ambiguous") {
      assert.deepEqual(ambiguous.connectionIds, ["openai-primary", "openai-secondary"]);
    }
  });

  test("Given a remote request with an invalid peer stamp, when a provider test is posted, then it is rejected before its invalid JSON body is read", async () => {
    const request = new NextRequest("https://203.0.113.77/api/nexus/providers", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-omniroute-peer-ip": "invalid-stamp|203.0.113.77",
      },
      body: "{",
    });

    const response = await POST(request);

    assert.equal(response.status, 403);
  });
});
