import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isAlwaysProtectedPath,
  isLocalOnlyPath,
  isStrictLoopbackOnlyPath,
  isLocalOnlyBypassableByManageScope,
} from "../../../src/server/authz/routeGuard.ts";
import { SPAWN_CAPABLE_PREFIXES } from "../../../src/shared/constants/spawnCapablePrefixes.ts";

// ─── T-12 (#3932 PR-3): /api/local/ is local-only ────────────────────────

test("isLocalOnlyPath: /api/local/ prefix is local-only (T-12, #3932)", () => {
  // 1-click local service launchers (Redis today) spawn podman/docker — must
  // be loopback-enforced before any auth check, same as /api/mcp/.
  assert.equal(isLocalOnlyPath("/api/local/redis/start"), true);
  assert.equal(isLocalOnlyPath("/api/local/redis/stop"), true);
  assert.equal(isLocalOnlyPath("/api/local/redis/status"), true);
  assert.equal(isLocalOnlyPath("/api/local/"), true);
  // Future /api/local/* sub-paths must also be classified — prefix is generic.
  assert.equal(isLocalOnlyPath("/api/local/postgres/start"), true);
  assert.equal(isLocalOnlyPath("/api/local/ollama/status"), true);
});

test("isLocalOnlyPath: /api/local* does NOT match the bare /api/localifications path", () => {
  // Regression guard: the prefix must end with "/" to avoid over-broadening.
  // (We don't have such a route today, but if /api/localization ever appears,
  // it should NOT be loopback-enforced just because it shares a prefix.)
  assert.equal(isLocalOnlyPath("/api/localization"), false);
  assert.equal(isLocalOnlyPath("/api/localhost-check"), false);
});

// ─── /api/oauth/cursor/auto-import is local-only (spawns `which cursor`) ──

test("isLocalOnlyPath: /api/oauth/cursor/auto-import is local-only (spawns child process)", () => {
  // The Cursor auto-import route runs `execFile("which", ["cursor"])` to verify a
  // local Cursor install before importing its credentials — a child-process spawn
  // that must be loopback-enforced BEFORE any auth check (Hard Rules #15/#17), so a
  // leaked JWT via tunnel cannot reach the spawn. Found by check:route-guard-membership.
  assert.equal(isLocalOnlyPath("/api/oauth/cursor/auto-import"), true);
});

test("isLocalOnlyPath: the rest of /api/oauth/ stays remote-reachable (no over-broadening)", () => {
  // Only the spawn-capable auto-import path is loopback-locked. The rest of the OAuth
  // surface (browser redirect / callback flows) MUST remain reachable remotely — a
  // flat /api/oauth/ prefix would wrongly lock the whole OAuth subtree.
  assert.equal(isLocalOnlyPath("/api/oauth/cursor"), false);
  assert.equal(isLocalOnlyPath("/api/oauth/cursor/callback"), false);
  assert.equal(isLocalOnlyPath("/api/oauth/anthropic/callback"), false);
});

test("isLocalOnlyBypassableByManageScope: /api/local/ is NOT bypassable (defence in depth)", () => {
  // The kill-switch path. Even if a DB row tries to whitelist /api/local/ via
  // the manage-scope bypass list, the runtime predicate must reject it because
  // /api/local/ is in SPAWN_CAPABLE_PREFIXES.
  //
  // The predicate reads from runtime settings; here we exercise the
  // defence-in-depth clause directly by checking the relevant invariant:
  // /api/local/ must be in the same spawn-capable set as /api/cli-tools/runtime/.
  assert.equal(isLocalOnlyPath("/api/local/redis/start"), true);
  // Same-origin false-positive guard: ensure /api/local is treated like every
  // other spawn-capable prefix (no whitelist carve-out).
  assert.equal(isLocalOnlyBypassableByManageScope("/api/local/redis/start"), false);
});

test("NEXUS command workflows are loopback-only and cannot enter the manage-scope bypass", () => {
  // Given NEXUS control APIs can spawn CLIs, write local config, or expose local evidence.
  const controlPaths = [
    "/api/nexus/clients/config",
    "/api/nexus/doctor",
    "/api/nexus/providers",
    "/api/nexus/telemetry",
    "/api/nexus/workflows/runs",
  ];

  // When the central authorization policy classifies the path.
  // Then remote callers are denied before auth and the prefix cannot be allowlisted.
  for (const path of controlPaths) {
    assert.equal(isLocalOnlyPath(path), true, path);
    assert.equal(isLocalOnlyBypassableByManageScope(path), false, path);
    assert.equal(isAlwaysProtectedPath(path), true, path);
  }
  assert.equal(SPAWN_CAPABLE_PREFIXES.includes("/api/nexus/"), true);
});

test("NEXUS is strict-loopback and does not inherit the private-LAN carve-out", () => {
  assert.equal(isStrictLoopbackOnlyPath("/api/nexus/providers"), true);
  assert.equal(isStrictLoopbackOnlyPath("/api/services/status"), false);
});
