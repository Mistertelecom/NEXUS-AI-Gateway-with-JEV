/**
 * Claude Code Connector for NEXUS Gateway
 * Supports Claude Code CLI execution with official Anthropic login in runner,
 * or direct Anthropic API inference with official API keys.
 *
 * Compliance: Does not harvest, store, or proxy claude.ai consumer session tokens.
 */

import { exec } from "child_process";
import { promisify } from "util";
import { ModelCapability, ModelProvider, AgentRuntime, ProviderStatus } from "../types";

const execAsync = promisify(exec);

export interface ClaudeCodeOptions {
  binaryPath?: string;
  apiKey?: string;
  defaultModel?: string;
  timeoutMs?: number;
}

export class ClaudeCodeConnector implements ModelProvider, AgentRuntime {
  public id = "claude-code";
  public name = "Claude Code (Anthropic)";
  public status: ProviderStatus = "implemented";
  public supportsSandboxing = true;

  private binaryPath: string;
  private apiKey?: string;
  private defaultModel: string;
  private timeoutMs: number;

  constructor(options: ClaudeCodeOptions = {}) {
    this.binaryPath = options.binaryPath || process.env.CLAUDE_CODE_CLI_PATH || "claude";
    this.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
    this.defaultModel = options.defaultModel || "claude-3-7-sonnet-20250219";
    this.timeoutMs = options.timeoutMs || 120000;

    if (this.apiKey) {
      this.status = "configured";
    } else {
      // Check if CLI is available in PATH
      this.checkCliAvailability();
    }
  }

  private async checkCliAvailability(): Promise<void> {
    try {
      await execAsync(`which ${this.binaryPath}`, { timeout: 3000 });
      this.status = "configured";
    } catch {
      this.status = "needs_credentials";
    }
  }

  public async discoverModels(): Promise<ModelCapability[]> {
    return [
      {
        id: "claude-3-7-sonnet-20250219",
        name: "Claude 3.7 Sonnet (Hybrid Thinking)",
        contextWindow: 200000,
        maxOutputTokens: 64000,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: true,
        inputCostPer1k: 0.003,
        outputCostPer1k: 0.015,
      },
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
        inputCostPer1k: 0.003,
        outputCostPer1k: 0.015,
      },
      {
        id: "claude-3-5-haiku-20241022",
        name: "Claude 3.5 Haiku",
        contextWindow: 200000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: true,
        supportsReasoning: false,
        inputCostPer1k: 0.0008,
        outputCostPer1k: 0.004,
      },
    ];
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();

    // If API key is present, test via Anthropic API
    if (this.apiKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": this.apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 5,
            messages: [{ role: "user", content: "ping" }],
          }),
        });

        const latencyMs = Date.now() - start;
        if (res.ok) {
          this.status = "verified_live";
          return { success: true, latencyMs };
        }

        const errData = await res.json().catch(() => ({}));
        return {
          success: false,
          latencyMs,
          error: `Anthropic API retornou ${res.status}: ${JSON.stringify(errData)}`,
        };
      } catch (err: any) {
        return {
          success: false,
          latencyMs: Date.now() - start,
          error: `Erro ao conectar com API Anthropic: ${err.message}`,
        };
      }
    }

    // Otherwise check CLI binary
    try {
      await execAsync(`${this.binaryPath} --version`, {
        timeout: 5000,
      });
      const latencyMs = Date.now() - start;
      this.status = "verified_live";
      return { success: true, latencyMs };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: `CLI Claude Code indisponível e nenhuma chave de API configurada: ${err.message}`,
      };
    }
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
        stderr: err.stderr || err.message,
        exitCode: err.code || 1,
      };
    }
  }
}
