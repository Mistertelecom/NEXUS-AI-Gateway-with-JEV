import fs from "node:fs";
import type { ModelProvider } from "./types";
import { AntigravityCliConnector } from "./connectors/antigravityCli";
import {
  AI_PROVIDERS,
  LOCAL_PROVIDERS,
  OAUTH_PROVIDERS,
  APIKEY_PROVIDERS,
  SEARCH_PROVIDERS,
  AUDIO_ONLY_PROVIDERS,
  NOAUTH_PROVIDERS,
} from "@/shared/constants/providers";
import { getProviderConnections } from "@/lib/db/providers";
import {
  deriveProviderReadiness,
  type ProviderCatalogReadiness,
  type ProviderCatalogVerification,
} from "./catalogPolicy";

export async function getProvidersCatalog(connectors: ReadonlyMap<string, ModelProvider>): Promise<
  Array<{
    id: string;
    name: string;
    alias?: string;
    category: "local" | "oauth" | "apikey" | "search" | "audio" | "noauth" | "other";
    status: "active" | "configured" | "ready" | "requires_key";
    readiness: ProviderCatalogReadiness;
    verification: ProviderCatalogVerification;
    statusSummary: string;
    icon?: string;
    color?: string;
    textIcon?: string;
    website?: string;
    serviceKinds?: string[];
    isVip?: boolean;
  }>
> {
  const connections = await getProviderConnections();
  const configuredIds = new Set(connections.map((connection) => connection.provider));
  const liveVerifiedIds = new Set(
    connections
      .filter(
        (connection) =>
          connection.isActive !== false &&
          (connection.testStatus === "active" || connection.testStatus === "success")
      )
      .map((connection) => connection.provider)
  );
  const agyCli = connectors.get("antigravity-cli");
  const antigravityBinaryAvailable =
    agyCli instanceof AntigravityCliConnector && fs.existsSync(agyCli.getBinaryPath());

  const checkHasEnvKey = (id: string) => {
    const envKey = `${id.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_API_KEY`;
    return Boolean(process.env[envKey]);
  };

  const catalog = Object.entries(AI_PROVIDERS).map(([id, provider]: [string, any]) => {
    let category: "local" | "oauth" | "apikey" | "search" | "audio" | "noauth" | "other" = "other";
    if (LOCAL_PROVIDERS[id]) category = "local";
    else if (OAUTH_PROVIDERS[id]) category = "oauth";
    else if (SEARCH_PROVIDERS[id]) category = "search";
    else if (AUDIO_ONLY_PROVIDERS[id]) category = "audio";
    else if (NOAUTH_PROVIDERS[id]) category = "noauth";
    else if (APIKEY_PROVIDERS[id]) category = "apikey";

    const readiness = deriveProviderReadiness({
      hasConfiguredConnection: configuredIds.has(id),
      hasEnvironmentKey: checkHasEnvKey(id),
      isLiveVerified: liveVerifiedIds.has(id),
      localBinaryAvailable: antigravityBinaryAvailable,
      requiresLocalBinary: id === "antigravity-cli",
    });
    const isVip =
      id === "antigravity-cli" ||
      id === "codex" ||
      id === "openrouter" ||
      id === "gemini" ||
      id === "deepseek" ||
      id === "anthropic" ||
      id === "openai";

    return {
      id,
      name: provider.name || id,
      alias: provider.alias,
      category,
      ...readiness,
      icon: provider.icon || "hub",
      color: provider.color || "#ffffff",
      textIcon: provider.textIcon,
      website: provider.website,
      serviceKinds: provider.serviceKinds || ["llm"],
      isVip,
    };
  });

  if (!catalog.some((provider) => provider.id === "antigravity-cli")) {
    const readiness = deriveProviderReadiness({
      hasConfiguredConnection: configuredIds.has("antigravity-cli"),
      hasEnvironmentKey: checkHasEnvKey("antigravity-cli"),
      isLiveVerified: liveVerifiedIds.has("antigravity-cli"),
      localBinaryAvailable: antigravityBinaryAvailable,
      requiresLocalBinary: true,
    });

    catalog.unshift({
      id: "antigravity-cli",
      name: "Antigravity CLI",
      alias: "agy",
      category: "local",
      ...readiness,
      icon: "terminal",
      color: "#10b981",
      textIcon: "AGY",
      website: "https://antigravity.google",
      serviceKinds: ["llm", "code"],
      isVip: true,
    });
  }

  return catalog;
}
