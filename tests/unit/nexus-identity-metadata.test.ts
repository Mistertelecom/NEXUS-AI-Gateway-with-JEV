import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import electronPackage from "../../electron/package.json" with { type: "json" };
import productPackage from "../../package.json" with { type: "json" };
import manifest from "../../src/app/manifest";
import { APP_CONFIG } from "../../src/shared/constants/appConfig";

test("NEXUS publishes its product version separately from the inherited engine version", () => {
  assert.equal(productPackage.name, "nexus-ai-control-plane");
  assert.equal(productPackage.version, "0.1.0-alpha.1");
  assert.equal(productPackage.bin.nexus, "bin/nexus.mjs");
  assert.equal(APP_CONFIG.name, "NEXUS");
  assert.equal(APP_CONFIG.productVersion, productPackage.version);
  assert.equal(APP_CONFIG.version, "3.8.51");
  assert.notEqual(APP_CONFIG.productVersion, APP_CONFIG.version);
  assert.equal(electronPackage.version, productPackage.version);
  assert.equal(electronPackage.build.productName, "NEXUS");
  assert.equal(electronPackage.build.appId, "nexus.controlplane");
  assert.equal(productPackage.repository, undefined);
  assert.equal(productPackage.homepage, undefined);
  assert.equal(electronPackage.homepage, undefined);
  assert.equal(electronPackage.build.publish, undefined);

  const versionOutput = execFileSync(process.execPath, ["bin/nexus.mjs", "--version"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.equal(versionOutput.trim(), `NEXUS ${productPackage.version}`);
});

test("NEXUS CLI exposes its own public identity and local port", () => {
  const isolatedHome = fs.mkdtempSync(path.join(process.env.TMPDIR ?? "/tmp", "nexus-cli-"));
  try {
    const cliEnvironment = {
      ...process.env,
      DATA_DIR: path.join(isolatedHome, ".nexus"),
      HOME: isolatedHome,
      LANG: "en_US.UTF-8",
      NEXUS_LANG: "en",
      OMNIROUTE_CLI_SKIP_REPO_ENV: "1",
    };
    const helpOutput = execFileSync(process.execPath, ["bin/nexus.mjs", "--help"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: cliEnvironment,
    });
    const serveHelpOutput = execFileSync(process.execPath, ["bin/nexus.mjs", "serve", "--help"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: cliEnvironment,
    });

    assert.match(helpOutput, /^Usage: nexus/m);
    assert.match(helpOutput, /NEXUS control plane/);
    assert.doesNotMatch(helpOutput, /OmniRoute|omniroute|OMNIROUTE|20128/);
    assert.match(serveHelpOutput, /default: 20129/);
    assert.doesNotMatch(serveHelpOutput, /OmniRoute|omniroute|OMNIROUTE|20128/);
  } finally {
    fs.rmSync(isolatedHome, { recursive: true, force: true });
  }
});

test("NEXUS manifest only advertises assets included in the public distribution", () => {
  for (const icon of manifest().icons ?? []) {
    assert.ok(icon.src.startsWith("/"));
    assert.ok(fs.existsSync(path.join(process.cwd(), "public", icon.src.slice(1))), icon.src);
  }
});
