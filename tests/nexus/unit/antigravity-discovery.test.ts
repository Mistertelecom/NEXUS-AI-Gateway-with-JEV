import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { AntigravityCliConnector } from "../../../src/nexus/providers/connectors/antigravityCli.ts";

function createDiscoveredModelFixture(root: string): string {
  const binary = path.join(root, "agy-fixture");
  fs.writeFileSync(
    binary,
    `#!/bin/sh
if [ "$1" = "models" ]; then
  printf '%s\\n' 'catalog-model Catalog Model'
  exit 0
fi

if [ "$1" = "-p" ]; then
  model=""
  output_format=""
  while [ "$#" -gt 0 ]; do
    if [ "$1" = "--model" ]; then
      model="$2"
    fi
    if [ "$1" = "--output-format" ]; then
      output_format="$2"
    fi
    shift
  done

  if [ "$model" != "catalog-model" ]; then
    printf '%s\\n' 'requested model was not discovered' >&2
    exit 2
  fi

  if [ "$output_format" = "stream-json" ]; then
    printf '%s\\n' '{"event":"step_update","step_update":{"text_delta":"fixture ","usage":{"input_tokens":3,"output_tokens":1}}}'
    printf '%s\\n' '{"event":"step_update","step_update":{"text_delta":"stream","usage":{"input_tokens":3,"output_tokens":2}}}'
    printf '%s\\n' '{"event":"result","result":{"usage":{"input_tokens":3,"output_tokens":2}}}'
    exit 0
  fi

  printf '%s\\n' '{"status":"SUCCESS","response":"fixture answer","usage":{"input_tokens":1,"output_tokens":1}}'
  exit 0
fi

printf '%s\\n' 'unsupported fixture invocation' >&2
exit 2
`,
    { encoding: "utf8", mode: 0o700 }
  );
  return binary;
}

test("AntigravityCliConnector probes and executes only a model returned by discovery", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-agy-discovery-"));
  try {
    const connector = new AntigravityCliConnector({
      binaryPath: createDiscoveredModelFixture(root),
    });

    const discovered = await connector.discoverModels();
    assert.deepEqual(
      discovered.map((model) => model.id),
      ["antigravity/catalog-model"]
    );

    const probe = await connector.testConnection();
    assert.equal(probe.success, true);

    const execution = await connector.executePrompt("fixture prompt", "antigravity/catalog-model");
    assert.equal(execution.text, "fixture answer");

    await assert.rejects(
      () => connector.executePrompt("fixture prompt", "antigravity/not-in-catalog"),
      /not part of the discovered catalog/i
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("AntigravityCliConnector rejects execution when no discovered model was selected", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-agy-selection-"));
  try {
    const connector = new AntigravityCliConnector({
      binaryPath: createDiscoveredModelFixture(root),
    });

    await connector.discoverModels();

    await assert.rejects(
      () => connector.executePrompt("fixture prompt"),
      /select a model from the discovered catalog/i
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("Given a discovered model, when its CLI stream reports deltas and usage, then those reported values are forwarded", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-agy-stream-"));
  try {
    const connector = new AntigravityCliConnector({
      binaryPath: createDiscoveredModelFixture(root),
    });
    await connector.discoverModels();

    const result = await new Promise<{
      readonly text: string;
      readonly usage: { readonly inputTokens?: number; readonly outputTokens?: number } | undefined;
    }>((resolve, reject) => {
      const deltas: string[] = [];
      connector.streamPrompt(
        "fixture prompt",
        "antigravity/catalog-model",
        (text) => deltas.push(text),
        (usage) => resolve({ text: deltas.join(""), usage }),
        (error) => reject(error)
      );
    });

    assert.equal(result.text, "fixture stream");
    assert.deepEqual(result.usage, { inputTokens: 3, outputTokens: 2 });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("Antigravity keeps unknown capacity, cost and usage absent", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-agy-no-usage-"));
  try {
    const binary = createDiscoveredModelFixture(root);
    fs.writeFileSync(
      binary,
      fs.readFileSync(binary, "utf8").replace(/"usage":/g, '"fixture_unreported_usage":')
    );
    const connector = new AntigravityCliConnector({ binaryPath: binary });
    const [model] = await connector.discoverModels();
    assert.equal(model.contextWindow, undefined);
    assert.equal(model.inputCostPer1k, undefined);
    assert.equal(model.supportsReasoning, undefined);
    assert.equal(connector.status, "configured");
    const response = await connector.executePrompt("fixture prompt", model.id);
    assert.equal(response.usage, undefined);
    const usage = await new Promise((resolve, reject) => {
      connector.streamPrompt("fixture prompt", model.id, () => {}, resolve, reject);
    });
    assert.equal(usage, undefined);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("Antigravity never accepts empty successful-process output as model success", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-agy-empty-"));
  try {
    const binary = createDiscoveredModelFixture(root);
    const marker = 'if [ "$1" = "-p" ]; then';
    fs.writeFileSync(
      binary,
      fs.readFileSync(binary, "utf8").replace(marker, marker + "\n  exit 0")
    );
    const connector = new AntigravityCliConnector({ binaryPath: binary });
    const [model] = await connector.discoverModels();
    await assert.rejects(connector.executePrompt("fixture prompt", model.id));
    await assert.rejects(
      new Promise((resolve, reject) => {
        connector.streamPrompt("fixture prompt", model.id, () => {}, resolve, reject);
      }),
      /without completion evidence/
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
