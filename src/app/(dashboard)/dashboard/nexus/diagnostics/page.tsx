"use client";

import { useEffect, useState } from "react";
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Shield,
  Database,
  Terminal,
  FolderGit2,
  Globe,
} from "lucide-react";
import type { DiagnosticCheck, DiagnosticReport } from "@/nexus/doctor/diagnose";

function isDiagnosticReport(value: unknown): value is DiagnosticReport {
  if (typeof value !== "object" || value === null) return false;
  const summary = Reflect.get(value, "summary");
  const checks = Reflect.get(value, "checks");
  return typeof summary === "object" && summary !== null && Array.isArray(checks);
}

async function requestDiagnosticReport(): Promise<DiagnosticReport | null> {
  const response = await fetch("/api/nexus/doctor");
  const data: unknown = await response.json();
  return isDiagnosticReport(data) ? data : null;
}

export default function NexusDiagnosticsPage() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(true);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const nextReport = await requestDiagnosticReport();
      if (nextReport) setReport(nextReport);
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void requestDiagnosticReport()
      .then((nextReport) => {
        if (active && nextReport) setReport(nextReport);
      })
      .catch((error: unknown) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getCategoryIcon = (cat: DiagnosticCheck["category"]) => {
    const iconClass = "size-4 text-[var(--color-text-muted)]";
    switch (cat) {
      case "runtime":
        return <Server className={iconClass} />;
      case "security":
        return <Shield className={iconClass} />;
      case "database":
        return <Database className={iconClass} />;
      case "providers":
        return <Terminal className={iconClass} />;
      case "workspace":
        return <FolderGit2 className={iconClass} />;
      case "network":
        return <Globe className={iconClass} />;
      default:
        return <Server className={iconClass} />;
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12 font-sans">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="size-6 text-[var(--color-text-main)]" aria-hidden="true" />
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
              Diagnóstico do sistema
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Auditoria de integridade da infraestrutura, banco SQLite WAL, cofre de chaves, CLI e
            conectividade upstream.
          </p>
        </div>

        <button
          type="button"
          onClick={runDiagnostics}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-main)] hover:bg-[var(--color-surface)]/80 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Executando auditoria" : "Executar novamente"}
        </button>
      </header>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
              <div className="text-xs font-medium text-[var(--color-text-muted)]">
                Total de Checagens
              </div>
              <div className="mt-2 text-2xl font-semibold text-[var(--color-text-main)]">
                {report.summary?.total || 0}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
              <div className="text-xs font-medium text-[var(--color-text-muted)]">Aprovados</div>
              <div className="mt-2 text-2xl font-semibold text-[var(--color-brand-accent)]">
                {report.summary?.passed || 0}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
              <div className="text-xs font-medium text-[var(--color-text-muted)]">Avisos</div>
              <div
                className={`mt-2 text-2xl font-semibold ${
                  (report.summary?.warnings || 0) > 0
                    ? "text-amber-500"
                    : "text-[var(--color-text-main)]"
                }`}
              >
                {report.summary?.warnings || 0}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
              <div className="text-xs font-medium text-[var(--color-text-muted)]">Falhas</div>
              <div
                className={`mt-2 text-2xl font-semibold ${
                  (report.summary?.failed || 0) > 0
                    ? "text-red-500"
                    : "text-[var(--color-text-main)]"
                }`}
              >
                {report.summary?.failed || 0}
              </div>
            </div>
          </div>

          {/* Checks List */}
          <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="text-base font-semibold text-[var(--color-text-main)]">
                Itens verificados
              </h2>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Status individual dos subsistemas e dependências essenciais
              </p>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {report.checks.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-4 p-5 hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-muted)]">
                    {getCategoryIcon(c.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium text-[var(--color-text-main)]">
                        {c.name}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                          c.status === "ok"
                            ? "border-[var(--color-brand-accent)]/30 bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]"
                            : c.status === "warn"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                              : "border-red-500/30 bg-red-500/10 text-red-500"
                        }`}
                      >
                        {c.status === "ok" ? "OK" : c.status === "warn" ? "Aviso" : "Falha"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)] leading-relaxed">
                      {c.details}
                    </p>

                    {c.recommendation && (
                      <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text-muted)] leading-relaxed">
                        <span className="font-medium text-[var(--color-text-main)]">
                          Recomendação:{" "}
                        </span>
                        {c.recommendation}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {c.status === "ok" ? (
                      <CheckCircle2 className="size-4 text-[var(--color-brand-accent)]" />
                    ) : c.status === "warn" ? (
                      <AlertTriangle className="size-4 text-amber-500" />
                    ) : (
                      <XCircle className="size-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
