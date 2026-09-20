import { CheckCircle, ChevronDown, ChevronRight, Clock, Cpu, Terminal } from "lucide-react";
import type { JevCallRecord } from "@/nexus/telemetry/telemetryContracts";

type TelemetryCallFeedProps = {
  readonly calls: readonly JevCallRecord[];
  readonly expandedCallId: string | null;
  readonly onToggle: (callId: string) => void;
};

const MODE_LABELS = {
  local_deterministic: "Local determinístico",
  cloud_openrouter: "Cloud via OpenRouter",
  cloud_typesafe: "Cloud via Typesafe",
} as const;

function formatUsage(usage: JevCallRecord["usage"]): string {
  if (usage === undefined) return "Uso não medido";
  return `${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.totalTokens} total`;
}

function formatCost(cost: JevCallRecord["cost"]): string {
  if (cost === undefined) return "Custo não medido";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" }).format(
    cost.amountUsd
  );
}

function formatTime(timestamp: string): string {
  return `${timestamp.slice(11, 19)} UTC`;
}

function CallInspector({ call }: { readonly call: JevCallRecord }) {
  return (
    <div className="space-y-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]/40 px-5 py-4 text-xs font-sans">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <section className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4">
          <h3 className="flex items-center gap-1.5 font-semibold text-[var(--color-text-main)]">
            <Cpu className="size-4 text-[var(--color-text-muted)]" aria-hidden="true" /> Decisão
            semântica do JEV
          </h3>
          <dl className="space-y-1.5 text-xs text-[var(--color-text-muted)]">
            <div>
              <dt className="inline">Classificação: </dt>
              <dd className="inline font-medium text-[var(--color-text-main)]">
                {call.jev.taskKind}
              </dd>
            </div>
            <div>
              <dt className="inline">Confiança: </dt>
              <dd className="inline font-medium text-[var(--color-text-main)]">
                {(call.jev.confidence * 100).toFixed(1)}%
              </dd>
            </div>
            <div>
              <dt className="inline">Escopo: </dt>
              <dd className="inline font-medium text-[var(--color-text-main)]">{call.jev.scope}</dd>
            </div>
            <div>
              <dt className="inline">Toca autenticação/segurança: </dt>
              <dd className="inline font-medium text-[var(--color-text-main)]">
                {call.jev.touchesAuth ? "Sim" : "Não"}
              </dd>
            </div>
            <div>
              <dt className="inline">Modo do motor: </dt>
              <dd className="inline font-medium text-[var(--color-text-main)]">
                {MODE_LABELS[call.jev.mode]}
              </dd>
            </div>
            <div>
              <dt className="inline">Tempo de classificação: </dt>
              <dd className="inline font-medium text-[var(--color-text-main)]">
                {call.jev.latencyMs} ms
              </dd>
            </div>
          </dl>
        </section>

        <section className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 md:col-span-2">
          <h3 className="flex items-center gap-1.5 font-semibold text-[var(--color-text-main)]">
            <Terminal className="size-4 text-[var(--color-text-muted)]" aria-hidden="true" /> Prompt
            enviado pelo cliente ({call.client})
          </h3>
          <pre className="max-h-36 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-mono text-[11px] text-[var(--color-text-main)]">
            {call.promptPreview}
          </pre>
        </section>
      </div>

      <section className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4">
        <h3 className="flex items-center gap-1.5 font-semibold text-[var(--color-text-main)]">
          <CheckCircle className="size-4 text-[var(--color-text-muted)]" aria-hidden="true" />{" "}
          Resposta devolvida pelo modelo ({call.targetModel})
        </h3>
        <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-mono text-[11px] text-[var(--color-text-main)]">
          {call.responsePreview || "(Resposta vazia)"}
        </pre>
        <div className="flex flex-wrap justify-between gap-2 pt-1 text-xs text-[var(--color-text-muted)]">
          <span>{formatUsage(call.usage)}</span>
          <span>
            Latência total: {call.totalLatencyMs} ms · {formatCost(call.cost)}
          </span>
        </div>
      </section>
    </div>
  );
}

export function TelemetryCallFeed({ calls, expandedCallId, onToggle }: TelemetryCallFeedProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 font-sans">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] p-4 sm:p-5">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-main)]">
            <Clock className="size-4 text-[var(--color-text-muted)]" aria-hidden="true" />
            Feed de chamadas registradas
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            Apenas testes desta rota no processo atual; não representa todo o tráfego do gateway.
          </p>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-muted)]">
          {calls.length} eventos
        </span>
      </header>

      {calls.length === 0 ? (
        <p className="p-12 text-center text-xs text-[var(--color-text-muted)]">
          Nenhuma chamada de teste foi registrada nesta sessão.
        </p>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {calls.map((call) => {
            const isExpanded = expandedCallId === call.id;

            return (
              <article key={call.id} className="transition hover:bg-[var(--color-surface)]/50">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`telemetry-call-${call.id}`}
                  onClick={() => onToggle(call.id)}
                  className="flex w-full flex-col items-start justify-between gap-3 p-4 text-left text-xs md:flex-row md:items-center cursor-pointer"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {isExpanded ? (
                      <ChevronDown
                        className="size-4 shrink-0 text-[var(--color-text-main)]"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronRight
                        className="size-4 shrink-0 text-[var(--color-text-muted)]"
                        aria-hidden="true"
                      />
                    )}
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <time className="font-mono text-xs text-[var(--color-text-muted)]">
                          {formatTime(call.timestamp)}
                        </time>
                        <span className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)]">
                          {call.client}
                        </span>
                        <span className="font-mono text-xs font-medium text-[var(--color-text-main)]">
                          {call.modelRequested}
                        </span>
                      </span>
                      <span className="mt-1 block max-w-xl truncate text-xs text-[var(--color-text-muted)]">
                        &ldquo;{call.promptPreview}&rdquo;
                      </span>
                    </span>
                  </span>

                  <span className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
                    {call.jevUsed && (
                      <span className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1">
                        <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                          JEV:
                        </span>
                        <span className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-main)]">
                          {call.jev.taskKind}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                          {(call.jev.confidence * 100).toFixed(0)}%
                        </span>
                        <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                          {call.jev.latencyMs} ms
                        </span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[11px] text-[var(--color-text-main)]">
                      <CheckCircle
                        className="size-3 text-[var(--color-text-muted)]"
                        aria-hidden="true"
                      />
                      {call.targetModel}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                      {call.totalLatencyMs} ms
                    </span>
                    <span className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                      {formatCost(call.cost)}
                    </span>
                  </span>
                </button>
                {isExpanded && (
                  <div id={`telemetry-call-${call.id}`}>
                    <CallInspector call={call} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
