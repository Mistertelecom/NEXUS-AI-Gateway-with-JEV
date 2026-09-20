"use client";

import Link from "next/link";
import { ExternalLink, LayoutGrid, List, Settings } from "lucide-react";
import { useState } from "react";

import ProviderIcon from "@/shared/components/ProviderIcon";

import type {
  ProviderCatalogItem,
  ProviderCategory,
  ProviderReadiness,
  ProviderVerification,
} from "./providerCatalog";

type ProviderMatrixProps = {
  readonly providers: readonly ProviderCatalogItem[];
};

const CATEGORY_LABEL = {
  apikey: "Chave API",
  audio: "Áudio",
  local: "Local",
  noauth: "Sem autenticação",
  oauth: "OAuth",
  other: "Outro",
  search: "Pesquisa",
} as const satisfies Record<ProviderCategory, string>;

const CATEGORY_BADGE_STYLE: Record<ProviderCategory, string> = {
  apikey: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  audio: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  local: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  noauth: "bg-stone-500/10 text-stone-400 border-stone-500/20",
  oauth: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  other: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  search: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

const READINESS_LABEL = {
  catalogued: "Catalogado",
  configured: "Configurado",
  live_verified: "Verificado ao vivo",
  ready: "Pronto",
  unavailable: "Indisponível",
} as const satisfies Record<ProviderReadiness, string>;

const READINESS_BADGE_STYLE: Record<ProviderReadiness, string> = {
  catalogued: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  configured: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  live_verified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  unavailable: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const VERIFICATION_LABEL = {
  binary_present: "Binário presente",
  not_configured: "Não configurado",
  not_run: "Não executada",
  unavailable: "Indisponível",
  verified_live: "Verificada ao vivo",
} as const satisfies Record<ProviderVerification, string>;

export function ProviderMatrix({ providers }: ProviderMatrixProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (providers.length === 0) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-6 font-sans">
        <h2 className="text-base font-semibold text-[var(--color-text-main)]">
          Nenhum provedor corresponde ao filtro
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
          Ajuste a busca ou selecione outra categoria para ver a evidência retornada pelo catálogo.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 overflow-hidden font-sans"
      aria-labelledby="provider-matrix-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2
            id="provider-matrix-heading"
            className="text-base font-semibold text-[var(--color-text-main)]"
          >
            Provedores conectados
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Configuração e status de verificação reportados
          </p>
        </div>
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
            }`}
            title="Visualização em grade (pequenos quadrados)"
          >
            <LayoutGrid className="size-3.5" />
            <span>Grade</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
              viewMode === "list"
                ? "bg-[var(--color-surface)] text-[var(--color-text-main)] shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
            }`}
            title="Visualização em lista"
          >
            <List className="size-3.5" />
            <span>Lista</span>
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 p-5">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-4 hover:border-emerald-500/40 hover:bg-[var(--color-surface)] hover:shadow-md hover:shadow-emerald-950/10 transition-all duration-200"
            >
              <div>
                {/* Header: Ícone + Nome + Link Externo */}
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)]/80 shadow-xs overflow-hidden transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: provider.color
                        ? `${provider.color}15`
                        : "var(--color-surface)",
                    }}
                  >
                    <ProviderIcon
                      providerId={provider.id}
                      size={24}
                      type="color"
                      fallbackText={provider.textIcon}
                      fallbackColor={provider.color}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/providers/${encodeURIComponent(provider.id)}`}
                        className="truncate text-sm font-semibold text-[var(--color-text-main)] hover:text-emerald-400 transition-colors"
                        title={`Configurar ${provider.name}`}
                      >
                        {provider.name}
                      </Link>
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors p-0.5 inline-flex items-center"
                          title="Abrir documentação / site oficial"
                        >
                          <ExternalLink className="size-3 opacity-60 hover:opacity-100" />
                        </a>
                      )}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-[var(--color-text-muted)]">
                      {provider.id}
                    </p>
                  </div>
                </div>

                {/* Badges de Categoria e Prontidão */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${
                      CATEGORY_BADGE_STYLE[provider.category] ||
                      "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {CATEGORY_LABEL[provider.category]}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${
                      READINESS_BADGE_STYLE[provider.readiness] ||
                      "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {READINESS_LABEL[provider.readiness]}
                  </span>
                </div>

                {/* Detalhe / Status */}
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                  {provider.statusSummary}
                </p>

                {/* Capacidades */}
                {provider.serviceKinds && provider.serviceKinds.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {provider.serviceKinds.map((kind) => (
                      <span
                        key={kind}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/80 px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)] leading-tight"
                      >
                        {kind}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rodapé: Botão de Ação Configurar */}
              <div className="mt-4 pt-3 border-t border-[var(--color-border)]/50">
                <Link
                  href={`/dashboard/providers/${encodeURIComponent(provider.id)}`}
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2 px-3 text-xs font-medium text-[var(--color-text-main)] hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all shadow-xs group-hover:border-emerald-500/30 cursor-pointer"
                  title={`Configurar ${provider.name}`}
                >
                  <Settings className="size-3.5 text-emerald-500 transition-transform group-hover:rotate-45" />
                  <span>Configurar</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="hidden border-b border-[var(--color-border)] px-5 py-2.5 text-xs font-medium text-[var(--color-text-muted)] lg:grid lg:grid-cols-[minmax(14rem,1.35fr)_minmax(6.5rem,.6fr)_minmax(9.5rem,.85fr)_minmax(12rem,1.1fr)_minmax(7rem,.6fr)_minmax(7rem,.55fr)] lg:gap-4 bg-[var(--color-surface)]/60">
            <span>Provedor</span>
            <span>Categoria</span>
            <span>Evidência</span>
            <span>Detalhe</span>
            <span>Capacidades</span>
            <span className="lg:text-right">Ações</span>
          </div>
          <ul className="divide-y divide-[var(--color-border)]">
            {providers.map((provider) => (
              <li
                key={provider.id}
                className="grid gap-4 px-5 py-3.5 lg:grid-cols-[minmax(14rem,1.35fr)_minmax(6.5rem,.6fr)_minmax(9.5rem,.85fr)_minmax(12rem,1.1fr)_minmax(7rem,.6fr)_minmax(7rem,.55fr)] lg:items-center hover:bg-[var(--color-surface)]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)]/80 shadow-xs overflow-hidden"
                    style={{
                      backgroundColor: provider.color
                        ? `${provider.color}15`
                        : "var(--color-surface)",
                    }}
                  >
                    <ProviderIcon
                      providerId={provider.id}
                      size={24}
                      type="color"
                      fallbackText={provider.textIcon}
                      fallbackColor={provider.color}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/providers/${encodeURIComponent(provider.id)}`}
                        className="truncate text-sm font-semibold text-[var(--color-text-main)] hover:text-emerald-400 transition-colors"
                        title={`Configurar ${provider.name}`}
                      >
                        {provider.name}
                      </Link>
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors p-0.5 inline-flex items-center"
                          title="Abrir documentação / site oficial"
                        >
                          <ExternalLink className="size-3 opacity-60 hover:opacity-100" />
                        </a>
                      )}
                    </div>
                    <p className="mt-0.5 break-all font-mono text-[11px] text-[var(--color-text-muted)]">
                      {provider.id}
                    </p>
                    {provider.alias && (
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                        alias: {provider.alias}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] lg:hidden font-medium">
                    Categoria
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-main)] lg:mt-0">
                    {CATEGORY_LABEL[provider.category]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] lg:hidden font-medium">
                    Evidência
                  </p>
                  <p className="mt-1 text-xs font-medium text-[var(--color-text-main)] lg:mt-0">
                    {READINESS_LABEL[provider.readiness]}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    {VERIFICATION_LABEL[provider.verification]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] lg:hidden font-medium">
                    Detalhe
                  </p>
                  <p className="mt-1 break-words text-xs leading-relaxed text-[var(--color-text-muted)] lg:mt-0">
                    {provider.statusSummary}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] lg:hidden font-medium">
                    Capacidades
                  </p>
                  {provider.serviceKinds && provider.serviceKinds.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-1 lg:mt-0">
                      {provider.serviceKinds.map((kind) => (
                        <span
                          key={kind}
                          className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)]"
                        >
                          {kind}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-[var(--color-text-muted)] lg:mt-0">
                      Não informado
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/40 lg:border-none lg:pt-0 lg:justify-end">
                  <span className="text-xs text-[var(--color-text-muted)] lg:hidden font-medium">
                    Ações
                  </span>
                  <Link
                    href={`/dashboard/providers/${encodeURIComponent(provider.id)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-main)] hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all shadow-xs cursor-pointer group"
                    title={`Configurar ${provider.name}`}
                  >
                    <Settings className="size-3.5 text-emerald-500 transition-transform group-hover:rotate-45" />
                    <span>Configurar</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
