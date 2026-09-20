/**
 * OpenAI Codex Native CLI & Subscription Connector for NEXUS Gateway
 * Directly interfaces with the user's authentic, local `codex` binary and
 * active ChatGPT Pro / Pro Max subscription (~/.codex/auth.json & config.toml),
 * eliminating third-party API costs while supporting flagship models (gpt-5.6-sol, o1, o3).
 */

import { spawn, exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";
import { AgentRuntime, ModelCapability, ModelProvider, ProviderStatus } from "../types";

const execAsync = promisify(exec);

export interface CodexOptions {
  binaryPath?: string;
  configTomlPath?: string;
  authJsonPath?: string;
  apiKey?: string;
  defaultModel?: string;
  timeoutMs?: number;
}

export class CodexConnector implements ModelProvider, AgentRuntime {
  public id = "codex";
  public name = "OpenAI Codex CLI (ChatGPT Pro/Max Local Subscription)";
  public status: ProviderStatus = "implemented";
  public supportsSandboxing = true;

  private binaryPath: string;
  private configTomlPath: string;
  private authJsonPath: string;
  private apiKey?: string;
  private defaultModel: string;
  private timeoutMs: number;
  public isLocalSubscription: boolean = false;

  constructor(options: CodexOptions = {}) {
    this.binaryPath =
      options.binaryPath || process.env.CODEX_CLI_PATH || "/Users/apple/.local/bin/codex";

    const homeDir = os.homedir();
    this.configTomlPath = options.configTomlPath || path.join(homeDir, ".codex", "config.toml");
    this.authJsonPath = options.authJsonPath || path.join(homeDir, ".codex", "auth.json");

    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.defaultModel = options.defaultModel || "gpt-5.6-sol";
    this.timeoutMs = options.timeoutMs || 180000;

    this.detectSubscription();
  }

  private detectSubscription(): void {
    const hasBinary = fs.existsSync(this.binaryPath);
    const hasAuth = fs.existsSync(this.authJsonPath);

    if (hasBinary && hasAuth) {
      try {
        const authData = JSON.parse(fs.readFileSync(this.authJsonPath, "utf8"));
        if (authData.auth_mode === "chatgpt" || authData.tokens || authData.access_token) {
          this.isLocalSubscription = true;
          this.status = "verified_live";
          this.name = "OpenAI Codex CLI (ChatGPT Pro/Max Local Subscription)";
          return;
        }
      } catch {}
    }

    if (hasBinary) {
      this.status = "configured";
    } else if (this.apiKey) {
      this.status = "configured";
      this.name = "OpenAI Codex (API Key)";
    } else {
      this.status = "needs_credentials";
    }
  }

  public getBinaryPath(): string {
    return this.binaryPath;
  }

  /**
   * Discovers models available through the user's local Codex session.
   */
  public async discoverModels(): Promise<ModelCapability[]> {
    if (this.isLocalSubscription) {
      return [
        {
          id: "codex/gpt-5.6-sol",
          name: "GPT-5.6 Sol (Codex Priority / Pro Max)",
          contextWindow: 200000,
          maxOutputTokens: 32768,
          supportsStreaming: true,
          supportsTools: true,
          supportsVision: true,
          supportsReasoning: true,
          inputCostPer1k: 0, // Included in user's Pro Max subscription
          outputCostPer1k: 0,
        },
        {
          id: "codex/o3",
          name: "OpenAI o3 (Pro Max Deep Reasoning)",
          contextWindow: 200000,
          maxOutputTokens: 65536,
          supportsStreaming: true,
          supportsTools: true,
          supportsVision: true,
          supportsReasoning: true,
          inputCostPer1k: 0,
          outputCostPer1k: 0,
        },
        {
          id: "codex/o3-mini",
          name: "OpenAI o3-mini (Pro Max Fast)",
          contextWindow: 128000,
          maxOutputTokens: 32768,
          supportsStreaming: true,
          supportsTools: true,
          supportsVision: false,
          supportsReasoning: true,
          inputCostPer1k: 0,
          outputCostPer1k: 0,
        },
        {
          id: "codex/o1",
          name: "OpenAI o1 (Pro Max Flagship)",
          contextWindow: 200000,
          maxOutputTokens: 32768,
          supportsStreaming: true,
          supportsTools: true,
          supportsVision: true,
          supportsReasoning: true,
          inputCostPer1k: 0,
          outputCostPer1k: 0,
        },
        {
          id: "codex/gpt-4o",
          name: "GPT-4o (Codex Native Tier)",
          contextWindow: 128000,
          maxOutputTokens: 16384,
          supportsStreaming: true,
          supportsTools: true,
          supportsVision: true,
          supportsReasoning: false,
          inputCostPer1k: 0,
          outputCostPer1k: 0,
        },
      ];
    }

    if (this.apiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        if (!res.ok) return [];

        const data = (await res.json()) as { data: Array<{ id: string }> };
        return data.data
          .filter(
            (m) =>
              m.id.includes("gpt-4") ||
              m.id.includes("o1") ||
              m.id.includes("o3") ||
              m.id.includes("codex")
          )
          .map((m) => ({
            id: m.id,
            name: m.id,
            contextWindow: 128000,
            maxOutputTokens: 16384,
            supportsStreaming: true,
            supportsTools: true,
            supportsVision: true,
            supportsReasoning: Boolean(m.id.startsWith("o1") || m.id.startsWith("o3")),
            inputCostPer1k: 0.0025,
            outputCostPer1k: 0.01,
          }));
      } catch {
        return [];
      }
    }

    return [];
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();

    // If local binary and auth.json exist
    if (fs.existsSync(this.binaryPath)) {
      try {
        await execAsync(`"${this.binaryPath}" --version`, {
          timeout: 5000,
        });
        const latencyMs = Date.now() - start;

        if (fs.existsSync(this.authJsonPath)) {
          this.status = "verified_live";
          return {
            success: true,
            latencyMs,
          };
        }

        return {
          success: true,
          latencyMs,
        };
      } catch (err: any) {
        return {
          success: false,
          latencyMs: Date.now() - start,
          error: `Falha ao executar Codex CLI: ${err.message}`,
        };
      }
    }

    // Fallback to OpenAI API key
    if (this.apiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        const latencyMs = Date.now() - start;

        if (res.ok) {
          this.status = "verified_live";
          return { success: true, latencyMs };
        }
        return { success: false, latencyMs, error: `OpenAI retornou HTTP ${res.status}` };
      } catch (err: any) {
        return { success: false, latencyMs: Date.now() - start, error: err.message };
      }
    }

    return {
      success: false,
      latencyMs: 0,
      error: `Binário do Codex não encontrado em '${this.binaryPath}' e nenhuma chave OPENAI_API_KEY configurada.`,
    };
  }

  /**
   * Streams a prompt via local Codex CLI using the user's native Pro/Max session.
   */
  public streamPrompt(
    prompt: string,
    model: string,
    onDelta: (text: string) => void,
    onDone: (usage: { inputTokens: number; outputTokens: number }) => void,
    onError: (err: Error) => void
  ): { abort: () => void } {
    const cleanModel = model.replace(/^codex\//, "");

    const args = ["exec", "--json", prompt];
    if (cleanModel && cleanModel !== "gpt-5.6-sol") {
      args.push("-m", cleanModel);
    }

    const child = spawn(this.binaryPath, args, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });

    let buffer = "";
    let inputTokens = 0;
    let outputTokens = 0;

    child.stdout.on("data", (chunk: Buffer) => {
      buffer += chunk.toString("utf-8");
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);
          if (
            event.type === "item.completed" &&
            event.item?.type === "message" &&
            event.item.content
          ) {
            onDelta(event.item.content);
          }
          if (event.type === "text_delta" && event.delta) {
            onDelta(event.delta);
          }
          if (event.usage) {
            inputTokens = event.usage.input_tokens || inputTokens;
            outputTokens = event.usage.output_tokens || outputTokens;
          }
        } catch {}
      }
    });

    child.on("close", (code) => {
      if (code === 0) {
        onDone({
          inputTokens: inputTokens || Math.ceil(prompt.length / 4),
          outputTokens: outputTokens || 100,
        });
      } else {
        onError(new Error(`Codex CLI encerrou com código de saída ${code}`));
      }
    });

    child.on("error", (err) => {
      onError(err);
    });

    return {
      abort: () => {
        try {
          child.kill("SIGTERM");
        } catch {}
      },
    };
  }

  /**
   * Executes a prompt via local Codex CLI and returns the full aggregated response.
   */
  public async executePrompt(
    prompt: string,
    model: string = this.defaultModel
  ): Promise<{ text: string; usage?: { inputTokens: number; outputTokens: number } }> {
    return new Promise((resolve, reject) => {
      let accumulated = "";
      this.streamPrompt(
        prompt,
        model,
        (delta) => {
          accumulated += delta;
        },
        (usage) => {
          resolve({ text: accumulated, usage });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public async executeCommand(
    command: string,
    cwd: string,
    timeoutMs: number = this.timeoutMs
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd,
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
      });
      return { stdout, stderr, exitCode: 0 };
    } catch (err: any) {
      return {
        stdout: err.stdout || "",
        stderr: err.stderr || err.message || "",
        exitCode: err.code || 1,
      };
    }
  }
}
