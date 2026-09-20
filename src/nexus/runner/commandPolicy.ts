import { z } from "zod";

export const runnerCommandSchema = z
  .object({
    executable: z.enum(["git", "node"]),
    args: z.array(z.string().max(256)).max(8),
  })
  .strict();
export type RunnerCommand = z.infer<typeof runnerCommandSchema>;

// Exact vectors, not prefixes. Shells and code-evaluation switches are forbidden.
const GIT_ARGUMENTS = [
  ["rev-parse", "HEAD"],
  ["branch", "--show-current"],
  ["status", "--porcelain=v1", "-z", "--untracked-files=all"],
  ["diff", "--no-ext-diff", "--no-textconv"],
  ["diff", "--cached", "--no-ext-diff", "--no-textconv"],
  ["diff", "--stat", "--no-ext-diff", "--no-textconv", "HEAD"],
  ["diff", "--check", "--no-ext-diff", "--no-textconv"],
] as const;

export function validateRunnerCommand(value: unknown): RunnerCommand {
  const parsed = runnerCommandSchema.safeParse(value);
  if (!parsed.success)
    throw new Error(
      "NEXUS_RUNNER_COMMAND_DENIED: structured executable/args required; shell strings are forbidden."
    );
  const { executable, args } = parsed.data;
  const allowed = executable === "node" ? [["--version"]] : GIT_ARGUMENTS;
  if (
    !allowed.some(
      (entry) => entry.length === args.length && entry.every((arg, i) => arg === args[i])
    )
  ) {
    throw new Error("NEXUS_RUNNER_COMMAND_DENIED: command arguments are not allowlisted.");
  }
  return parsed.data;
}

export function buildRunnerEnvironment(
  overrides: Readonly<Record<string, string>> = {}
): NodeJS.ProcessEnv {
  const environment: NodeJS.ProcessEnv = {
    PATH: "/usr/bin:/bin",
    LANG: "C",
    LC_ALL: "C",
    NO_COLOR: "1",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_TERMINAL_PROMPT: "0",
    GIT_OPTIONAL_LOCKS: "0",
    GIT_NO_REPLACE_OBJECTS: "1",
  };
  for (const [name, value] of Object.entries(overrides)) {
    if (name !== "NO_COLOR" || value !== "1") {
      throw new Error("NEXUS_RUNNER_ENV_DENIED: environment override is not allowlisted.");
    }
    environment[name] = value;
  }
  return environment;
}
