import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { POST } from "../../../src/app/api/nexus/clients/config/route.ts";

async function withNexusConfigRoot<T>(root: string, callback: () => Promise<T>): Promise<T> {
  const previousRoot = process.env.NEXUS_CONFIG_ROOT;
  process.env.NEXUS_CONFIG_ROOT = root;
  try {
    return await callback();
  } finally {
    if (previousRoot === undefined) delete process.env.NEXUS_CONFIG_ROOT;
    else process.env.NEXUS_CONFIG_ROOT = previousRoot;
  }
}

test("NEXUS config route writes an allowed file without echoing generated secrets", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-config-route-"));
  const targetPath = path.join(root, "config.toml");
  try {
    await withNexusConfigRoot(root, async () => {
      const response = await POST(
        new Request("http://127.0.0.1/api/nexus/clients/config", {
          method: "POST",
          body: JSON.stringify({
            client: "codex",
            targetPath,
            writeToFile: true,
            options: {
              defaultModel: "nexus/saved-pair",
              gatewayApiKey: "caller-secret",
            },
          }),
        })
      );

      const responseText = JSON.stringify(await response.json());
      assert.equal(response.status, 200);
      assert.match(responseText, /"written":true/);
      assert.equal(responseText.includes("caller-secret"), false);
      assert.equal(responseText.includes('"content"'), false);
      assert.match(fs.readFileSync(targetPath, "utf8"), /caller-secret/);
    });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("NEXUS config route rejects arbitrary write targets without echoing their path", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-config-route-root-"));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-config-route-outside-"));
  const targetPath = path.join(outside, "arbitrary.toml");
  try {
    await withNexusConfigRoot(root, async () => {
      const response = await POST(
        new Request("http://127.0.0.1/api/nexus/clients/config", {
          method: "POST",
          body: JSON.stringify({
            client: "codex",
            targetPath,
            writeToFile: true,
            options: {
              defaultModel: "nexus/saved-pair",
              gatewayApiKey: "caller-secret",
            },
          }),
        })
      );

      const responseText = JSON.stringify(await response.json());
      assert.equal(response.status, 400);
      assert.equal(responseText.includes(targetPath), false);
      assert.equal(responseText.includes("caller-secret"), false);
      assert.equal(fs.existsSync(targetPath), false);
    });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test("NEXUS config route returns a sanitized validation error for malformed JSON", async () => {
  const response = await POST(
    new Request("http://127.0.0.1/api/nexus/clients/config", {
      method: "POST",
      body: "{",
    })
  );

  const responseText = JSON.stringify(await response.json());
  assert.equal(response.status, 400);
  assert.match(responseText, /Request body must be valid JSON/);
});
