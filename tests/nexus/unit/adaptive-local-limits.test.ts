import assert from "node:assert/strict";
import test from "node:test";

import { executeJevLocalTask, JevLocalTaskError } from "../../../src/nexus/jev/localExecution";

test("local JSON formatting rejects nesting that would amplify a bounded input", () => {
  // Given a small input whose pretty-printed result grows quadratically.
  const source = "[".repeat(2000) + "0" + "]".repeat(2000);
  // When JEV executes the bounded transformation, then it rejects the expansion.
  assert.throws(() => executeJevLocalTask({ kind: "format_json", source }), JevLocalTaskError);
});

test("local replacement rejects expanded output beyond its budget", () => {
  // Given 100 exact replacements with large but schema-valid replacement text.
  const task = {
    kind: "replace_literal",
    source: "x".repeat(100),
    search: "x",
    replacement: "y".repeat(1000),
    expectedOccurrences: 100,
  } as const;
  // When JEV executes the transformation, then the output budget is enforced.
  assert.throws(() => executeJevLocalTask(task), JevLocalTaskError);
});

test("local replacement refuses a mismatched occurrence count", () => {
  // Given a Lead plan that promises two occurrences but supplies one.
  const task = {
    kind: "replace_literal",
    source: "x",
    search: "x",
    replacement: "y",
    expectedOccurrences: 2,
  } as const;
  // When JEV executes the replacement, then it fails rather than guessing.
  assert.throws(
    () => executeJevLocalTask(task),
    (error: unknown) => error instanceof JevLocalTaskError && error.code === "OCCURRENCE_MISMATCH"
  );
});

test("local validation returns a truthful invalid-JSON result", () => {
  // Given invalid user-provided JSON.
  const task = { kind: "validate_json", source: "{" } as const;
  // When JEV validates it.
  const result = executeJevLocalTask(task);
  // Then the returned result represents the actual validation.
  assert.equal(result.content, '{"valid":false}');
});
