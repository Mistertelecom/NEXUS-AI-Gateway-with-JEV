import { z } from "zod";

import { matchesSearch } from "@/shared/utils/turkishText";

const ModelPricingSchema = z
  .object({
    input: z.number().nonnegative().optional(),
    output: z.number().nonnegative().optional(),
  })
  .passthrough();

const ModelCapabilitiesSchema = z
  .object({
    supportsThinking: z.boolean().optional(),
    thinking: z.boolean().optional(),
    supportsTools: z.boolean().optional(),
    tools: z.boolean().optional(),
    function_calling: z.boolean().optional(),
    supportsVision: z.boolean().optional(),
    vision: z.boolean().optional(),
  })
  .passthrough();

const RawCatalogModelSchema = z
  .object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1).optional(),
    owned_by: z.string().trim().min(1).optional(),
    type: z.string().trim().min(1).optional(),
    context_length: z.number().nonnegative().optional(),
    pricing: ModelPricingSchema.optional(),
    capabilities: ModelCapabilitiesSchema.optional(),
  })
  .passthrough();

const RawCatalogPayloadSchema = z
  .object({
    data: z.array(RawCatalogModelSchema),
  })
  .passthrough();

export type ModelModality =
  "chat" | "reasoning" | "vision" | "embedding" | "image" | "audio" | "other";

export type ModelCapabilityFilter = "all" | "thinking" | "tools" | "vision";

export type ModelSortOption = "name" | "context" | "cost-asc" | "cost-desc";

export type NexusCatalogModel = {
  readonly id: string;
  readonly name: string;
  readonly providerId: string;
  readonly providerName: string;
  readonly isConfigured: boolean;
  readonly contextLength: number | null;
  readonly supportsThinking: boolean;
  readonly supportsTools: boolean;
  readonly supportsVision: boolean;
  readonly modality: ModelModality;
  readonly pricing: { readonly input?: number; readonly output?: number } | null;
  readonly costScore: number | null;
};

const PROVIDER_NAMES: Record<string, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google Gemini",
  gemini: "Google Gemini",
  deepseek: "DeepSeek",
  groq: "Groq",
  ollama: "Ollama",
  openrouter: "OpenRouter",
  together: "Together AI",
  mistral: "Mistral",
  xai: "xAI",
  grok: "xAI (Grok)",
  cohere: "Cohere",
  aws: "AWS Bedrock",
  bedrock: "AWS Bedrock",
  azure: "Azure OpenAI",
  cloudflare: "Cloudflare",
  github: "GitHub Models",
  perplexity: "Perplexity",
  cerebras: "Cerebras",
  sambanova: "SambaNova",
  fireworks: "Fireworks AI",
  ai21: "AI21 Labs",
  huggingface: "Hugging Face",
  replicate: "Replicate",
  vllm: "vLLM",
  lmstudio: "LM Studio",
  novita: "Novita AI",
  siliconflow: "SiliconFlow",
  minimax: "MiniMax",
  qwen: "Qwen (Alibaba)",
  dashscope: "Qwen (DashScope)",
  zhipu: "Zhipu AI (GLM)",
  glm: "Zhipu AI (GLM)",
  moonshot: "Moonshot AI (Kimi)",
  baichuan: "Baichuan",
  lingyi: "01.AI (Yi)",
  yi: "01.AI (Yi)",
  stepfun: "StepFun",
  internlm: "InternLM",
  codex: "Codex CLI",
  runtime: "Runtime Local",
  combo: "NEXUS Combos",
};

export function formatProviderDisplayName(providerId: string): string {
  const normalized = providerId.toLowerCase().trim();
  if (PROVIDER_NAMES[normalized]) {
    return PROVIDER_NAMES[normalized];
  }
  // Title-case fallback
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function extractProviderId(model: { id: string; owned_by?: string | null }): string {
  if (model.owned_by && model.owned_by.trim().length > 0) {
    return model.owned_by.toLowerCase().trim();
  }
  const slashIndex = model.id.indexOf("/");
  if (slashIndex > 0) {
    return model.id.slice(0, slashIndex).toLowerCase().trim();
  }
  return "other";
}

function detectModality(
  id: string,
  type: string | undefined,
  supportsThinking: boolean,
  supportsVision: boolean
): ModelModality {
  const lowerId = id.toLowerCase();
  const lowerType = type?.toLowerCase() ?? "";

  if (
    lowerType === "embedding" ||
    lowerId.includes("embed") ||
    lowerId.includes("text-embedding")
  ) {
    return "embedding";
  }
  if (
    lowerType === "image" ||
    lowerId.includes("dall-e") ||
    lowerId.includes("flux") ||
    lowerId.includes("stable-diffusion") ||
    lowerId.includes("midjourney") ||
    lowerId.includes("imagen")
  ) {
    return "image";
  }
  if (
    lowerType === "audio" ||
    lowerId.includes("whisper") ||
    lowerId.includes("tts") ||
    lowerId.includes("audio") ||
    lowerId.includes("speech")
  ) {
    return "audio";
  }
  if (supportsThinking) {
    return "reasoning";
  }
  if (supportsVision) {
    return "vision";
  }
  return "chat";
}

export function deriveNexusModelsCatalog(
  modelsPayload: unknown,
  configuredProviderIds?: ReadonlySet<string> | readonly string[]
): readonly NexusCatalogModel[] {
  const parsed = RawCatalogPayloadSchema.safeParse(modelsPayload);
  if (!parsed.success) return [];

  const configuredSet =
    configuredProviderIds !== undefined
      ? new Set([...configuredProviderIds].map((id) => id.toLowerCase().trim()))
      : new Set<string>();

  const seenIds = new Set<string>();
  const results: NexusCatalogModel[] = [];

  for (const raw of parsed.data.data) {
    if (seenIds.has(raw.id)) continue;
    seenIds.add(raw.id);

    const providerId = extractProviderId(raw);
    const isConfigured =
      configuredSet.size > 0 &&
      (configuredSet.has(providerId) ||
        (raw.owned_by && configuredSet.has(raw.owned_by.toLowerCase().trim())) ||
        configuredSet.has(raw.id.split("/")[0]?.toLowerCase().trim() ?? ""));

    const lowerId = raw.id.toLowerCase();
    const supportsThinking =
      raw.capabilities?.supportsThinking === true ||
      raw.capabilities?.thinking === true ||
      lowerId.includes("-r1") ||
      lowerId.includes("deepseek-r1") ||
      lowerId.includes("o1") ||
      lowerId.includes("o3") ||
      lowerId.includes("reasoning") ||
      lowerId.includes("thinking");

    const supportsTools =
      raw.capabilities?.supportsTools === true ||
      raw.capabilities?.tools === true ||
      raw.capabilities?.function_calling === true;

    const supportsVision =
      raw.capabilities?.supportsVision === true ||
      raw.capabilities?.vision === true ||
      lowerId.includes("vision") ||
      lowerId.includes("multimodal") ||
      lowerId.includes("-vl") ||
      lowerId.includes("claude-3") ||
      lowerId.includes("gpt-4o") ||
      lowerId.includes("gemini");

    const modality = detectModality(raw.id, raw.type, supportsThinking, supportsVision);

    const costScore =
      raw.pricing?.input !== undefined && raw.pricing?.output !== undefined
        ? raw.pricing.input + raw.pricing.output
        : null;

    results.push({
      id: raw.id,
      name: raw.name || raw.id,
      providerId,
      providerName: formatProviderDisplayName(providerId),
      isConfigured,
      contextLength: raw.context_length ?? null,
      supportsThinking,
      supportsTools,
      supportsVision,
      modality,
      pricing: raw.pricing ? { input: raw.pricing.input, output: raw.pricing.output } : null,
      costScore,
    });
  }

  return results;
}

export type FilterModelsOptions = {
  readonly configuredOnly?: boolean;
  readonly search?: string;
  readonly providerId?: string;
  readonly modality?: "all" | ModelModality;
  readonly capability?: ModelCapabilityFilter;
  readonly sortBy?: ModelSortOption;
};

export function filterAndSortNexusModels(
  models: readonly NexusCatalogModel[],
  options: FilterModelsOptions
): readonly NexusCatalogModel[] {
  const {
    configuredOnly = false,
    search = "",
    providerId = "all",
    modality = "all",
    capability = "all",
    sortBy = "name",
  } = options;

  const searchNormalized = search.trim().toLowerCase();

  const filtered = models.filter((model) => {
    if (configuredOnly && !model.isConfigured) {
      return false;
    }

    if (providerId !== "all" && model.providerId !== providerId.toLowerCase().trim()) {
      return false;
    }

    if (modality !== "all" && model.modality !== modality) {
      return false;
    }

    if (capability === "thinking" && !model.supportsThinking) {
      return false;
    }
    if (capability === "tools" && !model.supportsTools) {
      return false;
    }
    if (capability === "vision" && !model.supportsVision) {
      return false;
    }

    if (searchNormalized.length > 0) {
      const matchId = matchesSearch(model.id, searchNormalized);
      const matchName = matchesSearch(model.name, searchNormalized);
      const matchProvider = matchesSearch(model.providerName, searchNormalized);
      if (!matchId && !matchName && !matchProvider) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((left, right) => {
    if (sortBy === "name") {
      return left.name.localeCompare(right.name) || left.id.localeCompare(right.id);
    }
    if (sortBy === "context") {
      const leftCtx = left.contextLength ?? -1;
      const rightCtx = right.contextLength ?? -1;
      return rightCtx - leftCtx || left.name.localeCompare(right.name);
    }
    if (sortBy === "cost-asc") {
      if (left.costScore === null && right.costScore === null) {
        return left.name.localeCompare(right.name);
      }
      if (left.costScore === null) return 1;
      if (right.costScore === null) return -1;
      return left.costScore - right.costScore || left.name.localeCompare(right.name);
    }
    if (sortBy === "cost-desc") {
      if (left.costScore === null && right.costScore === null) {
        return left.name.localeCompare(right.name);
      }
      if (left.costScore === null) return 1;
      if (right.costScore === null) return -1;
      return right.costScore - left.costScore || left.name.localeCompare(right.name);
    }
    return 0;
  });
}
