import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("NEXUS loads React inspection tools only in an enabled development build", () => {
  // Given: the Next.js client instrumentation entry.
  const source = fs.readFileSync(path.join(process.cwd(), "src/instrumentation-client.ts"), "utf8");

  // When: its production and operator-disable guards are inspected.
  const developmentGuard = source.match(/process\.env\.NODE_ENV\s*===\s*"development"/g) ?? [];
  const disableFlag = source.match(/NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS/g) ?? [];

  // Then: both tools are dynamically loaded behind both guards.
  assert.equal(developmentGuard.length, 1);
  assert.equal(disableFlag.length, 1);
  assert.match(source, /import\("react-grab"\)/);
  assert.match(source, /import\("react-scan"\)/);
  assert.doesNotMatch(source, /^import\s+.*from\s+["']react-(?:grab|scan)["'];?$/m);
});
