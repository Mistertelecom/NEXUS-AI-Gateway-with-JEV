import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("standard test and typecheck gates include NEXUS sources", () => {
  const packageJson = fs.readFileSync(path.join(root, "package.json"), "utf8");
  const typecheck = fs.readFileSync(path.join(root, "tsconfig.nexus.json"), "utf8");
  const discovery = fs.readFileSync(
    path.join(root, "scripts/check/check-test-discovery.mjs"),
    "utf8"
  );

  assert.match(packageJson, /"test:nexus"/);
  assert.match(packageJson, /tests\/nexus\/\*\*\/\*\.test\.ts/);
  assert.match(typecheck, /src\/nexus\/\*\*\/\*\.ts/);
  assert.match(discovery, /tests\/nexus\/\*\*\/\*\.test\.ts/);
});

test("NEXUS container runs a production server on its dedicated port", () => {
  const dockerfile = fs.readFileSync(path.join(root, "Dockerfile.nexus"), "utf8");
  const compose = fs.readFileSync(path.join(root, "docker-compose.nexus.yml"), "utf8");

  assert.doesNotMatch(dockerfile, /CMD \["npm", "run", "dev"\]/);
  assert.match(dockerfile, /npm run build/);
  assert.match(dockerfile, /CMD \["npm", "run", "start"\]/);
  assert.match(compose, /127\.0\.0\.1:20129:20129/);
});
