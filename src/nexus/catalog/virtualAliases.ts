/**
 * Retired NEXUS virtual model identifiers.
 *
 * These names were once emitted by generated client configuration but were
 * never resolved by the canonical chat path. They must fail closed instead of
 * silently mapping to a static, unverified provider model.
 */

export const RETIRED_NEXUS_ALIAS_IDS = [
  "nexus/auto",
  "nexus/flash-jev",
  "flash-jev",
  "nexus/jav-flash",
  "jav-flash",
  "nexus/pro-jev",
  "pro-jev",
  "nexus/code-review",
  "nexus/review-astra",
  "nexus/review-deepseek",
  "nexus/review-pro",
  "nexus/economy",
] as const;

const retiredAliasIds = new Set<string>(RETIRED_NEXUS_ALIAS_IDS);
const PROVIDER_QUALIFIED_MODEL_ID = /^[a-z0-9][a-z0-9_-]*\/[a-z0-9][a-z0-9._:/-]*$/i;

export class NexusModelSelectionError extends Error {
  public readonly name = "NexusModelSelectionError";

  public constructor(message: string) {
    super(message);
  }
}

export function requireNexusModelSelection(modelId?: string): string {
  const selectedModel = modelId?.trim();
  if (!selectedModel) {
    throw new NexusModelSelectionError(
      "Select a discovered model ID or saved NEXUS Pair ID before generating configuration."
    );
  }

  if (retiredAliasIds.has(selectedModel)) {
    throw new NexusModelSelectionError(
      "This NEXUS virtual alias is no longer supported. Select a discovered model ID or saved NEXUS Pair ID."
    );
  }

  if (!PROVIDER_QUALIFIED_MODEL_ID.test(selectedModel)) {
    throw new NexusModelSelectionError(
      "Model selection must be a provider-qualified model ID or saved NEXUS Pair ID."
    );
  }

  return selectedModel;
}
