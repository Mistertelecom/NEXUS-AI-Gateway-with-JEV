/**
 * Provider Manager for NEXUS Gateway
 * Central orchestrator for all model providers and agent runtimes.
 * Manages discovery, credential encryption, health testing, and intelligent routing.
 *
 */

import { ModelCapability, ModelProvider } from "./types";
import { AntigravityCliConnector } from "./connectors/antigravityCli";
import { GeminiConnector } from "./connectors/gemini";
import { OpenRouterConnector } from "./connectors/openrouter";
import { AntigravityConnector } from "./connectors/antigravity";
import { CodexConnector } from "./connectors/codex";
import { ClaudeCodeConnector } from "./connectors/claudecode";
import { OpenCodeConnector } from "./connectors/opencode";
import { requireNexusModelSelection } from "../catalog/virtualAliases";
import { Vault } from "./vault";

import { PROVIDER_ROUTES, ProviderRoutingError } from "./catalogPolicy";
import { getProvidersCatalog } from "./catalog";
export { ProviderRoutingError, deriveProviderReadiness } from "./catalogPolicy";
export type {
  ProviderCatalogReadiness,
  ProviderCatalogVerification,
  ProviderReadinessInput,
  ProviderReadiness,
} from "./catalogPolicy";

export class ProviderManager {
  private static instance: ProviderManager;
  private connectors: Map<string, ModelProvider> = new Map();
  private vault: Vault;

  private constructor() {
    this.vault = Vault.getInstance();
    this.initializeConnectors();
  }

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  private initializeConnectors(): void {
    // 1. Antigravity CLI (operator-configured local CLI)
    const agyCli = new AntigravityCliConnector();
    this.connectors.set("antigravity-cli", agyCli);

    // 2. OpenRouter
    const openRouterKey = this.getSecret("OPENROUTER_API_KEY");
    this.connectors.set("openrouter", new OpenRouterConnector({ apiKey: openRouterKey }));

    // 3. Gemini Official API (Fallback)
    const geminiKey = this.getSecret("GEMINI_API_KEY");
    this.connectors.set("gemini", new GeminiConnector(geminiKey));

    // 4. Antigravity Contract Restriction Notice
    this.connectors.set("antigravity", new AntigravityConnector());

    // 5. Codex Connector
    const openaiKey = this.getSecret("OPENAI_API_KEY");
    this.connectors.set("codex", new CodexConnector({ apiKey: openaiKey }));

    // 6. Claude Code Connector
    const anthropicKey = this.getSecret("ANTHROPIC_API_KEY");
    this.connectors.set("claude-code", new ClaudeCodeConnector({ apiKey: anthropicKey }));

    // 7. OpenCode Go Engine
    const opencodeKey = this.getSecret("OPENCODE_API_KEY");
    const opencodeUrl = process.env.OPENCODE_BASE_URL;
    this.connectors.set(
      "opencode",
      new OpenCodeConnector({ baseUrl: opencodeUrl, apiKey: opencodeKey })
    );
  }

  private getSecret(name: string): string | undefined {
    return process.env[name];
  }

  public getConnector(id: string): ModelProvider | undefined {
    return this.connectors.get(id);
  }

  public getAllConnectors(): ModelProvider[] {
    return Array.from(this.connectors.values());
  }

  /**
   * Returns catalog metadata plus configuration and verification evidence.
   */
  public getAllProvidersCatalog() {
    return getProvidersCatalog(this.connectors);
  }

  /**
   * Discovers only models reported by active connectors.
   */
  public async listAllModels(): Promise<ModelCapability[]> {
    const allModels: ModelCapability[] = [];

    // Discover models from active connectors
    const discoveryPromises = Array.from(this.connectors.values()).map(async (connector) => {
      try {
        return await connector.discoverModels();
      } catch {
        return [];
      }
    });

    const results = await Promise.all(discoveryPromises);
    for (const models of results) {
      allModels.push(...models);
    }

    return allModels;
  }

  /**
   * Resolves an explicitly provider-qualified model to its matching connector.
   */
  public resolveRouting(modelId: string): {
    connector: ModelProvider;
    targetModel: string;
    isLocalAgy: boolean;
  } {
    const selectedModel = requireNexusModelSelection(modelId);
    const separatorIndex = selectedModel.indexOf("/");
    const providerId = selectedModel.slice(0, separatorIndex);
    const targetModel = selectedModel.slice(separatorIndex + 1);
    const providerRoute = PROVIDER_ROUTES[providerId];
    if (!providerRoute) {
      throw new ProviderRoutingError(
        "The requested model is not supported by this provider manager."
      );
    }

    const connector = this.connectors.get(providerRoute.connectorId);
    if (!connector) {
      throw new ProviderRoutingError("The requested provider connector is unavailable.");
    }

    return {
      connector,
      targetModel,
      isLocalAgy: providerRoute.isLocalAgy,
    };
  }

  /**
   * Health-tests all configured connectors and reports status.
   */
  public async testAllConnections(): Promise<
    Record<string, { success: boolean; latencyMs: number; error?: string }>
  > {
    const results: Record<string, { success: boolean; latencyMs: number; error?: string }> = {};

    for (const [id, connector] of this.connectors.entries()) {
      const started = Date.now();
      try {
        results[id] = await connector.testConnection();
      } catch (err: unknown) {
        results[id] = {
          success: false,
          latencyMs: Date.now() - started,
          error: err instanceof Error ? err.message : "Provider connection test failed.",
        };
      }
    }

    return results;
  }
}
