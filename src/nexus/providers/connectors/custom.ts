/**
 * Custom Provider Connector with SSRF Validation for NEXUS Gateway
 * Supports custom OpenAI or Anthropic compatible self-hosted or proxy endpoints
 * with strict SSRF validation blocking private networks and loopback addresses.
 */

import { ModelCapability, ModelProvider, ProviderStatus } from "../types";
import { validateOutboundUrl } from "../ssrf";

export interface CustomProviderOptions {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  protocol?: "openai" | "anthropic";
  models?: ModelCapability[];
  customHeaders?: Record<string, string>;
  allowPrivateIps?: boolean;
}

export class CustomProviderConnector implements ModelProvider {
  public id: string;
  public name: string;
  public status: ProviderStatus = "implemented";

  private baseUrl: string;
  private apiKey?: string;
  private protocol: "openai" | "anthropic";
  private configuredModels: ModelCapability[];
  private customHeaders: Record<string, string>;
  private allowPrivateIps: boolean;

  constructor(options: CustomProviderOptions) {
    this.id = options.id;
    this.name = options.name;
    this.baseUrl = (options.baseUrl || "").replace(/\/+$/, "");
    this.apiKey = options.apiKey;
    this.protocol = options.protocol || "openai";
    this.configuredModels = options.models || [];
    this.customHeaders = options.customHeaders || {};
    this.allowPrivateIps = !!options.allowPrivateIps;

    if (this.baseUrl) {
      this.status = "configured";
    } else {
      this.status = "needs_credentials";
    }
  }

  private async assertSafeUrl(targetUrl: string): Promise<void> {
    const check = await validateOutboundUrl(targetUrl, {
      allowPrivate: this.allowPrivateIps,
    });
    if (!check.valid) {
      throw new Error(`SSRF Blocked: ${check.reason} (${targetUrl})`);
    }
  }

  public async discoverModels(): Promise<ModelCapability[]> {
    if (this.configuredModels.length > 0) {
      return this.configuredModels;
    }

    try {
      const targetUrl = `${this.baseUrl}/models`;
      await this.assertSafeUrl(targetUrl);

      const res = await fetch(targetUrl, {
        headers: {
          "User-Agent": "NEXUS-Gateway/1.0",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
          ...this.customHeaders,
        },
      });

      if (!res.ok) return [];
      const data = await res.json();
      const list = data.data || data.models || [];

      return list.map((m: any) => ({
        id: `${this.id}/${m.id}`,
        name: m.name || m.id,
        contextWindow: m.context_length || 64000,
        maxOutputTokens: m.max_tokens || 4096,
        supportsStreaming: true,
        supportsTools: true,
        supportsVision: false,
        supportsReasoning: false,
      }));
    } catch {
      return [];
    }
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      const targetUrl = `${this.baseUrl}/models`;
      await this.assertSafeUrl(targetUrl);

      const res = await fetch(targetUrl, {
        headers: {
          "User-Agent": "NEXUS-Gateway/1.0",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
          ...this.customHeaders,
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
        error: `Provedor customizado retornou HTTP ${res.status}`,
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: `Falha ao testar conexão com ${this.baseUrl}: ${err.message}`,
      };
    }
  }
}
