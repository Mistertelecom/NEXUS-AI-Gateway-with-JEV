import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import {
  isRecord,
  readOptionalString,
  readUsage,
  parseCliRecord,
  type CliUsage,
} from "./antigravityProtocol";

export function streamAntigravity(
  binary: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  onDelta: (text: string) => void,
  onDone: (usage: CliUsage | undefined) => void,
  onError: (error: Error) => void
): { abort: () => void } {
  const child = spawn(binary, args, { cwd, shell: false, stdio: ["ignore", "pipe", "pipe"] });
  const decoder = new StringDecoder("utf8");
  let buffer = "";
  let bytes = 0;
  let textObserved = false;
  let resultObserved = false;
  let settled = false;
  let usage: CliUsage | undefined;
  const finishError = (error: Error): void => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    child.kill("SIGKILL");
    onError(error);
  };
  const timer = setTimeout(
    () => finishError(new Error("Antigravity CLI stream timed out.")),
    timeoutMs
  );
  const acceptUsage = (value: unknown) => {
    const reported = readUsage(value);
    if (reported) {
      usage ??= {};
      usage = {
        ...(usage.inputTokens !== undefined ? { inputTokens: usage.inputTokens } : {}),
        ...(usage.outputTokens !== undefined ? { outputTokens: usage.outputTokens } : {}),
        ...(reported.inputTokens !== undefined ? { inputTokens: reported.inputTokens } : {}),
        ...(reported.outputTokens !== undefined ? { outputTokens: reported.outputTokens } : {}),
      };
    }
  };
  const parseLine = (line: string) => {
    if (!line.trim() || settled) return;
    if (!line.trimStart().startsWith("{")) return;
    const event = parseCliRecord(line);
    if (!event) return; // Informational lines are not completion evidence.
    if (event["event"] === "error") throw new Error("Antigravity CLI reported a stream error.");
    const step = isRecord(event["step_update"]) ? event["step_update"] : undefined;
    const delta = step ? readOptionalString(step["text_delta"]) : undefined;
    if (event["event"] === "step_update" && delta) {
      textObserved = true;
      onDelta(delta);
    }
    acceptUsage(step?.["usage"]);
    if (event["event"] === "result") {
      const result = isRecord(event["result"]) ? event["result"] : undefined;
      if (!result || (result["status"] !== undefined && result["status"] !== "SUCCESS")) {
        throw new Error("Antigravity CLI did not confirm stream success.");
      }
      resultObserved = true;
      acceptUsage(result["usage"]);
    }
  };
  const count = (chunk: Buffer): boolean => {
    bytes += chunk.length;
    if (bytes > 2 * 1024 * 1024)
      finishError(new Error("Antigravity CLI stream output limit exceeded."));
    return !settled;
  };
  child.stdout.on("data", (chunk: Buffer) => {
    if (!count(chunk)) return;
    buffer += decoder.write(chunk);
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    try {
      for (const line of lines) parseLine(line);
    } catch (error) {
      finishError(error instanceof Error ? error : new Error("Invalid Antigravity stream."));
    }
  });
  child.stderr.on("data", (chunk: Buffer) => {
    count(chunk);
  });
  child.on("error", finishError);
  child.on("close", (code, signal) => {
    if (settled) return;
    try {
      parseLine(buffer + decoder.end());
    } catch (error) {
      finishError(error instanceof Error ? error : new Error("Invalid final stream record."));
      return;
    }
    if (code !== 0 || signal) {
      finishError(
        new Error(`Antigravity CLI exited with code ${code}, signal ${signal ?? "none"}.`)
      );
      return;
    }
    if (!textObserved || !resultObserved) {
      finishError(new Error("Antigravity CLI stream ended without completion evidence."));
      return;
    }
    settled = true;
    clearTimeout(timer);
    onDone(usage);
  });
  return { abort: () => finishError(new Error("Antigravity CLI stream aborted.")) };
}
