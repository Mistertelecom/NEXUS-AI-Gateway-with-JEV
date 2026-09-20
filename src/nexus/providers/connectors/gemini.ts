/**
 * Google Gemini Official API Connector for NEXUS Gateway
 * Uses official API key via Google AI Studio / Vertex AI.
 */

import { ModelCapability, ModelProvider, ProviderStatus } from "../types";

export class GeminiConnector implements ModelProvider {
  public id = "gemini";
  public name = "Google Gemini Official API";
  public status: ProviderStatus;
  private apiKey: string | null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || null;
    this.status = this.apiKey ? "configured" : "needs_credentials";
  }

  public async discoverModels(): Promise<ModelCapability[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const data = (await res.json()) as { models: Array<any> };
      return data.models
        .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m) => {
          const rawId = m.name?.replace(/^models\//, "");
          return {
            id: rawId,
            name: m.displayName || rawId,
            contextWindow: m.inputTokenLimit || 1048576,
            maxOutputTokens: m.outputTokenLimit || 8192,
            supportsStreaming: true,
            supportsTools: true,
            supportsVision: Boolean(rawId.includes("flash") || rawId.includes("pro")),
            supportsReasoning: Boolean(rawId.includes("thinking") || rawId.includes("pro")),
            inputCostPer1k: rawId.includes("flash") ? 0.00015 : 0.00125,
            outputCostPer1k: rawId.includes("flash") ? 0.0006 : 0.005,
          };
        });
    } catch {
      return [];
    }
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    if (!this.apiKey) {
      return { success: false, latencyMs: 0, error: "Missing GEMINI_API_KEY" };
    }

    const start = Date.now();
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
      const res = await fetch(url);
      const latencyMs = Date.now() - start;

      if (res.ok) {
        this.status = "verified_live";
        return { success: true, latencyMs };
      }
      return { success: false, latencyMs, error: `Google API rejected with status ${res.status}` };
    } catch (err: any) {
      return { success: false, latencyMs: Date.now() - start, error: err.message };
    }
  }
}
