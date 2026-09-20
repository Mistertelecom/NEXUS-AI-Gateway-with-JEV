/**
 * OpenCode Go Connector for NEXUS Gateway
 * Communicates with OpenCode endpoints using official conventions:
 * - Header `x-opencode-session` (stable conversation ID + workspace namespace)
 * - User-Agent `NEXUS-Gateway/1.0`
 * - JSON and SSE streaming protocols
 */

import { ModelCapability, ModelProvider, ProviderStatus } from "../types";

export interface OpenCodeOptions {
  baseUrl?: string;
  apiKey?: string;
  workspaceNamespace?: string;
  defaultModel?: string;
}

export class OpenCodeConnector implements ModelProvider {
  public id = "opencode";
  public name = "OpenCode (Go Agent Engine)";
  public status: ProviderStatus = "implemented";

  private baseUrl: string;
  private apiKey?: string;
  private workspaceNamespace: string;
  private defaultModel: string;

  constructor(options: OpenCodeOptions = {}) {
    this.baseUrl = (
      options.baseUrl ||
      process.env.OPENCODE_BASE_URL ||
      "http://localhost:4096"
    ).replace(/\/+$/, "");
    this.apiKey = options.apiKey || process.env.OPENCODE_API_KEY;
    this.workspaceNamespace = options.workspaceNamespace || "default";
    this.defaultModel = options.defaultModel || "opencode/deepseek-coder";

    if (this.baseUrl) {
      this.status = "configured";
    } else {
      this.status = "needs_credentials";
    }
  }

  public getSessionHeader(conversationId: string): string {
    return `${this.workspaceNamespace}:${conversationId}`;
  }

  public async discoverModels(): Promise<ModelCapability[]> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, {
        headers: {
          "User-Agent": "NEXUS-Gateway/1.0",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
      });

      if (!res.ok) return this.getFallbackModels();

      const data = await res.json();
      const list = data.data || data.models || [];

      return list.map((m: any) => ({
        id: `opencode/${m.id}`,
        name: m.name || m.id,
        contextWindow: m.context_length || 128000,
        maxOutputTokens: m.max_tokens || 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: false,
        supportsReasoning: true,
      }));
    } catch {
      return this.getFallbackModels();
    }
  }

  private getFallbackModels(): ModelCapability[] {
    return [
      {
        id: "opencode/deepseek-coder",
        name: "OpenCode DeepSeek Coder",
        contextWindow: 128000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: false,
        supportsReasoning: true,
      },
      {
        id: "opencode/qwen-coder-32b",
        name: "OpenCode Qwen 2.5 Coder 32B",
        contextWindow: 128000,
        maxOutputTokens: 8192,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: false,
        supportsReasoning: true,
      },
    ];
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, {
        headers: {
          "User-Agent": "NEXUS-Gateway/1.0",
          "x-opencode-session": this.getSessionHeader("health-check"),
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
      });

      const latencyMs = Date.now() - start;
      if (res.ok) {
        this.status = "verified_live";
        return { success: true, latencyMs };
      }

      return {
        success: false,
        latencyMs,
        error: `OpenCode retornou status ${res.status}`,
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: `Falha ao conectar com OpenCode em ${this.baseUrl}: ${err.message}`,
      };
    }
  }

  public async chatCompletion(conversationId: string, body: any): Promise<Response> {
    return fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NEXUS-Gateway/1.0",
        "x-opencode-session": this.getSessionHeader(conversationId),
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify(body),
    });
  }
}
