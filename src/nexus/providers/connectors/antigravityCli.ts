/**
 * Local Antigravity CLI connector.
 */

import { execFile } from "node:child_process";
import fs from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { parseDiscoveredModels } from "./antigravityDiscovery";
import { promisify } from "node:util";

import type { ModelCapability, ModelProvider, ProviderStatus } from "../types";

const execFileAsync = promisify(execFile);

import { parseCliResponse, type CliUsage } from "./antigravityProtocol";
import { streamAntigravity } from "./antigravityStream";

export interface AntigravityCliOptions {
  readonly binaryPath?: string;
  readonly cwd?: string;
  readonly timeoutMs?: number;
}

export class AntigravityModelSelectionError extends Error {
  public readonly name = "AntigravityModelSelectionError";

  public constructor(message: string) {
    super(message);
  }
}

export class AntigravityCliConnector implements ModelProvider {
  public readonly id = "antigravity-cli";
  public readonly name = "Antigravity CLI";
  public status: ProviderStatus = "implemented";
  private readonly binaryPath: string;
  private readonly cwd?: string;
  private readonly timeoutMs: number;
  private readonly discoveredModelIds = new Set<string>();

  public constructor(options: AntigravityCliOptions = {}) {
    this.binaryPath =
      options.binaryPath ||
      process.env.ANTIGRAVITY_CLI_PATH ||
      join(homedir(), ".local", "bin", "agy");
    this.cwd = options.cwd;
    this.timeoutMs = options.timeoutMs ?? 60000;
    this.status = fs.existsSync(this.binaryPath) ? "configured" : "needs_credentials";
  }

  public getBinaryPath(): string {
    return this.binaryPath;
  }

  public async discoverModels(): Promise<ModelCapability[]> {
    this.discoveredModelIds.clear();
    if (!fs.existsSync(this.binaryPath)) return [];

    try {
      const { stdout } = await execFileAsync(this.binaryPath, ["models"], {
        timeout: 10000,
        cwd: this.cwd,
        maxBuffer: 20 * 1024 * 1024,
      });
      const models = parseDiscoveredModels(stdout);
      for (const model of models) {
        this.discoveredModelIds.add(model.id.replace(/^antigravity\//, ""));
      }
      if (models.length > 0) this.status = "configured";
      return models;
    } catch {
      return [];
    }
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    const discoveredModels = await this.discoverModels();
    const probeModel = discoveredModels[0];
    if (!probeModel) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: "No Antigravity model was discovered for the connection probe.",
      };
    }

    try {
      const { stdout } = await execFileAsync(
        this.binaryPath,
        [
          "-p",
          "ping",
          "--model",
          this.requireDiscoveredModel(probeModel.id),
          "--output-format",
          "json",
        ],
        {
          timeout: 15000,
          cwd: this.cwd,
          maxBuffer: 20 * 1024 * 1024,
        }
      );
      const data = parseCliResponse(stdout);
      const latencyMs = Date.now() - start;
      if (data.status === "SUCCESS" && typeof data.response === "string") {
        this.status = "verified_live";
        return { success: true, latencyMs };
      }
      return {
        success: false,
        latencyMs,
        error: "Antigravity CLI did not confirm the connection probe.",
      };
    } catch {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: "Antigravity CLI connection probe failed.",
      };
    }
  }

  public streamPrompt(
    prompt: string,
    model: string | undefined,
    onDelta: (text: string) => void,
    onDone: (usage: CliUsage | undefined) => void,
    onError: (error: Error) => void
  ): { abort: () => void } {
    const cleanModel = this.requireDiscoveredModel(model);
    return streamAntigravity(
      this.binaryPath,
      [
        "-p",
        prompt,
        "--model",
        cleanModel,
        "--disable-slash-commands",
        "--output-format",
        "stream-json",
      ],
      this.cwd || process.cwd(),
      this.timeoutMs,
      onDelta,
      onDone,
      onError
    );
  }

  public async executePrompt(
    prompt: string,
    model?: string,
    cwd?: string
  ): Promise<{ text: string; usage?: CliUsage }> {
    if (this.discoveredModelIds.size === 0) await this.discoverModels();
    const cleanModel = this.requireDiscoveredModel(model);
    const { stdout } = await execFileAsync(
      this.binaryPath,
      ["-p", prompt, "--model", cleanModel, "--disable-slash-commands", "--output-format", "json"],
      {
        cwd: cwd || this.cwd || process.cwd(),
        timeout: this.timeoutMs,
        maxBuffer: 20 * 1024 * 1024,
      }
    );
    const data = parseCliResponse(stdout);
    if (data.status !== "SUCCESS" || typeof data.response !== "string") {
      throw new Error("Antigravity CLI did not return a successful response.");
    }
    return { text: data.response, ...(data.usage ? { usage: data.usage } : {}) };
  }

  private requireDiscoveredModel(model?: string): string {
    const selectedModel = model?.trim();
    if (!selectedModel) {
      throw new AntigravityModelSelectionError("Select a model from the discovered catalog.");
    }

    const cleanModel = selectedModel.replace(/^antigravity\//, "");
    if (!this.discoveredModelIds.has(cleanModel)) {
      throw new AntigravityModelSelectionError(
        "Selected model is not part of the discovered catalog."
      );
    }
    return cleanModel;
  }
}
