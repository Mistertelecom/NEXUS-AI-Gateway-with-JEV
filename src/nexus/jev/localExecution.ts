import { z } from "zod";

const source = z.string().max(16_000);
export const jevLocalTaskSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("format_json"), source }).strict(),
  z.object({ kind: z.literal("validate_json"), source }).strict(),
  z.object({ kind: z.literal("sort_lines"), source }).strict(),
  z
    .object({
      kind: z.literal("replace_literal"),
      source,
      search: z.string().min(1).max(1000),
      replacement: z.string().max(1000),
      expectedOccurrences: z.number().int().min(1).max(100),
    })
    .strict(),
]);

export type JevLocalTask = z.infer<typeof jevLocalTaskSchema>;
export type JevDirectResult = {
  readonly executor: "local_deterministic";
  readonly operation: JevLocalTask["kind"];
  readonly content: string;
};

export class JevLocalTaskError extends Error {
  constructor(
    readonly code:
      | "INVALID_JSON"
      | "OCCURRENCE_MISMATCH"
      | "LOCAL_INPUT_LIMIT"
      | "LOCAL_OUTPUT_LIMIT"
      | "JSON_DEPTH_LIMIT"
  ) {
    super(code);
    this.name = "JevLocalTaskError";
  }
}

export function executeJevLocalTask(task: JevLocalTask): JevDirectResult {
  if (task.source.length > 16_000) throw new JevLocalTaskError("LOCAL_INPUT_LIMIT");
  let content: string;
  switch (task.kind) {
    case "format_json":
    case "validate_json": {
      let value: unknown;
      try {
        value = JSON.parse(task.source);
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        if (task.kind === "format_json") throw new JevLocalTaskError("INVALID_JSON");
        return {
          executor: "local_deterministic",
          operation: task.kind,
          content: '{"valid":false}',
        };
      }
      if (task.kind === "validate_json") {
        content = '{"valid":true}';
        break;
      }
      const pending = [{ value, depth: 0 }];
      while (pending.length) {
        const current = pending.pop();
        if (!current) break;
        if (current.depth > 64) throw new JevLocalTaskError("JSON_DEPTH_LIMIT");
        if (typeof current.value === "object" && current.value !== null) {
          for (const child of Object.values(current.value)) {
            pending.push({ value: child, depth: current.depth + 1 });
          }
        }
      }
      content = JSON.stringify(value, null, 2);
      break;
    }
    case "sort_lines":
      content = task.source.split(/\r?\n/u).sort().join("\n");
      break;
    case "replace_literal": {
      const parts = task.source.split(task.search);
      if (parts.length - 1 !== task.expectedOccurrences)
        throw new JevLocalTaskError("OCCURRENCE_MISMATCH");
      content = parts.join(task.replacement);
      break;
    }
    default: {
      const exhaustive: never = task;
      return exhaustive;
    }
  }
  if (content.length > 64_000) throw new JevLocalTaskError("LOCAL_OUTPUT_LIMIT");
  return { executor: "local_deterministic", operation: task.kind, content };
}
