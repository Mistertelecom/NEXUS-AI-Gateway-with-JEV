/**
 * Antigravity Compliance Notice & Restricted Connector
 * Explicitly records the third-party access restriction per official Terms of Service.
 * Does not implement deceptive OAuth wrappers or bypass mechanisms.
 */

import { ModelCapability, ModelProvider, ProviderStatus } from "../types";

export class AntigravityRestrictedConnector implements ModelProvider {
  public id = "antigravity";
  public name = "Google AI Pro / Antigravity (Restricted)";
  public status: ProviderStatus = "restricted";
  public legalNotice: string;

  constructor() {
    this.legalNotice =
      "Os Termos de Serviço da plataforma Antigravity (Google) proíbem explicitamente o acesso automatizado, " +
      "a intermediação ou a utilização de suas credenciais por softwares de terceiros. Para operar em conformidade " +
      "e segurança, o NEXUS Gateway não disponibiliza fluxos de login OAuth não autorizados para este serviço. " +
      "Utilize o conector oficial 'Google Gemini API' com chave de API via Google AI Studio / Vertex AI.";
  }

  public async discoverModels(): Promise<ModelCapability[]> {
    // Return empty list as third-party API usage is legally prohibited
    return [];
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    return {
      success: false,
      latencyMs: 0,
      error: `Conector Restrito por Conformidade: ${this.legalNotice}`,
    };
  }
}

export { AntigravityRestrictedConnector as AntigravityConnector };
