/**
 * OpenRouter Connector for NEXUS Gateway
 * Supports model discovery, privacy tags, and Bearer authentication.
 */

import { ModelCapability, ModelProvider, ProviderStatus } from "../types";

export class OpenRouterConnector implements ModelProvider {
  public id = "openrouter";
  public name = "OpenRouter";
  public status: ProviderStatus;
  private apiKey: string | null;

  constructor(options?: string | { apiKey?: string | null }) {
    if (typeof options === "string") {
      this.apiKey = options;
    } else if (options && typeof options === "object") {
      this.apiKey = options.apiKey || process.env.OPENROUTER_API_KEY || null;
    } else {
      this.apiKey = process.env.OPENROUTER_API_KEY || null;
    }
    this.status = this.apiKey ? "configured" : "needs_credentials";
  }

  public async discoverModels(): Promise<ModelCapability[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://nexusgateway.local",
          "X-Title": "NEXUS Gateway",
        },
      });

      if (!res.ok) {
        throw new Error(`OpenRouter discovery failed with status ${res.status}`);
      }

      const data = (await res.json()) as { data: Array<any> };
      return data.data.map((m) => ({
        id: `openrouter/${m.id}`,
        name: m.name || m.id,
        contextWindow: m.context_length || 128000,
        maxOutputTokens: m.top_provider?.max_completion_tokens || 4096,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: Boolean(m.architecture?.modality?.includes("image")),
        supportsReasoning: Boolean(m.description?.toLowerCase().includes("reasoning")),
        inputCostPer1k: Number(m.pricing?.prompt || 0) * 1000,
        outputCostPer1k: Number(m.pricing?.completion || 0) * 1000,
      }));
    } catch {
      return [];
    }
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    if (!this.apiKey) {
      return { success: false, latencyMs: 0, error: "Missing OPENROUTER_API_KEY" };
    }

    const start = Date.now();
    try {
      const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const latencyMs = Date.now() - start;
      if (res.ok) {
        this.status = "verified_live";
        return { success: true, latencyMs };
      }
      return { success: false, latencyMs, error: `Authentication rejected (status ${res.status})` };
    } catch (err: any) {
      return { success: false, latencyMs: Date.now() - start, error: err.message };
    }
  }
}
