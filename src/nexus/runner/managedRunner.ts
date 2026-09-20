/** Bounded, allowlisted local operations; not an operating-system sandbox. */
import fs from "node:fs";
import path from "node:path";
import { buildRunnerEnvironment, validateRunnerCommand } from "./commandPolicy";
import { assertGitWorkspace, canonicalDirectory, isWithin, safeFilePath } from "./workspacePolicy";
import { executeBoundedProcess } from "./processExecution";
export { buildRunnerEnvironment } from "./commandPolicy";
export type { RunnerCommand } from "./commandPolicy";

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  timedOut?: boolean;
  outputLimitExceeded?: boolean;
  signal?: string;
}
export interface RunnerOptions {
  allowedRoots?: string[];
  maxCommandTimeoutMs?: number;
  maxOutputBytes?: number;
  maxFileBytes?: number;
}
function limit(value: number | undefined, fallback: number, ceiling: number): number {
  const result = value ?? fallback;
  if (!Number.isSafeInteger(result) || result < 1 || result > ceiling)
    throw new Error("Invalid runner resource limit.");
  return result;
}
export class ManagedRunner {
  private readonly allowedRoots: string[];
  private readonly maxTimeoutMs: number;
  private readonly maxOutputBytes: number;
  private readonly maxFileBytes: number;

  constructor(options: RunnerOptions = {}) {
    const roots = options.allowedRoots ?? [process.env.NEXUS_WORKSPACE_ROOT || process.cwd()];
    if (!roots.length) throw new Error("At least one authorized workspace root is required.");
    this.allowedRoots = roots.map(canonicalDirectory);
    this.maxTimeoutMs = limit(options.maxCommandTimeoutMs, 60000, 300000);
    this.maxOutputBytes = limit(options.maxOutputBytes, 1024 * 1024, 10 * 1024 * 1024);
    this.maxFileBytes = limit(options.maxFileBytes, 1024 * 1024, 10 * 1024 * 1024);
  }

  public assertWorkspaceAuthorized(workspacePath: string): string {
    const canonical = canonicalDirectory(workspacePath);
    if (!this.allowedRoots.some((root) => isWithin(root, canonical)))
      throw new Error("Unauthorized workspace boundary.");
    return canonical;
  }

  public resolveSafePath(workspacePath: string, relativePath: string): string {
    return safeFilePath(this.assertWorkspaceAuthorized(workspacePath), relativePath);
  }

  public async executeCommand(
    command: unknown,
    workspacePath: string,
    options: { timeoutMs?: number; env?: Record<string, string> } = {}
  ): Promise<ExecutionResult> {
    const selected = validateRunnerCommand(command);
    const workspace = this.assertWorkspaceAuthorized(workspacePath);
    const timeout = Math.min(
      limit(options.timeoutMs, this.maxTimeoutMs, 300000),
      this.maxTimeoutMs
    );
    const environment = buildRunnerEnvironment(options.env);
    let executable = process.execPath;
    let args = selected.args;
    if (selected.executable === "git") {
      assertGitWorkspace(workspace);
      executable = "/usr/bin/git";
      args = [
        "--no-pager",
        "-c",
        "core.fsmonitor=false",
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "core.attributesFile=/dev/null",
        "-c",
        "diff.external=",
        `--git-dir=${path.join(workspace, ".git")}`,
        `--work-tree=${workspace}`,
        ...args,
      ];
    }
    // Resolve only application-owned/system executables, never PATH or workspace binaries.
    executable = fs.realpathSync(executable);
    return executeBoundedProcess(
      executable,
      args,
      workspace,
      environment,
      timeout,
      this.maxOutputBytes
    );
  }

  private verifyOpenedFile(fd: number, workspace: string, relative: string): fs.Stats {
    const target = this.resolveSafePath(workspace, relative);
    const opened = fs.fstatSync(fd);
    const current = fs.statSync(target);
    if (
      !opened.isFile() ||
      opened.nlink !== 1 ||
      opened.ino !== current.ino ||
      opened.dev !== current.dev
    ) {
      throw new Error("File changed or violates workspace boundary.");
    }
    return opened;
  }

  public readFile(workspacePath: string, relativePath: string): string {
    const target = this.resolveSafePath(workspacePath, relativePath);
    const fd = fs.openSync(target, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    try {
      if (this.verifyOpenedFile(fd, workspacePath, relativePath).size > this.maxFileBytes)
        throw new Error("Runner file size limit exceeded.");
      const buffer = Buffer.alloc(this.maxFileBytes + 1);
      let length = 0;
      while (length < buffer.length) {
        const count = fs.readSync(fd, buffer, length, buffer.length - length, null);
        if (!count) break;
        length += count;
      }
      if (length > this.maxFileBytes) throw new Error("Runner file size limit exceeded.");
      this.verifyOpenedFile(fd, workspacePath, relativePath);
      return buffer.subarray(0, length).toString("utf8");
    } finally {
      fs.closeSync(fd);
    }
  }

  public writeFile(workspacePath: string, relativePath: string, content: string): void {
    if (typeof content !== "string" || Buffer.byteLength(content) > this.maxFileBytes)
      throw new Error("Runner file size limit exceeded.");
    const target = this.resolveSafePath(workspacePath, relativePath);
    // Parent directories must already exist; do not follow a newly created ancestor.
    const parent = fs.realpathSync(path.dirname(target));
    if (!isWithin(this.assertWorkspaceAuthorized(workspacePath), parent))
      throw new Error("Parent violates workspace boundary.");
    const fd = fs.openSync(
      target,
      fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_NOFOLLOW,
      0o600
    );
    try {
      this.verifyOpenedFile(fd, workspacePath, relativePath);
      fs.ftruncateSync(fd, 0);
      fs.writeFileSync(fd, content, "utf8");
      this.verifyOpenedFile(fd, workspacePath, relativePath);
    } finally {
      fs.closeSync(fd);
    }
  }
}
