import fs from "node:fs";
import path from "node:path";

export function isWithin(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
  );
}

export function canonicalDirectory(directory: string): string {
  if (typeof directory !== "string" || !path.isAbsolute(directory))
    throw new Error("Workspace must be an absolute directory.");
  const canonical = fs.realpathSync(directory);
  if (!fs.statSync(canonical).isDirectory()) throw new Error("Workspace must be a directory.");
  return canonical;
}

export function safeFilePath(workspace: string, relativePath: string): string {
  if (
    typeof relativePath !== "string" ||
    !relativePath ||
    relativePath.includes("\0") ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("Invalid workspace-relative file path.");
  }
  const target = path.resolve(workspace, relativePath);
  if (!isWithin(workspace, target) || target === workspace)
    throw new Error("Path escapes workspace boundary.");
  let current = workspace;
  for (const segment of path.relative(workspace, target).split(path.sep)) {
    current = path.join(current, segment);
    let stat: fs.Stats;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT")
        continue;
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error("Symbolic link violates workspace boundary.");
    if (!isWithin(workspace, fs.realpathSync(current)))
      throw new Error("Path escapes workspace boundary.");
    if (stat.isFile() && stat.nlink !== 1) throw new Error("Hard-linked files are not authorized.");
  }
  return target;
}

export function assertGitWorkspace(workspace: string): void {
  const gitDir = safeFilePath(workspace, ".git");
  if (!fs.statSync(gitDir).isDirectory())
    throw new Error("Linked Git worktrees are not authorized by this runner.");
  for (const relative of [
    ".git/commondir",
    ".git/objects/info/alternates",
    ".git/config.worktree",
  ]) {
    if (fs.existsSync(safeFilePath(workspace, relative)))
      throw new Error("External Git object/worktree paths are not authorized.");
  }
  for (const relative of [".git/objects", ".git/refs", ".git/index", ".git/config", ".git/HEAD"])
    safeFilePath(workspace, relative);
  const configPath = safeFilePath(workspace, ".git/config");
  if (fs.existsSync(configPath)) {
    if (fs.statSync(configPath).size > 65536)
      throw new Error("Git config exceeds the runner size limit.");
    const config = fs.readFileSync(configPath, "utf8");
    if (/\[\s*include(?:if)?\b|^\s*worktree\s*=/im.test(config))
      throw new Error("Git config redirects are not authorized.");
  }
}
