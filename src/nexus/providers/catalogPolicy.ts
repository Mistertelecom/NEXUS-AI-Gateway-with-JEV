interface ProviderRoute {
  readonly connectorId: string;
  readonly isLocalAgy: boolean;
}

export const PROVIDER_ROUTES: Readonly<Record<string, ProviderRoute>> = {
  antigravity: { connectorId: "antigravity-cli", isLocalAgy: true },
  "claude-code": { connectorId: "claude-code", isLocalAgy: false },
  claude: { connectorId: "claude-code", isLocalAgy: false },
  codex: { connectorId: "codex", isLocalAgy: false },
  gemini: { connectorId: "gemini", isLocalAgy: false },
  opencode: { connectorId: "opencode", isLocalAgy: false },
  openrouter: { connectorId: "openrouter", isLocalAgy: false },
};

export class ProviderRoutingError extends Error {
  public readonly name = "ProviderRoutingError";

  public constructor(message: string) {
    super(message);
  }
}

export type ProviderCatalogReadiness =
  "catalogued" | "configured" | "ready" | "live_verified" | "unavailable";

export type ProviderCatalogVerification =
  "not_configured" | "not_run" | "binary_present" | "verified_live" | "unavailable";

export interface ProviderReadinessInput {
  hasConfiguredConnection: boolean;
  hasEnvironmentKey: boolean;
  isLiveVerified: boolean;
  localBinaryAvailable: boolean;
  requiresLocalBinary: boolean;
}

export interface ProviderReadiness {
  status: "active" | "configured" | "ready" | "requires_key";
  readiness: ProviderCatalogReadiness;
  verification: ProviderCatalogVerification;
  statusSummary: string;
}

/**
 * Maps evidence already available to the catalog into a compatibility status.
 * "active" is reserved for a persisted successful connection verification.
 */
export function deriveProviderReadiness(input: ProviderReadinessInput): ProviderReadiness {
  if (input.requiresLocalBinary && !input.localBinaryAvailable) {
    return {
      status: "requires_key",
      readiness: "unavailable",
      verification: "unavailable",
      statusSummary: "Catalogued local provider; required local binary is unavailable.",
    };
  }

  if (input.isLiveVerified) {
    return {
      status: "active",
      readiness: "live_verified",
      verification: "verified_live",
      statusSummary: "Configured provider with a persisted successful connection verification.",
    };
  }

  if (input.requiresLocalBinary && input.localBinaryAvailable) {
    return {
      status: "ready",
      readiness: "ready",
      verification: "binary_present",
      statusSummary: "Local binary is present; no live provider verification is recorded.",
    };
  }

  if (input.hasConfiguredConnection || input.hasEnvironmentKey) {
    return {
      status: "configured",
      readiness: "configured",
      verification: "not_run",
      statusSummary: "Configuration detected; live provider verification has not run.",
    };
  }

  return {
    status: "requires_key",
    readiness: "catalogued",
    verification: "not_configured",
    statusSummary: "Catalogued provider; no configuration or live verification detected.",
  };
}
