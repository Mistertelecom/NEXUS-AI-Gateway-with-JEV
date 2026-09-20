import { ManagedRunner } from "./managedRunner";

export interface GitSnapshot {
  timestamp: string;
  commitSha?: string;
  branch?: string;
  diff: string;
  stat: string;
  changedFiles: string[];
  isClean: boolean;
}

function changedPaths(status: string): string[] {
  const records = status.split("\0");
  const paths: string[] = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (!record) continue;
    if (record.length < 4 || record[2] !== " ") throw new Error("Invalid Git status response.");
    paths.push(record.slice(3));
    if (/[RC]/.test(record.slice(0, 2))) {
      const original = records[++index];
      if (!original) throw new Error("Incomplete Git rename status.");
      paths.push(original);
    }
  }
  return [...new Set(paths)];
}

export class SnapshotEngine {
  public static async captureSnapshot(
    workspacePath: string,
    runner = new ManagedRunner()
  ): Promise<GitSnapshot> {
    const workspace = runner.assertWorkspaceAuthorized(workspacePath);
    const git = async (args: string[]): Promise<string> => {
      const result = await runner.executeCommand({ executable: "git", args }, workspace);
      if (result.exitCode !== 0)
        throw new Error(
          `NEXUS_SNAPSHOT_FAILED: git ${args[0]} exited ${result.exitCode}. ${result.stderr}`
        );
      return result.stdout;
    };
    const statusArgs = ["status", "--porcelain=v1", "-z", "--untracked-files=all"];
    const before = await git(statusArgs);
    const commitSha = (await git(["rev-parse", "HEAD"])).trim();
    if (!/^[a-f0-9]{40,64}$/.test(commitSha)) throw new Error("Invalid Git commit identity.");
    const branch = (await git(["branch", "--show-current"])).trim();
    const unstaged = await git(["diff", "--no-ext-diff", "--no-textconv"]);
    const staged = await git(["diff", "--cached", "--no-ext-diff", "--no-textconv"]);
    const stat = (await git(["diff", "--stat", "--no-ext-diff", "--no-textconv", "HEAD"])).trim();
    if (
      before !== (await git(statusArgs)) ||
      commitSha !== (await git(["rev-parse", "HEAD"])).trim()
    ) {
      throw new Error("NEXUS_SNAPSHOT_CHANGED: workspace changed during capture.");
    }
    const changedFiles = changedPaths(before);
    return {
      timestamp: new Date().toISOString(),
      commitSha,
      branch,
      diff: [unstaged, staged].filter(Boolean).join("\n"),
      stat,
      changedFiles,
      isClean: changedFiles.length === 0,
    };
  }
}
