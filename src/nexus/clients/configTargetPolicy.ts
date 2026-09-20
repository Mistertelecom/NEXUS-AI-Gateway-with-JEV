import fs from "node:fs";
import type { Stats } from "node:fs";
import os from "node:os";
import path from "node:path";

export const CONFIG_CLIENTS = ["hermes", "codex", "opencode"] as const;
export type ConfigClient = (typeof CONFIG_CLIENTS)[number];

export class ConfigTargetError extends Error {
  public readonly name = "ConfigTargetError";

  public constructor(message: string) {
    super(message);
  }
}

interface AuthorizedConfigTarget {
  readonly targetPath: string;
  readonly anchorPath: string;
}

const homeDirectory = path.resolve(os.homedir());
const defaultTargets: Readonly<Record<ConfigClient, string>> = {
  hermes: path.join(homeDirectory, ".hermes", "config.yaml"),
  codex: path.join(homeDirectory, ".codex", "config.toml"),
  opencode: path.join(homeDirectory, ".config", "opencode", "opencode.json"),
};
const rootRelativeTargets: Readonly<Record<ConfigClient, readonly string[]>> = {
  hermes: ["config.yaml", path.join(".hermes", "config.yaml")],
  codex: ["config.toml", path.join(".codex", "config.toml")],
  opencode: ["opencode.json", path.join(".config", "opencode", "opencode.json")],
};

function isDescendant(anchorPath: string, targetPath: string): boolean {
  const relativePath = path.relative(anchorPath, targetPath);
  return (
    relativePath.length > 0 && !relativePath.startsWith(`..${path.sep}`) && relativePath !== ".."
  );
}

function isMissingPathError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

function readPathStats(filePath: string): Stats | undefined {
  try {
    return fs.lstatSync(filePath);
  } catch (error) {
    if (isMissingPathError(error)) return undefined;
    throw error;
  }
}

function assertSafePathStats(stats: Stats, mustBeDirectory: boolean): void {
  if (stats.isSymbolicLink()) {
    throw new ConfigTargetError("Configuration path cannot contain a symbolic link.");
  }
  if (mustBeDirectory && !stats.isDirectory()) {
    throw new ConfigTargetError("Configuration path ancestor must be a directory.");
  }
  if (!mustBeDirectory && !stats.isFile()) {
    throw new ConfigTargetError("Configuration target must be a regular file.");
  }
}

function assertExistingPathIsSafe(filePath: string, mustBeDirectory: boolean): boolean {
  const stats = readPathStats(filePath);
  if (!stats) return false;
  assertSafePathStats(stats, mustBeDirectory);
  return true;
}

function assertNoSymbolicLinks(anchorPath: string, targetPath: string): void {
  if (!isDescendant(anchorPath, targetPath)) {
    throw new ConfigTargetError("Configuration target is not an authorized configuration target.");
  }

  if (!assertExistingPathIsSafe(anchorPath, true)) {
    throw new ConfigTargetError("Configuration root must be an existing directory.");
  }
  const segments = path.relative(anchorPath, targetPath).split(path.sep);
  let currentPath = anchorPath;
  for (let index = 0; index < segments.length; index += 1) {
    currentPath = path.join(currentPath, segments[index]);
    const stats = readPathStats(currentPath);
    if (!stats) return;
    assertSafePathStats(stats, index < segments.length - 1);
  }
}

function getExplicitConfigRoot(): string | undefined {
  const configuredRoot = process.env.NEXUS_CONFIG_ROOT?.trim();
  if (!configuredRoot) return undefined;

  const rootPath = path.resolve(configuredRoot);
  if (!assertExistingPathIsSafe(rootPath, true)) {
    throw new ConfigTargetError("NEXUS_CONFIG_ROOT must be an existing directory.");
  }
  return rootPath;
}

function findAuthorizedTarget(client: ConfigClient, requestedPath: string): AuthorizedConfigTarget {
  const targetPath = path.resolve(requestedPath);
  if (targetPath === defaultTargets[client]) {
    return { targetPath, anchorPath: homeDirectory };
  }

  const configRoot = getExplicitConfigRoot();
  if (configRoot) {
    for (const relativeTarget of rootRelativeTargets[client]) {
      const candidatePath = path.resolve(configRoot, relativeTarget);
      if (targetPath === candidatePath) {
        return { targetPath, anchorPath: configRoot };
      }
    }
  }

  throw new ConfigTargetError("Configuration target is not an authorized configuration target.");
}

export function prepareAuthorizedConfigTarget(client: ConfigClient, requestedPath: string): string {
  const { targetPath, anchorPath } = findAuthorizedTarget(client, requestedPath);
  assertNoSymbolicLinks(anchorPath, targetPath);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: 0o700 });
  assertNoSymbolicLinks(anchorPath, targetPath);

  return targetPath;
}
