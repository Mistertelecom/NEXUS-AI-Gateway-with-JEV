"use client";

import { Activity, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  telemetryErrorResponseSchema,
  telemetryPostSuccessSchema,
  telemetrySnapshotSchema,
  type TelemetrySnapshot,
} from "@/nexus/telemetry/telemetryContracts";
import { TelemetryCallFeed } from "./TelemetryCallFeed";
import { TelemetrySummary } from "./TelemetrySummary";
import { TelemetryTestForm } from "./TelemetryTestForm";

const EMPTY_TELEMETRY: TelemetrySnapshot = {
  stats: {
    totalCalls: 0,
    jevCalls: 0,
    usageMeasuredCalls: 0,
    costMeasuredCalls: 0,
    taskBreakdown: {},
    engineBreakdown: {},
  },
  calls: [],
};

type TelemetryFetchResult =
  | { readonly kind: "success"; readonly data: TelemetrySnapshot }
  | { readonly kind: "failure"; readonly message: string };

function getErrorMessage(body: unknown, fallback: string): string {
  const parsed = telemetryErrorResponseSchema.safeParse(body);
  return parsed.success ? parsed.data.error.message : fallback;
}

async function fetchTelemetrySnapshot(): Promise<TelemetryFetchResult> {
  try {
    const response = await fetch("/api/nexus/telemetry");
    const body: unknown = await response.json();

    if (!response.ok) {
      return {
        kind: "failure",
        message: getErrorMessage(body, "Não foi possível obter a telemetria."),
      };
    }

    const parsed = telemetrySnapshotSchema.safeParse(body);
    if (!parsed.success) {
      return {
        kind: "failure",
        message: "A resposta de telemetria não corresponde ao contrato esperado.",
      };
    }

    return { kind: "success", data: parsed.data };
  } catch {
    return { kind: "failure", message: "Não foi possível obter a telemetria." };
  }
}

export default function NexusTelemetryPage() {
  const [data, setData] = useState<TelemetrySnapshot>(EMPTY_TELEMETRY);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [testPrompt, setTestPrompt] = useState("");
  const [testModel, setTestModel] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const refreshTelemetry = useCallback(async (): Promise<void> => {
    const result = await fetchTelemetrySnapshot();

    switch (result.kind) {
      case "success":
        setData(result.data);
        setFetchError(null);
        break;
      case "failure":
        setFetchError(result.message);
        break;
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const initialFetch = window.setTimeout(() => {
      void refreshTelemetry();
    }, 0);

    return () => window.clearTimeout(initialFetch);
  }, [refreshTelemetry]);

  useEffect(() => {
    if (!autoRefresh) return undefined;

    const interval = window.setInterval(() => {
      void refreshTelemetry();
    }, 3_000);

    return () => window.clearInterval(interval);
  }, [autoRefresh, refreshTelemetry]);

  const handleSubmitTest = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const prompt = testPrompt.trim();
    const model = testModel.trim();
    if (prompt.length === 0 || model.length === 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/nexus/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });
      const body: unknown = await response.json();

      if (!response.ok) {
        setSubmitError(getErrorMessage(body, "Não foi possível executar o teste."));
        return;
      }

      const parsed = telemetryPostSuccessSchema.safeParse(body);
      if (!parsed.success) {
        setSubmitError("A resposta do teste não corresponde ao contrato esperado.");
        return;
      }

      setExpandedCallId(parsed.data.record.id);
      setTestPrompt("");
      setTestModel("");
      await refreshTelemetry();
    } catch {
      setSubmitError("Não foi possível executar o teste.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCall = (callId: string): void => {
    setExpandedCallId((currentCallId) => (currentCallId === callId ? null : callId));
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12 font-sans">
      <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="size-6 text-[var(--color-text-main)]" aria-hidden="true" />
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
              Telemetria de testes JEV
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Mostra somente execuções registradas por esta rota no processo atual; não representa
            todo o tráfego do gateway.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={autoRefresh}
            onClick={() => setAutoRefresh((current) => !current)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              autoRefresh
                ? "border-[var(--color-brand-accent)]/40 bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]"
                : "border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                autoRefresh
                  ? "bg-[var(--color-brand-accent)] shadow-[0_0_6px_var(--color-brand-accent)]"
                  : "bg-[var(--color-text-muted)]"
              }`}
            />
            Auto-refresh: {autoRefresh ? "ativo" : "pausado"}
          </button>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void refreshTelemetry();
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-text-main)] transition hover:bg-[var(--color-surface)]/80 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            {loading ? "Atualizando" : "Atualizar"}
          </button>
        </div>
      </header>

      {fetchError !== null && (
        <section
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400"
          role="alert"
        >
          {fetchError}
        </section>
      )}

      <TelemetrySummary stats={data.stats} />

      <TelemetryTestForm
        prompt={testPrompt}
        model={testModel}
        submitting={submitting}
        onPromptChange={setTestPrompt}
        onModelChange={setTestModel}
        onSubmit={handleSubmitTest}
      />

      {submitError !== null && (
        <section
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400"
          role="alert"
        >
          {submitError}
        </section>
      )}

      <TelemetryCallFeed calls={data.calls} expandedCallId={expandedCallId} onToggle={toggleCall} />
    </main>
  );
}
