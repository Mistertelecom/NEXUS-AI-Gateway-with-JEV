import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ManagedRunner, buildRunnerEnvironment } from "../../../src/nexus/runner/managedRunner";
import { SnapshotEngine } from "../../../src/nexus/runner/snapshot";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-runner-policy-"));
const outside = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-runner-outside-"));
const runner = new ManagedRunner({ allowedRoots: [root] });
test.after(() => {
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(outside, { recursive: true, force: true });
});

for (const command of [
  "node --version",
  "npm test",
  "echo ok; id",
  { executable: "node", args: ["-e", "process.exit(0)"] },
  { executable: "git", args: ["config", "--list"] },
  { executable: "/bin/sh", args: ["-c", "true"] },
]) {
  test(`runner rejects commands outside its exact allowlist: ${JSON.stringify(command)}`, async () => {
    await assert.rejects(runner.executeCommand(command, root), /COMMAND_DENIED/);
  });
}
test("runner executes an actual allowlisted process and returns its real output", async () => {
  const result = await runner.executeCommand({ executable: "node", args: ["--version"] }, root);
  assert.equal(result.exitCode, 0);
  assert.equal(result.stdout.trim(), process.version);
});
test("runner propagates a real nonzero Git exit and snapshot cannot turn failure into clean", async () => {
  fs.mkdirSync(path.join(root, ".git"), { recursive: true });
  const result = await runner.executeCommand(
    { executable: "git", args: ["rev-parse", "HEAD"] },
    root
  );
  assert.notEqual(result.exitCode, 0);
  assert.match(result.stderr, /not a git repository/i);
  await assert.rejects(SnapshotEngine.captureSnapshot(root, runner), /SNAPSHOT_FAILED/);
});
test("runner rejects secret and executable-control environment overrides", async () => {
  for (const name of [
    "OPENAI_API_KEY",
    "NODE_OPTIONS",
    "PATH",
    "HOME",
    "LD_PRELOAD",
    "GIT_CONFIG_COUNT",
    "UNEXPECTED",
  ]) {
    assert.throws(() => buildRunnerEnvironment({ [name]: "forbidden" }), /ENV_DENIED/);
  }
  assert.equal(buildRunnerEnvironment().OPENAI_API_KEY, undefined);
  assert.equal(buildRunnerEnvironment().HOME, undefined);
  assert.equal(buildRunnerEnvironment().NODE_OPTIONS, undefined);
});
test("runner rejects invalid roots, resource limits and workspace traversal", () => {
  assert.throws(() => new ManagedRunner({ allowedRoots: [] }));
  assert.throws(() => new ManagedRunner({ allowedRoots: [path.join(root, "missing")] }));
  assert.throws(() => new ManagedRunner({ maxCommandTimeoutMs: 0 }));
  assert.throws(() => runner.readFile(root, "../outside"), /boundary/);
  assert.throws(() => runner.assertWorkspaceAuthorized(outside), /boundary/);
});
test("runner blocks live, dangling and ancestor symlinks, hard links and oversized files", () => {
  fs.writeFileSync(path.join(outside, "secret"), "outside");
  fs.symlinkSync(path.join(outside, "secret"), path.join(root, "linked"));
  fs.symlinkSync(path.join(outside, "missing"), path.join(root, "dangling"));
  fs.symlinkSync(outside, path.join(root, "ancestor"));
  fs.linkSync(path.join(outside, "secret"), path.join(root, "hard"));
  for (const relative of ["linked", "dangling", "ancestor/new", "hard"]) {
    assert.throws(() => runner.writeFile(root, relative, "must not write"));
  }
  assert.equal(fs.readFileSync(path.join(outside, "secret"), "utf8"), "outside");
  const small = new ManagedRunner({ allowedRoots: [root], maxFileBytes: 4 });
  assert.throws(() => small.writeFile(root, "large", "12345"), /size limit/);
});
test("output and timeout limits fail with nonzero exit codes", async () => {
  const small = new ManagedRunner({ allowedRoots: [root], maxOutputBytes: 2 });
  const command = { executable: "node", args: ["--version"] };
  const exceeded = await small.executeCommand(command, root);
  assert.equal(exceeded.outputLimitExceeded, true);
  assert.equal(exceeded.exitCode, 125);
  const timed = await runner.executeCommand(command, root, { timeoutMs: 1 });
  assert.equal(timed.timedOut, true);
  assert.equal(timed.exitCode, 124);
});
