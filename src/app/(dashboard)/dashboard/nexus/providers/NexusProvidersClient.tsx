"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import NexusLogo from "@/shared/components/NexusLogo";

import { ProviderEvidenceSummary } from "./ProviderEvidenceSummary";
import { ProviderMatrix } from "./ProviderMatrix";
import {
  deriveProviderCatalog,
  type ProviderCatalog,
  type ProviderCategory,
} from "./providerCatalog";

type CategoryFilter = ProviderCategory | "all";
type LoadState =
  | { readonly kind: "loading" }
  | { readonly kind: "loaded"; readonly catalog: ProviderCatalog }
  | { readonly kind: "error"; readonly message: string };

const PAGE_SIZE = 24;

const CATEGORY_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "local", label: "Locais" },
  { value: "oauth", label: "OAuth" },
  { value: "apikey", label: "Chave API" },
  { value: "noauth", label: "Sem autenticação" },
  { value: "search", label: "Pesquisa" },
  { value: "audio", label: "Áudio" },
  { value: "other", label: "Outros" },
] as const satisfies readonly { readonly value: CategoryFilter; readonly label: string }[];

function createCategoryCounts(catalog: ProviderCatalog | null): Record<CategoryFilter, number> {
  const counts: Record<CategoryFilter, number> = {
    all: catalog?.providers.length ?? 0,
    apikey: 0,
    audio: 0,
    local: 0,
    noauth: 0,
    oauth: 0,
    other: 0,
    search: 0,
  };

  for (const provider of catalog?.providers ?? []) {
    counts[provider.category] += 1;
  }

  return counts;
}

async function requestProviderCatalog(signal?: AbortSignal): Promise<LoadState | null> {
  try {
    let response = await fetch("/api/nexus/providers", { signal });
    if (response.status === 401) {
      try {
        await fetch("/api/auth/csrf", { cache: "no-store", credentials: "same-origin" });
      } catch {}
      response = await fetch("/api/nexus/providers", { signal });
    }

    if (!response.ok) {
      return {
        kind: "error",
        message:
          response.status === 401
            ? "Autenticação necessária. Verifique a sessão do dashboard para acessar o catálogo."
            : "O catálogo de providers não respondeu. Tente atualizar a leitura.",
      };
    }

    const payload: unknown = await response.json();
    const catalog = deriveProviderCatalog(payload);
    if (catalog === null) {
      return {
        kind: "error",
        message: "A resposta do catálogo não trouxe a evidência necessária para esta matriz.",
      };
    }

    return { kind: "loaded", catalog };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    return {
      kind: "error",
      message: "Não foi possível carregar a evidência de providers. Tente novamente.",
    };
  }
}

export function NexusProvidersClient() {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadCatalog = useCallback(async (): Promise<void> => {
    setLoadState({ kind: "loading" });
    const nextState = await requestProviderCatalog();
    if (nextState !== null) setLoadState(nextState);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void requestProviderCatalog(controller.signal).then((nextState) => {
      if (nextState !== null && !controller.signal.aborted) setLoadState(nextState);
    });
    return () => controller.abort();
  }, []);

  const catalog = loadState.kind === "loaded" ? loadState.catalog : null;
  const categoryCounts = useMemo(() => createCategoryCounts(catalog), [catalog]);
  const filteredProviders = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const providers = catalog?.providers ?? [];

    return providers.filter((provider) => {
      if (selectedCategory !== "all" && provider.category !== selectedCategory) return false;
      if (query.length === 0) return true;
      return (
        provider.name.toLocaleLowerCase().includes(query) ||
        provider.id.toLocaleLowerCase().includes(query) ||
        provider.alias?.toLocaleLowerCase().includes(query) === true ||
        provider.serviceKinds?.some((kind) => kind.toLocaleLowerCase().includes(query)) === true
      );
    });
  }, [catalog, searchQuery, selectedCategory]);
  const displayedProviders = filteredProviders.slice(0, visibleCount);
  const isLoading = loadState.kind === "loading";

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12" aria-busy={isLoading}>
      <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between font-sans">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <NexusLogo size={28} className="text-[var(--color-text-main)]" />
            <h1 className="text-2xl font-semibold text-[var(--color-text-main)] tracking-tight sm:text-3xl">
              Provedores
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Catálogo e evidência de prontidão de provedores e modelos conectados ao gateway.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadCatalog()}
          disabled={isLoading}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-main)] hover:bg-[var(--color-surface)]/80 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Atualizando catálogo" : "Atualizar catálogo"}
        </button>
      </header>

      {loadState.kind === "loading" && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-6 font-sans">
          <p className="text-xs text-[var(--color-text-muted)]">
            Carregando evidência do catálogo...
          </p>
        </section>
      )}

      {loadState.kind === "error" && (
        <section
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 font-sans"
        >
          <h2 className="text-base font-semibold text-[var(--color-text-main)]">
            Leitura indisponível
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
            {loadState.message}
          </p>
          <button
            type="button"
            onClick={() => void loadCatalog()}
            className="mt-4 h-9 rounded-lg border border-red-500/30 px-3.5 text-xs font-medium text-[var(--color-text-main)] transition hover:bg-red-500/10 cursor-pointer"
          >
            Tentar novamente
          </button>
        </section>
      )}

      {catalog && (
        <>
          <ProviderEvidenceSummary jev={catalog.jev} summary={catalog.summary} />

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4 sm:p-5 font-sans">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <label className="block min-w-0 lg:max-w-md lg:flex-1">
                <span className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                  Buscar provedor
                </span>
                <input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder="Nome, ID, alias ou capacidade"
                  className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand-accent)] focus:ring-1 focus:ring-[var(--color-brand-accent)]/30"
                />
              </label>
              <p className="text-xs text-[var(--color-text-muted)]">
                {filteredProviders.length} de {catalog.summary.totalCount} retornados
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4">
              {CATEGORY_FILTERS.map((filter) => {
                const selected = selectedCategory === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(filter.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className={`h-8 rounded-full border px-3 text-xs transition cursor-pointer ${
                      selected
                        ? "border-[var(--color-brand-accent)] bg-[var(--color-brand-accent)] text-white font-medium shadow-xs"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                    }`}
                  >
                    {filter.label} ({categoryCounts[filter.value]})
                  </button>
                );
              })}
            </div>
          </section>

          <ProviderMatrix providers={displayedProviders} />

          {visibleCount < filteredProviders.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-xs font-medium text-[var(--color-text-main)] transition hover:bg-[var(--color-surface)]/80 cursor-pointer"
              >
                Exibir mais {Math.min(PAGE_SIZE, filteredProviders.length - visibleCount)}{" "}
                provedores
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
