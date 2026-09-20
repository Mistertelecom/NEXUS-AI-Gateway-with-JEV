import {
  AI_PROVIDERS,
  APIKEY_PROVIDERS,
  AUDIO_ONLY_PROVIDERS,
  LOCAL_PROVIDERS,
  NOAUTH_PROVIDERS,
  OAUTH_PROVIDERS,
  SEARCH_PROVIDERS,
} from "@/shared/constants/providers";
import { ProviderSchema } from "@/shared/validation/providerSchema";

export const NEXUS_PROVIDER_CATEGORIES = [
  "all",
  "local",
  "oauth",
  "apikey",
  "search",
  "audio",
  "noauth",
  "other",
] as const;

export type NexusProviderCategory = Exclude<(typeof NEXUS_PROVIDER_CATEGORIES)[number], "all">;

export type NexusProviderReadiness = "catalogued" | "configured" | "ready" | "live_verified";

export type NexusProviderVerification = "not_configured" | "not_run" | "verified_live";

export type NexusProviderStatus = "active" | "configured" | "ready" | "requires_key";

export type ProviderConnectionEvidence = {
  readonly id: string;
  readonly provider: string;
  readonly isActive: boolean;
  readonly testStatus: string | null;
};

export type NexusProviderCatalogItem = {
  readonly id: string;
  readonly name: string;
  readonly alias?: string;
  readonly category: NexusProviderCategory;
  readonly status: NexusProviderStatus;
  readonly readiness: NexusProviderReadiness;
  readonly verification: NexusProviderVerification;
  readonly statusSummary: string;
  readonly icon: string;
  readonly color: string;
  readonly textIcon?: string;
  readonly website?: string;
  readonly serviceKinds: readonly string[];
};

export type NexusProviderCatalogSnapshot = {
  readonly totalCount: number;
  readonly activeCount: number;
  readonly categoryCounts: {
    readonly all: number;
    readonly local: number;
    readonly oauth: number;
    readonly apikey: number;
    readonly search: number;
    readonly audio: number;
    readonly noauth: number;
    readonly other: number;
  };
  readonly statusSummary: {
    readonly catalogued: number;
    readonly configured: number;
    readonly ready: number;
    readonly liveVerified: number;
    readonly unavailable: number;
  };
  readonly providers: readonly NexusProviderCatalogItem[];
};

export type ProviderTestConnectionSelection =
  | { readonly kind: "selected"; readonly connectionId: string }
  | { readonly kind: "not_configured" }
  | { readonly kind: "not_found" }
  | { readonly kind: "ambiguous"; readonly connectionIds: readonly string[] };

type ProviderReadiness = {
  readonly status: NexusProviderStatus;
  readonly readiness: NexusProviderReadiness;
  readonly verification: NexusProviderVerification;
  readonly statusSummary: string;
};

function getProviderCategory(providerId: string): NexusProviderCategory {
  if (Object.hasOwn(LOCAL_PROVIDERS, providerId)) return "local";
  if (Object.hasOwn(OAUTH_PROVIDERS, providerId)) return "oauth";
  if (Object.hasOwn(SEARCH_PROVIDERS, providerId)) return "search";
  if (Object.hasOwn(AUDIO_ONLY_PROVIDERS, providerId)) return "audio";
  if (Object.hasOwn(NOAUTH_PROVIDERS, providerId)) return "noauth";
  if (Object.hasOwn(APIKEY_PROVIDERS, providerId)) return "apikey";
  return "other";
}

function getText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function deriveProviderReadiness(
  connections: readonly ProviderConnectionEvidence[]
): ProviderReadiness {
  if (connections.length === 0) {
    return {
      status: "requires_key",
      readiness: "catalogued",
      verification: "not_configured",
      statusSummary: "Catalogued provider with no persisted connection.",
    };
  }

  const hasLiveVerifiedConnection = connections.some(
    (connection) =>
      connection.isActive &&
      (connection.testStatus === "active" || connection.testStatus === "success")
  );
  if (hasLiveVerifiedConnection) {
    return {
      status: "active",
      readiness: "live_verified",
      verification: "verified_live",
      statusSummary: "An active connection has a persisted successful verification.",
    };
  }

  if (connections.some((connection) => connection.isActive)) {
    return {
      status: "ready",
      readiness: "ready",
      verification: "not_run",
      statusSummary:
        "An active connection is configured without a persisted successful verification.",
    };
  }

  return {
    status: "configured",
    readiness: "configured",
    verification: "not_run",
    statusSummary: "A connection is persisted but none is active.",
  };
}

export function providerConnectionEvidenceFromRecords(
  records: readonly Record<string, unknown>[]
): readonly ProviderConnectionEvidence[] {
  const evidence: ProviderConnectionEvidence[] = [];

  for (const record of records) {
    const id = getText(record["id"]);
    const provider = getText(record["provider"]);
    if (!id || !provider) continue;
    evidence.push({
      id,
      provider,
      isActive: record["isActive"] === true,
      testStatus: getText(record["testStatus"]),
    });
  }

  return evidence;
}

export function buildNexusProviderCatalogSnapshot(
  connections: readonly ProviderConnectionEvidence[]
): NexusProviderCatalogSnapshot {
  const connectionsByProvider = new Map<string, ProviderConnectionEvidence[]>();
  for (const connection of connections) {
    const existing = connectionsByProvider.get(connection.provider);
    if (existing) {
      existing.push(connection);
    } else {
      connectionsByProvider.set(connection.provider, [connection]);
    }
  }

  const providers: NexusProviderCatalogItem[] = [];
  for (const providerId of Object.keys(AI_PROVIDERS)) {
    const parsedProvider = ProviderSchema.safeParse(AI_PROVIDERS[providerId]);
    if (!parsedProvider.success) continue;

    const provider = parsedProvider.data;
    const readiness = deriveProviderReadiness(connectionsByProvider.get(provider.id) ?? []);
    providers.push({
      id: provider.id,
      name: provider.name,
      alias: provider.alias,
      category: getProviderCategory(provider.id),
      ...readiness,
      icon: provider.icon,
      color: provider.color,
      textIcon: provider.textIcon,
      website: provider.website,
      serviceKinds: provider.serviceKinds,
    });
  }

  const categoryCounts = {
    all: providers.length,
    local: 0,
    oauth: 0,
    apikey: 0,
    search: 0,
    audio: 0,
    noauth: 0,
    other: 0,
  };
  const statusSummary = {
    catalogued: 0,
    configured: 0,
    ready: 0,
    liveVerified: 0,
    unavailable: 0,
  };

  for (const provider of providers) {
    categoryCounts[provider.category] += 1;
    if (provider.readiness === "catalogued") statusSummary.catalogued += 1;
    else if (provider.readiness === "configured") statusSummary.configured += 1;
    else if (provider.readiness === "ready") statusSummary.ready += 1;
    else statusSummary.liveVerified += 1;
  }

  return {
    totalCount: providers.length,
    activeCount: statusSummary.liveVerified,
    categoryCounts,
    statusSummary,
    providers,
  };
}

export function selectProviderTestConnection(
  connections: readonly ProviderConnectionEvidence[],
  requestedConnectionId?: string
): ProviderTestConnectionSelection {
  if (requestedConnectionId) {
    return connections.some((connection) => connection.id === requestedConnectionId)
      ? { kind: "selected", connectionId: requestedConnectionId }
      : { kind: "not_found" };
  }

  if (connections.length === 0) return { kind: "not_configured" };
  if (connections.length === 1) return { kind: "selected", connectionId: connections[0].id };
  return { kind: "ambiguous", connectionIds: connections.map((connection) => connection.id) };
}
