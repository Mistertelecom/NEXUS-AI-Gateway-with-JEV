import assert from "node:assert/strict";
import test from "node:test";

import { ConfigGenerators } from "../../../src/nexus/clients/configGenerators.ts";

test("ConfigGenerators requires an explicit discovered model or saved NEXUS Pair ID", () => {
  const generator = new ConfigGenerators({ gatewayApiKey: "test-secret" });

  assert.throws(
    () => generator.generateHermesConfig(),
    /select a discovered model ID or saved NEXUS Pair ID/i
  );
  assert.throws(
    () => generator.generateCodexConfig(),
    /select a discovered model ID or saved NEXUS Pair ID/i
  );
  assert.throws(
    () => generator.generateOpenCodeConfig(),
    /select a discovered model ID or saved NEXUS Pair ID/i
  );
});

test("ConfigGenerators rejects retired NEXUS virtual aliases", () => {
  const generator = new ConfigGenerators({ gatewayApiKey: "test-secret" });
  const retiredAliases = ["nexus/auto", "nexus/flash-jev", "nexus/code-review"];

  for (const model of retiredAliases) {
    assert.throws(
      () => generator.generateHermesConfig({ defaultModel: model }),
      /no longer supported/i
    );
    assert.throws(
      () => generator.generateCodexConfig({ defaultModel: model }),
      /no longer supported/i
    );
    assert.throws(
      () => generator.generateOpenCodeConfig({ defaultModel: model }),
      /no longer supported/i
    );
  }
});

test("ConfigGenerators serializes the caller-selected saved NEXUS Pair ID without virtual fallbacks", () => {
  const selectedModel = "nexus/selected-pair";
  const generator = new ConfigGenerators({ gatewayApiKey: "test-secret" });

  const hermes = generator.generateHermesConfig({ defaultModel: selectedModel });
  const codex = generator.generateCodexConfig({ defaultModel: selectedModel });
  const openCode = JSON.parse(
    generator.generateOpenCodeConfig({ defaultModel: selectedModel })
  ) as { models: Record<string, string> };

  assert.match(hermes, /default: "nexus\/selected-pair"/);
  assert.equal(hermes.includes("fallback:"), false);
  assert.match(codex, /default = "nexus\/selected-pair"/);
  assert.equal(codex.includes("planner ="), false);
  assert.equal(codex.includes("reviewer ="), false);
  assert.deepEqual(openCode.models, { default: selectedModel });
});
