import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { ConfigGenerators } from "../../../src/nexus/clients/configGenerators.ts";
import { NexusTelemetryStore } from "../../../src/nexus/telemetry/telemetryStore.ts";
import { ManagedRunner, buildRunnerEnvironment } from "../../../src/nexus/runner/managedRunner.ts";

function withNexusConfigRoot(root: string, callback: () => void): void {
  const previousRoot = process.env.NEXUS_CONFIG_ROOT;
  process.env.NEXUS_CONFIG_ROOT = root;
  try {
    callback();
  } finally {
    if (previousRoot === undefined) delete process.env.NEXUS_CONFIG_ROOT;
    else process.env.NEXUS_CONFIG_ROOT = previousRoot;
  }
}

test("ConfigGenerators writes a private known Codex target when NEXUS_CONFIG_ROOT is explicit", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-config-safety-"));
  const target = path.join(root, "config.toml");
  const linkedTarget = path.join(root, "linked.toml");
  const outside = path.join(root, "outside.toml");
  try {
    withNexusConfigRoot(root, () => {
      const generator = new ConfigGenerators({ gatewayApiKey: "test-secret" });

      const result = generator.writeConfig("codex", target, { defaultModel: "nexus/saved-pair" });
      assert.equal(result.targetPath, target);
      assert.equal(fs.statSync(target).mode & 0o777, 0o600);

      fs.writeFileSync(outside, "do-not-overwrite", { mode: 0o600 });
      fs.symlinkSync(outside, linkedTarget);
      assert.throws(
        () => generator.writeConfig("codex", linkedTarget, { defaultModel: "nexus/saved-pair" }),
        /authorized configuration target/i
      );
      assert.equal(fs.readFileSync(outside, "utf8"), "do-not-overwrite");
    });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("ConfigGenerators rejects an arbitrary path when no explicit configuration root exists", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-config-rejection-"));
  const target = path.join(root, "arbitrary.toml");
  const previousRoot = process.env.NEXUS_CONFIG_ROOT;
  delete process.env.NEXUS_CONFIG_ROOT;
  try {
    const generator = new ConfigGenerators({ gatewayApiKey: "test-secret" });

    assert.throws(() => generator.writeConfig("codex", target), /authorized configuration target/i);
    assert.equal(fs.existsSync(target), false);
  } finally {
    if (previousRoot === undefined) delete process.env.NEXUS_CONFIG_ROOT;
    else process.env.NEXUS_CONFIG_ROOT = previousRoot;
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("ConfigGenerators rejects a symbolic link in a non-immediate target ancestor", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-config-symlink-"));
  const outside = path.join(root, "outside");
  const configDirectory = path.join(root, ".config");
  const target = path.join(configDirectory, "opencode", "opencode.json");
  try {
    fs.mkdirSync(path.join(outside, "opencode"), { recursive: true });
    fs.symlinkSync(outside, configDirectory);

    withNexusConfigRoot(root, () => {
      const generator = new ConfigGenerators({ gatewayApiKey: "test-secret" });
      assert.throws(() => generator.writeConfig("opencode", target), /symbolic link/i);
    });

    assert.equal(fs.existsSync(path.join(outside, "opencode", "opencode.json")), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("ConfigGenerators defaults generated clients to the dedicated NEXUS loopback listener", () => {
  const generator = new ConfigGenerators({ gatewayApiKey: "test-secret" });

  const options = { defaultModel: "nexus/saved-pair" };

  assert.match(
    generator.generateHermesConfig(options),
    /endpoint: "http:\/\/127\.0\.0\.1:20129\/v1"/
  );
  assert.match(
    generator.generateCodexConfig(options),
    /base_url = "http:\/\/127\.0\.0\.1:20129\/v1"/
  );
  assert.match(
    generator.generateOpenCodeConfig(options),
    /"baseUrl": "http:\/\/127\.0\.0\.1:20129\/v1"/
  );
});

test("telemetry starts empty and does not invent latency, tokens, or savings", () => {
  const store = NexusTelemetryStore.getInstance();
  store.clear();

  assert.deepEqual(store.getCalls(), []);
  assert.deepEqual(store.getStats(), {
    totalCalls: 0,
    jevCalls: 0,
    usageMeasuredCalls: 0,
    costMeasuredCalls: 0,
    taskBreakdown: {},
    engineBreakdown: {},
  });
});

test("managed runner blocks symlink escapes and provider secrets", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-runner-root-"));
  const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-runner-outside-"));
  const outside = path.join(outsideRoot, "secret.txt");
  fs.writeFileSync(outside, "outside-secret", { mode: 0o600 });
  fs.symlinkSync(outside, path.join(root, "linked-secret.txt"));

  const runner = new ManagedRunner({ allowedRoots: [root] });
  assert.throws(() => runner.readFile(root, "linked-secret.txt"), /workspace boundary/i);

  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "must-not-reach-child";
  try {
    assert.equal(buildRunnerEnvironment().OPENAI_API_KEY, undefined);
    const result = await runner.executeCommand({ executable: "node", args: ["--version"] }, root);
    assert.equal(result.exitCode, 0);
    assert.equal(result.stdout.trim(), process.version);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});
