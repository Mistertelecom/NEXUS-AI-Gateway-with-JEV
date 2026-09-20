import { z } from "zod";

import {
  buildNexusPairCombo,
  type NexusPairComboInput,
  type NexusPairDraft,
  type PairCompressionMode,
} from "@/nexus/pairs/definition";

const CatalogPricingSchema = z
  .object({
    input: z.number().nonnegative().optional(),
    output: z.number().nonnegative().optional(),
  })
  .passthrough();

const CatalogCapabilitiesSchema = z
  .object({
    supportsThinking: z.boolean().optional(),
    thinking: z.boolean().optional(),
  })
  .passthrough();

const CatalogModelSchema = z
  .object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1).optional(),
    owned_by: z.string().trim().min(1).optional(),
    pricing: CatalogPricingSchema.optional(),
    capabilities: CatalogCapabilitiesSchema.optional(),
  })
  .passthrough();

const CatalogPayloadSchema = z.object({ data: z.array(CatalogModelSchema) }).passthrough();

const ProviderSummarySchema = z
  .object({
    configured: z.number().int().nonnegative().optional(),
    ready: z.number().int().nonnegative().optional(),
    liveVerified: z.number().int().nonnegative().optional(),
  })
  .passthrough();

const JevEvidenceSchema = z
  .object({
    readiness: z.string().trim().min(1).optional(),
    verification: z.string().trim().min(1).optional(),
  })
  .passthrough();

const ProviderEvidenceSchema = z
  .object({
    totalCount: z.number().int().nonnegative().optional(),
    statusSummary: ProviderSummarySchema.optional(),
    jev: JevEvidenceSchema.optional(),
  })
  .passthrough();

type CatalogModel = z.infer<typeof CatalogModelSchema>;

export type PairStudioEvidenceState = "configured" | "observed" | "unavailable" | "unknown";

export type PairStudioModelOption = {
  readonly id: string;
  readonly label: string;
  readonly provider: string | null;
  readonly costEvidence: "observed" | "unknown";
  readonly costScore: number | null;
  readonly thinkingEvidence: "not_advertised" | "observed" | "unknown";
};

export type PairStudioModelOptions = {
  readonly leadOptions: readonly PairStudioModelOption[];
  readonly workerOptions: readonly PairStudioModelOption[];
};

export type PairStudioProviderEvidence = {
  readonly configuredCount: number | null;
  readonly liveVerifiedCount: number | null;
  readonly totalCount: number | null;
  readonly jevReadiness: string | null;
  readonly jevVerification: string | null;
};

export type PairStudioSelection = {
  readonly name: string;
  readonly leadModel: string;
  readonly workerModel: string;
  readonly compressionMode: PairCompressionMode;
  readonly jevMode: "adaptive" | "advisory" | "off";
};

const EMPTY_MODEL_OPTIONS: PairStudioModelOptions = {
  leadOptions: [],
  workerOptions: [],
};

function compareByLabel(left: PairStudioModelOption, right: PairStudioModelOption): number {
  return left.label.localeCompare(right.label) || left.id.localeCompare(right.id);
}

function compareByObservedCost(left: PairStudioModelOption, right: PairStudioModelOption): number {
  if (left.costScore === null || right.costScore === null) return compareByLabel(left, right);
  return left.costScore - right.costScore || compareByLabel(left, right);
}

function modelOptionFromCatalog(model: CatalogModel): PairStudioModelOption {
  const costScore = readObservedCost(model.pricing);
  const thinking = model.capabilities?.supportsThinking ?? model.capabilities?.thinking;

  return {
    id: model.id,
    label: model.name ? `${model.name} (${model.id})` : model.id,
    provider: model.owned_by ?? null,
    costEvidence: costScore === null ? "unknown" : "observed",
    costScore,
    thinkingEvidence:
      thinking === true ? "observed" : thinking === false ? "not_advertised" : "unknown",
  };
}

function readObservedCost(
  pricing: z.infer<typeof CatalogPricingSchema> | undefined
): number | null {
  const input = pricing?.input;
  const output = pricing?.output;
  if (input === undefined || output === undefined) return null;
  return input + output;
}

export function isModelFromConfiguredProvider(
  model: { id: string; owned_by?: string | null },
  configuredSet: ReadonlySet<string>
): boolean {
  if (configuredSet.size === 0) return false;

  if (model.owned_by) {
    const ownedBy = model.owned_by.toLowerCase().trim();
    if (configuredSet.has(ownedBy)) return true;
  }

  const slashIndex = model.id.indexOf("/");
  if (slashIndex > 0) {
    const prefix = model.id.slice(0, slashIndex).toLowerCase().trim();
    if (configuredSet.has(prefix)) return true;
  }

  return false;
}

export function deriveConfiguredProviderIdentifiers(providersPayload: unknown): Set<string> {
  const identifiers = new Set<string>();
  if (!providersPayload || typeof providersPayload !== "object") return identifiers;

  const rawProviders = (providersPayload as { providers?: unknown }).providers;
  if (!Array.isArray(rawProviders)) return identifiers;

  for (const item of rawProviders) {
    if (!item || typeof item !== "object") continue;
    const provider = item as {
      id?: unknown;
      alias?: unknown;
      status?: unknown;
      readiness?: unknown;
    };

    const isConfigured = provider.readiness !== "catalogued" && provider.status !== "requires_key";

    if (isConfigured && typeof provider.id === "string" && provider.id.trim().length > 0) {
      identifiers.add(provider.id.trim().toLowerCase());
      if (typeof provider.alias === "string" && provider.alias.trim().length > 0) {
        identifiers.add(provider.alias.trim().toLowerCase());
      }
    }
  }

  return identifiers;
}

export function derivePairStudioModelOptions(
  payload: unknown,
  configuredProviderIds?: ReadonlySet<string> | readonly string[]
): PairStudioModelOptions {
  const parsed = CatalogPayloadSchema.safeParse(payload);
  if (!parsed.success) return EMPTY_MODEL_OPTIONS;

  const configuredSet =
    configuredProviderIds !== undefined
      ? new Set([...configuredProviderIds].map((id) => id.toLowerCase().trim()))
      : null;

  const optionsById = new Map<string, PairStudioModelOption>();
  for (const model of parsed.data.data) {
    if (configuredSet !== null && !isModelFromConfiguredProvider(model, configuredSet)) {
      continue;
    }

    const option = modelOptionFromCatalog(model);
    const previous = optionsById.get(option.id);
    if (
      previous === undefined ||
      (previous.costEvidence === "unknown" && option.costEvidence === "observed")
    ) {
      optionsById.set(option.id, option);
    }
  }

  const leadOptions = [...optionsById.values()].sort(compareByLabel);
  const workerOptions = leadOptions
    .filter((option) => option.costEvidence === "observed")
    .sort(compareByObservedCost);

  return { leadOptions, workerOptions };
}

export function derivePairStudioProviderEvidence(
  payload: unknown
): PairStudioProviderEvidence | null {
  const parsed = ProviderEvidenceSchema.safeParse(payload);
  if (!parsed.success) return null;

  return {
    configuredCount: parsed.data.statusSummary
      ? (parsed.data.statusSummary.configured ?? 0) +
        (parsed.data.statusSummary.ready ?? 0) +
        (parsed.data.statusSummary.liveVerified ?? 0)
      : null,
    liveVerifiedCount: parsed.data.statusSummary?.liveVerified ?? null,
    totalCount: parsed.data.totalCount ?? null,
    jevReadiness: parsed.data.jev?.readiness ?? null,
    jevVerification: parsed.data.jev?.verification ?? null,
  };
}

export function deriveEvidenceState(
  readiness: string | null,
  verification: string | null
): PairStudioEvidenceState {
  if (verification === "verified_live") return "observed";
  if (readiness === "configured" || verification === "not_run") return "configured";
  if (readiness === "unavailable" || verification === "unavailable") return "unavailable";
  return "unknown";
}

export function isPairStudioSelectionReady(
  selection: PairStudioSelection,
  leadModels: readonly string[],
  workerModels: readonly string[]
): boolean {
  return (
    selection.name.trim().length > 0 &&
    leadModels.includes(selection.leadModel) &&
    workerModels.includes(selection.workerModel)
  );
}

export function buildPairStudioSavePayload(selection: PairStudioSelection): NexusPairComboInput {
  const draft: NexusPairDraft = {
    name: selection.name,
    leadModel: selection.leadModel,
    workerModel: selection.workerModel,
    compressionMode: selection.compressionMode,
    jevMode: selection.jevMode,
  };

  return buildNexusPairCombo(draft);
}
