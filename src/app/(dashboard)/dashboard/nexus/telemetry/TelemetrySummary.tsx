import { Coins, Terminal, TrendingUp, Zap } from "lucide-react";
import type { ReactNode } from "react";
import type { TelemetryStats } from "@/nexus/telemetry/telemetryContracts";

type MetricCardProps = {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly icon: ReactNode;
};

function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 text-[var(--color-text-muted)]">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-[var(--color-text-main)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)] leading-relaxed">{detail}</p>
    </section>
  );
}

function formatUsd(amountUsd: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
  }).format(amountUsd);
}

export function TelemetrySummary({ stats }: { readonly stats: TelemetryStats }) {
  const measuredUsage =
    stats.totalTokens === undefined
      ? "Não medido"
      : `${stats.totalTokens.toLocaleString("pt-BR")} tokens`;
  const measuredCost =
    stats.totalCostUsd === undefined ? "Não medido" : formatUsd(stats.totalCostUsd);
  const measuredLatency =
    stats.avgJevLatencyMs === undefined
      ? "Não medido"
      : `${stats.avgJevLatencyMs.toLocaleString("pt-BR")} ms`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
      <MetricCard
        label="Chamadas registradas"
        value={stats.totalCalls.toLocaleString("pt-BR")}
        detail="Testes registrados nesta sessão de processo."
        icon={<Terminal className="size-4" aria-hidden="true" />}
      />
      <MetricCard
        label="Latência média do JEV"
        value={measuredLatency}
        detail="Média das classificações registradas neste buffer."
        icon={<Zap className="size-4" aria-hidden="true" />}
      />
      <MetricCard
        label="Uso reportado pelo provedor"
        value={measuredUsage}
        detail={
          stats.usageMeasuredCalls === 0
            ? "Nenhuma chamada neste buffer trouxe uso reportado."
            : `${stats.usageMeasuredCalls} de ${stats.totalCalls} chamadas com uso reportado.`
        }
        icon={<TrendingUp className="size-4" aria-hidden="true" />}
      />
      <MetricCard
        label="Custo reportado"
        value={measuredCost}
        detail={
          stats.costMeasuredCalls === 0
            ? "Nenhuma chamada neste buffer trouxe custo reportado."
            : `${stats.costMeasuredCalls} de ${stats.totalCalls} chamadas com custo reportado.`
        }
        icon={<Coins className="size-4" aria-hidden="true" />}
      />
    </div>
  );
}
