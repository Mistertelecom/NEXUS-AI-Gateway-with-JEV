import { execFile } from "node:child_process";
import type { ExecutionResult } from "./managedRunner";

export function executeBoundedProcess(
  executable: string,
  args: readonly string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
  timeoutMs: number,
  maxOutputBytes: number
): Promise<ExecutionResult> {
  const started = Date.now();
  return new Promise((resolve) => {
    execFile(
      executable,
      [...args],
      {
        cwd,
        env,
        shell: false,
        windowsHide: true,
        encoding: "utf8",
        timeout: timeoutMs,
        maxBuffer: Math.max(1, Math.floor(maxOutputBytes / 2)),
        killSignal: "SIGKILL",
      },
      (error, stdout, stderr) => {
        const outputLimitExceeded = error?.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER";
        const timedOut = Boolean(error?.killed && !outputLimitExceeded);
        resolve({
          stdout,
          stderr: stderr || error?.message || "",
          exitCode: timedOut
            ? 124
            : outputLimitExceeded
              ? 125
              : error
                ? typeof error.code === "number"
                  ? error.code
                  : 1
                : 0,
          durationMs: Date.now() - started,
          timedOut,
          outputLimitExceeded,
          ...(error?.signal ? { signal: error.signal } : {}),
        });
      }
    );
  });
}
