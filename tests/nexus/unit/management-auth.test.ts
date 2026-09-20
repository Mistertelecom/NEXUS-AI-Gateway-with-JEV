import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { SignJWT } from "jose";
import type { PolicyContext } from "../../../src/server/authz/context";

const directory = mkdtempSync(join(tmpdir(), "nexus-auth-matrix-"));
process.env.DATA_DIR = directory;
process.env.JWT_SECRET = "nexus-isolated-auth-test-secret";
process.env.API_KEY_SECRET = "nexus-isolated-api-test-secret";
process.env.OMNIROUTE_DISABLE_REDIS_AUTH_CACHE = "1";
const { resetDbInstance } = await import("../../../src/lib/db/core");
const { updateSettings } = await import("../../../src/lib/db/settings");
const { managementPolicy } = await import("../../../src/server/authz/policies/management");
const { isLocalOnlyBypassableByManageScope } = await import("../../../src/server/authz/routeGuard");
await updateSettings({ requireLogin: false });
const token = await new SignJWT({ authenticated: true })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("1h")
  .sign(new TextEncoder().encode(process.env.JWT_SECRET));
test.after(() => {
  resetDbInstance();
  rmSync(directory, { recursive: true, force: true });
});

const paths = [
  "/api/nexus",
  "/api/nexus/",
  "/api/nexus/telemetry",
  "/api/nexus/clients/config",
  "/api/nexus/workflows/runs",
  "/api/nexus/providers",
];
for (const endpoint of paths) {
  for (const peer of ["127.0.0.1", "::1", "192.168.1.12", "10.0.0.9", "203.0.113.9", undefined]) {
    for (const authenticated of [false, true]) {
      test(`NEXUS auth: ${endpoint} peer=${peer ?? "unknown"} session=${authenticated}`, async () => {
        const context: PolicyContext = {
          requestId: "isolated-test",
          classification: {
            routeClass: "MANAGEMENT",
            reason: "management_api",
            normalizedPath: endpoint,
          },
          request: {
            method: "GET",
            url: `http://127.0.0.1:20129${endpoint}`,
            headers: new Headers({
              host: "localhost:20129",
              ...(authenticated ? { cookie: `auth_token=${token}` } : {}),
            }),
            ...(peer ? { socket: { remoteAddress: peer } } : {}),
          },
        };
        const result = await managementPolicy.evaluate(context);
        const local = peer === "127.0.0.1" || peer === "::1";
        assert.equal(result.allow, local && authenticated);
        if (!result.allow) assert.equal(result.status, local ? 401 : 403);
        assert.equal(isLocalOnlyBypassableByManageScope(endpoint), false);
      });
    }
  }
}
