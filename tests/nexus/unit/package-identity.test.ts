import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import productPackage from "../../../package.json" with { type: "json" };
import {
  PACK_ARTIFACT_ALLOWED_EXACT_PATHS,
  PACK_ARTIFACT_ALLOWED_PATH_PREFIXES,
  PACK_ARTIFACT_REQUIRED_PATHS,
  findUnexpectedArtifactPaths,
} from "../../../scripts/build/pack-artifact-policy";
import * as packIdentity from "../../../scripts/check/pack-boot-identity.mjs";

test("NEXUS package exposes only its own executable and includes its runtime source", () => {
  // Given the product's public package manifest.
  const executableNames = Object.keys(productPackage.bin);
  // When npm registers its public executables.
  const entry = productPackage.bin.nexus;
  // Then it cannot replace an installed OmniRoute command.
  assert.deepEqual(executableNames, ["nexus"]);
  assert.equal(entry, "bin/nexus.mjs");
  assert.ok(productPackage.files.includes("src/nexus/"));
});

test("NEXUS does not expose inherited uninstall or rollback operations for another package", () => {
  // Given the public package lifecycle and packed file selection.
  const scripts = Object.keys(productPackage.scripts);
  // When an operator uses this package's declared maintenance interfaces.
  const legacyUninstall = scripts.filter(
    (name) => name === "uninstall" || name === "uninstall:full"
  );
  // Then no legacy hook can remove an independent OmniRoute installation.
  assert.deepEqual(legacyUninstall, []);
  assert.ok(productPackage.files.includes("!bin/rollback.sh"));
});

test("NEXUS help exposes the inherited command registry with the product executable name", () => {
  // Given an isolated data directory for the real command entrypoint.
  const scratch = mkdtempSync(path.join(tmpdir(), "nexus-cli-help-"));
  try {
    // When requesting help through the public NEXUS executable.
    const result = spawnSync(process.execPath, [productPackage.bin.nexus, "--help"], {
      encoding: "utf8",
      timeout: 30_000,
      env: {
        ...process.env,
        DATA_DIR: scratch,
        OMNIROUTE_CLI_SKIP_REPO_ENV: "1",
        OMNIROUTE_NO_UPDATE_NOTIFIER: "1",
        DISABLE_SQLITE_AUTO_BACKUP: "true",
      },
    });
    // Then gateway operations remain available through the correctly named CLI.
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage: nexus\b/u);
    assert.match(result.stdout, /serve \[options\]/u);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});

test("the packaged NEXUS version command runs inside node_modules without TypeScript stripping", () => {
  // Given the actual executable in a fresh npm-shaped package directory.
  const scratch = mkdtempSync(path.join(tmpdir(), "nexus-package-version-"));
  try {
    const packageRoot = path.join(scratch, "node_modules", productPackage.name);
    const entry = path.join(packageRoot, productPackage.bin.nexus);
    mkdirSync(path.dirname(entry), { recursive: true });
    copyFileSync(path.resolve(productPackage.bin.nexus), entry);
    copyFileSync(path.resolve("package.json"), path.join(packageRoot, "package.json"));
    // When the user's supported Node runtime executes it directly.
    const result = spawnSync(process.execPath, [entry, "--version"], {
      encoding: "utf8",
      timeout: 15_000,
    });
    // Then no development loader is needed.
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), `NEXUS ${productPackage.version}`);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});

for (const { entrypoint, args } of [
  { entrypoint: "public", args: [productPackage.bin.nexus, "update", "--apply"] },
  {
    entrypoint: "inherited",
    args: [
      "--input-type=module",
      "-e",
      'const { runUpdateCommand } = await import("./bin/cli/commands/update.mjs"); process.exitCode = await runUpdateCommand({ apply: true, dryRun: true });',
    ],
  },
] as const) {
  test(`NEXUS ${entrypoint} updater fails closed before spawning npm or applying an upstream update`, () => {
    // Given a trap executable that records any npm invocation without installing anything.
    const scratch = mkdtempSync(path.join(tmpdir(), "nexus-update-policy-"));
    try {
      const marker = path.join(scratch, "npm-invoked");
      writeFileSync(
        path.join(scratch, "npm"),
        `#!${process.execPath}\nrequire("node:fs").writeFileSync(${JSON.stringify(marker)}, "called"); console.log("99.0.0");\n`,
        { mode: 0o755 }
      );
      // When either supported entrypoint receives an explicit apply request.
      const result = spawnSync(process.execPath, args, {
        encoding: "utf8",
        timeout: 15_000,
        env: { ...process.env, PATH: scratch },
      });
      // Then a stable product error rejects the operation before any npm lookup.
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stdout + result.stderr, /NEXUS_UPDATE_DISABLED/u);
      assert.equal(existsSync(marker), false);
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });
}

test("pack policy permits and requires the public NEXUS entrypoint", () => {
  // Given the package's executable and newly reachable adaptive runtime.
  const paths = ["bin/nexus.mjs", "src/nexus/pairs/runtime.ts"];
  // When the publish policy evaluates them.
  const unexpected = findUnexpectedArtifactPaths(paths, {
    exactPaths: PACK_ARTIFACT_ALLOWED_EXACT_PATHS,
    prefixPaths: PACK_ARTIFACT_ALLOWED_PATH_PREFIXES,
  });
  // Then packaging accepts them and cannot silently omit the entrypoint.
  assert.deepEqual(unexpected, []);
  assert.ok(PACK_ARTIFACT_REQUIRED_PATHS.includes("bin/nexus.mjs"));
});

test("pack boot resolves the NEXUS installation and executable instead of OmniRoute", () => {
  // Given an isolated npm installation prefix.
  const prefix = path.join(tmpdir(), "pack-prefix");
  // When resolving the installed artifact from its package metadata.
  const resolved = packIdentity.resolvePackBootPaths(prefix, productPackage);
  // Then both paths belong to NEXUS.
  assert.deepEqual(resolved, {
    packageRoot: path.join(prefix, "lib", "node_modules", "nexus-ai-control-plane"),
    binPath: path.join(prefix, "bin", "nexus"),
  });
});
