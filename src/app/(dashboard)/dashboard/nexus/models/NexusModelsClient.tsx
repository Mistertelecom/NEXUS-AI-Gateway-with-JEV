"use client";

import {
  AlertCircle,
  ArrowRight,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  ExternalLink,
  Eye,
  RefreshCw,
  Search,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import NexusLogo from "@/shared/components/NexusLogo";
import { deriveConfiguredProviderIdentifiers } from "../components/pairStudioModelOptions";
import {
  deriveNexusModelsCatalog,
  filterAndSortNexusModels,
  type ModelCapabilityFilter,
  type ModelModality,
  type ModelSortOption,
} from "./modelsCatalogData";

const PAGE_SIZE = 24;

const MODALITY_TABS: readonly { readonly id: "all" | ModelModality; readonly label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "chat", label: "Chat & Texto" },
  { id: "reasoning", label: "Raciocínio" },
  { id: "vision", label: "Visão" },
  { id: "embedding", label: "Embeddings" },
  { id: "image", label: "Imagem" },
  { id: "audio", label: "Áudio" },
];

function formatTokens(count: number | null): string | null {
  if (count === null || count <= 0) return null;
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M ctx`;
  }
  if (count >= 1_000) {
    return `${Math.round(count / 1_000)}k ctx`;
  }
  return `${count} ctx`;
}

type LoadState =
  | { readonly kind: "loading" }
  | { readonly kind: "loaded"; readonly modelsPayload: unknown; readonly providersPayload: unknown }
  | { readonly kind: "error"; readonly message: string };

async function requestCatalogData(signal?: AbortSignal): Promise<LoadState | null> {
  try {
    let [modelsRes, provRes] = await Promise.all([
      fetch("/api/v1/models", { signal }),
      fetch("/api/nexus/providers", { signal }),
    ]);

    if (modelsRes.status === 401 || provRes.status === 401) {
      try {
        await fetch("/api/auth/csrf", { cache: "no-store", credentials: "same-origin" });
      } catch {}
      [modelsRes, provRes] = await Promise.all([
        fetch("/api/v1/models", { signal }),
        fetch("/api/nexus/providers", { signal }),
      ]);
    }

    if (!modelsRes.ok && !provRes.ok) {
      return {
        kind: "error",
        message: "Não foi possível carregar o catálogo de modelos e provedores.",
      };
    }

    const modelsPayload = modelsRes.ok ? await modelsRes.json() : null;
    const providersPayload = provRes.ok ? await provRes.json() : null;

    return { kind: "loaded", modelsPayload, providersPayload };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    return {
      kind: "error",
      message: "Erro ao carregar dados do catálogo.",
    };
  }
}

export function NexusModelsClient() {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });

  // Filters state
  const [search, setSearch] = useState("");
  const [configuredOnly, setConfiguredOnly] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [selectedModality, setSelectedModality] = useState<"all" | ModelModality>("all");
  const [selectedCapability, setSelectedCapability] = useState<ModelCapabilityFilter>("all");
  const [sortBy, setSortBy] = useState<ModelSortOption>("name");
  const [page, setPage] = useState(1);

  // Copy-to-clipboard state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((id: string) => {
    navigator.clipboard.writeText(id).then(
      () => {
        setCopiedId(id);
        setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
      },
      () => {
        // Fallback or ignore
      }
    );
  }, []);

  const handleRefresh = useCallback(async (): Promise<void> => {
    setLoadState({ kind: "loading" });
    const nextState = await requestCatalogData();
    if (nextState !== null) setLoadState(nextState);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void requestCatalogData(controller.signal).then((nextState) => {
      if (nextState !== null && !controller.signal.aborted) {
        setLoadState(nextState);
      }
    });
    return () => controller.abort();
  }, []);

  const loading = loadState.kind === "loading";
  const error = loadState.kind === "error" ? loadState.message : null;
  const rawModelsPayload = loadState.kind === "loaded" ? loadState.modelsPayload : null;
  const rawProvidersPayload = loadState.kind === "loaded" ? loadState.providersPayload : null;

  // Derive configured provider identifiers
  const configuredProviders = useMemo(
    () => deriveConfiguredProviderIdentifiers(rawProvidersPayload),
    [rawProvidersPayload]
  );

  // Derive full catalog of models
  const allModels = useMemo(
    () => deriveNexusModelsCatalog(rawModelsPayload, configuredProviders),
    [rawModelsPayload, configuredProviders]
  );

  // Derive list of unique providers present in the catalog
  const providerOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number; configured: boolean }>();
    for (const model of allModels) {
      const existing = map.get(model.providerId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(model.providerId, {
          id: model.providerId,
          name: model.providerName,
          count: 1,
          configured: model.isConfigured,
        });
      }
    }
    return [...map.values()].sort((a, b) => {
      if (a.configured !== b.configured) return a.configured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [allModels]);

  // Counts for modality tabs
  const modalityCounts = useMemo(() => {
    const base = configuredOnly ? allModels.filter((m) => m.isConfigured) : allModels;
    const counts: Record<string, number> = {
      all: base.length,
      chat: 0,
      reasoning: 0,
      vision: 0,
      embedding: 0,
      image: 0,
      audio: 0,
    };
    for (const m of base) {
      if (counts[m.modality] !== undefined) {
        counts[m.modality] += 1;
      }
    }
    return counts;
  }, [allModels, configuredOnly]);

  // Filtered and sorted models
  const filteredModels = useMemo(
    () =>
      filterAndSortNexusModels(allModels, {
        configuredOnly,
        search,
        providerId: selectedProvider,
        modality: selectedModality,
        capability: selectedCapability,
        sortBy,
      }),
    [
      allModels,
      configuredOnly,
      search,
      selectedProvider,
      selectedModality,
      selectedCapability,
      sortBy,
    ]
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredModels.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageModels = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredModels.slice(start, start + PAGE_SIZE);
  }, [filteredModels, currentPage]);

  const configuredCount = configuredProviders.size;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12 font-sans">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <NexusLogo />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
                  Catálogo de Modelos
                </h1>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  {allModels.length} modelos
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-xs text-[var(--color-text-muted)] sm:text-sm">
                Modelos catalogados dos provedores com suporte a raciocínio, ferramentas e visão.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-main)] transition hover:bg-[var(--color-border)]/50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`}
              />
              Atualizar
            </button>
            <Link
              href="/dashboard/nexus"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-main)] transition hover:border-emerald-500/50 hover:text-emerald-400"
            >
              Estúdio de Pairs
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/dashboard/nexus/providers"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-main)] transition hover:border-emerald-500/50 hover:text-emerald-400"
            >
              Provedores
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadData()}
            className="font-medium underline hover:text-red-200"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Control / Filter Bar */}
      <section className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4">
        {/* Top search & quick toggles */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Buscar por nome do modelo, ID ou provedor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-3 text-xs text-[var(--color-text-main)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-emerald-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Configured only toggle */}
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-[var(--color-text-main)]">
            <input
              type="checkbox"
              checked={configuredOnly}
              onChange={(e) => {
                setConfiguredOnly(e.target.checked);
                setPage(1);
              }}
              className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-bg)] accent-emerald-500"
            />
            <span>Apenas provedores cadastrados</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              {configuredCount} ativos
            </span>
          </label>
        </div>

        {/* Dropdowns & Selectors */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Provider Select */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[var(--color-text-muted)]">
              Provedor
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-xs text-[var(--color-text-main)] outline-none transition focus:border-emerald-500"
            >
              <option value="all">Todos os provedores ({providerOptions.length})</option>
              {providerOptions.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name} ({prov.count}) {prov.configured ? "✓" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Capability Filter */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[var(--color-text-muted)]">
              Capacidade Especial
            </label>
            <select
              value={selectedCapability}
              onChange={(e) => {
                setSelectedCapability(e.target.value as ModelCapabilityFilter);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-xs text-[var(--color-text-main)] outline-none transition focus:border-emerald-500"
            >
              <option value="all">Todas as capacidades</option>
              <option value="thinking">Raciocínio (Thinking)</option>
              <option value="tools">Ferramentas (Tool calling)</option>
              <option value="vision">Visão (Multimodal)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[var(--color-text-muted)]">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as ModelSortOption);
                setPage(1);
              }}
              className="h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-xs text-[var(--color-text-main)] outline-none transition focus:border-emerald-500"
            >
              <option value="name">Nome (A - Z)</option>
              <option value="context">Janela de contexto (Maior primeiro)</option>
              <option value="cost-asc">Custo estimado (Menor primeiro)</option>
              <option value="cost-desc">Custo estimado (Maior primeiro)</option>
            </select>
          </div>
        </div>

        {/* Modality Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--color-border)] pt-3">
          {MODALITY_TABS.map((tab) => {
            const count = modalityCounts[tab.id] ?? 0;
            const active = selectedModality === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedModality(tab.id);
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-main)]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] ${active ? "text-emerald-300" : "text-[var(--color-text-muted)]"}`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Result Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-[var(--color-text-muted)]">
        <div>
          Mostrando{" "}
          <span className="font-medium text-[var(--color-text-main)]">{filteredModels.length}</span>{" "}
          modelos
          {configuredOnly && " de provedores cadastrados"}
          {search && ` para "${search}"`}
        </div>
        {totalPages > 1 && (
          <div>
            Página <span className="font-medium text-[var(--color-text-main)]">{currentPage}</span>{" "}
            de {totalPages}
          </div>
        )}
      </div>

      {/* Models Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4"
            />
          ))}
        </div>
      ) : pageModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/20 p-12 text-center">
          <Cpu className="h-10 w-10 text-[var(--color-text-muted)]" />
          <h3 className="mt-3 text-base font-semibold text-[var(--color-text-main)]">
            Nenhum modelo encontrado
          </h3>
          <p className="mt-1 max-w-md text-xs text-[var(--color-text-muted)]">
            {configuredOnly && configuredCount === 0
              ? "Nenhum provedor possui credenciais ativas cadastradas. Cadastre suas chaves de API na tela de Provedores para visualizar seus modelos, ou desmarque o filtro de provedores cadastrados."
              : "Tente ajustar seus filtros de busca, modalidade ou provedor."}
          </p>

          <div className="mt-5 flex items-center gap-3">
            {configuredOnly && (
              <button
                type="button"
                onClick={() => {
                  setConfiguredOnly(false);
                  setPage(1);
                }}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-main)] hover:bg-[var(--color-border)]/40"
              >
                Ver todos os modelos
              </button>
            )}
            <Link
              href="/dashboard/nexus/providers"
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
            >
              Cadastrar Provedor
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageModels.map((model) => {
            const contextText = formatTokens(model.contextLength);
            const isCopied = copiedId === model.id;

            return (
              <div
                key={model.id}
                className="group flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 transition hover:border-emerald-500/40 hover:bg-[var(--color-surface)]"
              >
                <div>
                  {/* Provider & Modality header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          model.isConfigured ? "bg-emerald-400" : "bg-neutral-600"
                        }`}
                        title={model.isConfigured ? "Provedor configurado" : "Requer chave"}
                      />
                      <span className="truncate text-xs font-medium text-[var(--color-text-muted)]">
                        {model.providerName}
                      </span>
                    </div>

                    <span className="shrink-0 rounded bg-[var(--color-bg)] px-1.5 py-0.5 text-[10px] font-medium capitalize text-[var(--color-text-muted)]">
                      {model.modality}
                    </span>
                  </div>

                  {/* Model Name */}
                  <h4
                    className="mt-2 text-sm font-semibold leading-tight text-[var(--color-text-main)] group-hover:text-emerald-300"
                    title={model.name}
                  >
                    {model.name}
                  </h4>

                  {/* Model ID with copy button */}
                  <div className="mt-1 flex items-center justify-between rounded bg-[var(--color-bg)]/80 px-2 py-1 font-mono text-[11px] text-[var(--color-text-muted)]">
                    <span className="truncate" title={model.id}>
                      {model.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(model.id)}
                      className="ml-1.5 shrink-0 text-[var(--color-text-muted)] transition hover:text-emerald-400"
                      title="Copiar ID do modelo"
                    >
                      {isCopied ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  {/* Capabilities badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {contextText && (
                      <span className="inline-flex items-center rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-main)]">
                        {contextText}
                      </span>
                    )}
                    {model.supportsThinking && (
                      <span
                        className="inline-flex items-center gap-1 rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-300"
                        title="Suporte a raciocínio / thinking"
                      >
                        <Brain className="h-2.5 w-2.5" />
                        Thinking
                      </span>
                    )}
                    {model.supportsTools && (
                      <span
                        className="inline-flex items-center gap-1 rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-300"
                        title="Suporte a ferramentas / function calling"
                      >
                        <Wrench className="h-2.5 w-2.5" />
                        Tools
                      </span>
                    )}
                    {model.supportsVision && (
                      <span
                        className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300"
                        title="Suporte a visão / multimodal"
                      >
                        <Eye className="h-2.5 w-2.5" />
                        Vision
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: pricing & actions */}
                <div className="mt-4 border-t border-[var(--color-border)]/60 pt-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="text-[var(--color-text-muted)]">
                      {model.pricing ? (
                        <span>
                          ${model.pricing.input ?? 0} / ${model.pricing.output ?? 0}
                          <span className="text-[9px] text-[var(--color-text-muted)]"> /1M</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          Sem custo tabulado
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/dashboard/nexus?leadModel=${encodeURIComponent(model.id)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
                      title="Selecionar como Lead no Estúdio de Pairs"
                    >
                      Usar em Pairs
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs font-medium text-[var(--color-text-main)] transition hover:bg-[var(--color-border)]/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </button>

          <div className="flex items-center gap-1 px-2 text-xs text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-main)]">{currentPage}</span>
            <span>/</span>
            <span>{totalPages}</span>
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs font-medium text-[var(--color-text-main)] transition hover:bg-[var(--color-border)]/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
