"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RefreshCw, Play, ArrowUpRight, History } from "lucide-react";
import type { WorkflowRun } from "@/nexus/workflows/schema";

type ExecutionsLoadState =
  | { readonly kind: "loading" }
  | { readonly kind: "loaded"; readonly runs: WorkflowRun[] }
  | { readonly kind: "error"; readonly message: string };

async function requestWorkflowRuns(signal?: AbortSignal): Promise<ExecutionsLoadState | null> {
  try {
    const res = await fetch("/api/nexus/workflows/runs", { signal });
    if (!res.ok) {
      return { kind: "error", message: `Erro ao buscar execuções: HTTP ${res.status}` };
    }
    const data = await res.json();
    return {
      kind: "loaded",
      runs: Array.isArray(data.runs) ? data.runs : [],
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    return {
      kind: "error",
      message: err instanceof Error ? err.message : "Erro desconhecido ao carregar execuções.",
    };
  }
}

export default function NexusExecutionsPage() {
  const [loadState, setLoadState] = useState<ExecutionsLoadState>({ kind: "loading" });

  const handleManualRefresh = useCallback(async () => {
    setLoadState({ kind: "loading" });
    const next = await requestWorkflowRuns();
    if (next !== null) setLoadState(next);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void requestWorkflowRuns(controller.signal).then((next) => {
      if (next !== null && !controller.signal.aborted) {
        setLoadState(next);
      }
    });
    return () => controller.abort();
  }, []);

  const runs = loadState.kind === "loaded" ? loadState.runs : [];
  const loading = loadState.kind === "loading";
  const loadError = loadState.kind === "error" ? loadState.message : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] border border-[var(--color-brand-accent)]/30">
            <span className="size-1.5 rounded-full bg-[var(--color-brand-accent)] shadow-[0_0_6px_var(--color-brand-accent)]" />
            Concluído
          </span>
        );
      case "running":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/30">
            <span className="size-1.5 rounded-full bg-blue-500 animate-ping" />
            Em execução
          </span>
        );
      case "waiting_approval":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Aguardando aprovação
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/30">
            <span className="size-1.5 rounded-full bg-red-500" />
            Falhou
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
            Execuções
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)] max-w-2xl">
            Histórico e status em tempo real dos pipelines de orquestração do NEXUS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-main)] hover:bg-[var(--color-surface)]/80 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
          <Link
            href="/dashboard/nexus"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-accent)] text-white px-3.5 text-xs font-medium hover:bg-[var(--color-brand-accent-hover)] transition shadow-xs cursor-pointer"
          >
            <Play className="size-3.5 fill-current" />
            Estúdio de Pairs
          </Link>
        </div>
      </header>

      {/* Error alert */}
      {loadError && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
        >
          {loadError}
        </div>
      )}

      {/* Content */}
      {loading && runs.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <RefreshCw className="size-6 animate-spin text-[var(--color-text-muted)]" />
            <p className="text-xs text-[var(--color-text-muted)]">Carregando execuções...</p>
          </div>
        </div>
      ) : runs.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] mb-3">
            <History className="size-6" />
          </div>
          <h2 className="text-base font-semibold text-[var(--color-text-main)]">
            Nenhuma execução registrada
          </h2>
          <p className="mt-1 max-w-sm text-xs text-[var(--color-text-muted)] leading-relaxed">
            As execuções de pipelines iniciadas aparecerão aqui com status, latência e linha do
            tempo de etapas.
          </p>
          <Link
            href="/dashboard/nexus"
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--color-text-main)] text-[var(--color-bg)] px-4 text-xs font-medium hover:opacity-90 transition"
          >
            Configurar par no Estúdio
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 text-[11px] font-medium text-[var(--color-text-muted)]">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Execução / Objetivo
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Tokens
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Iniciado em
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {runs.map((run) => {
                  const objective =
                    run.inputs && typeof run.inputs === "object" && "objective" in run.inputs
                      ? String(run.inputs.objective)
                      : run.workflowId || run.id;

                  const totalTokens =
                    run.totalTokensUsed &&
                    typeof run.totalTokensUsed === "object" &&
                    "total" in run.totalTokensUsed
                      ? run.totalTokensUsed.total
                      : null;

                  return (
                    <tr
                      key={run.id}
                      className="hover:bg-[var(--color-surface)]/70 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-[var(--color-text-main)] truncate max-w-md">
                          {objective}
                        </div>
                        <div className="font-mono text-[11px] text-[var(--color-text-muted)] mt-0.5">
                          ID: {run.id}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getStatusBadge(run.status)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-sans text-[var(--color-text-muted)]">
                        {totalTokens !== null ? totalTokens.toLocaleString("pt-BR") : "Não medido"}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-[var(--color-text-muted)]">
                        {formatDate(run.startedAt)}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <Link
                          href={`/dashboard/nexus/executions/${run.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-main)] hover:underline"
                        >
                          Ver detalhes
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
