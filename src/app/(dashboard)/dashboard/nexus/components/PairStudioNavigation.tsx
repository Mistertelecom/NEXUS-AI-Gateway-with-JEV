import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PairStudioNavigationLink = {
  readonly detail: string;
  readonly href: string;
  readonly label: string;
};

const LINKS = [
  {
    href: "/dashboard/nexus/executions",
    label: "Execuções",
    detail: "Histórico de pipelines e status em tempo real",
  },
  {
    href: "/dashboard/nexus/providers",
    label: "Provedores",
    detail: "Configuração, prontidão e catálogo de modelos",
  },
  {
    href: "/dashboard/nexus/telemetry",
    label: "Telemetria",
    detail: "Métricas de latência e decisões JEV",
  },
] as const satisfies readonly PairStudioNavigationLink[];

export function PairStudioNavigation() {
  return (
    <nav className="grid gap-3 sm:grid-cols-3" aria-label="Superfícies principais do NEXUS">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-4 transition hover:border-[var(--color-brand-accent)]/50 hover:bg-[var(--color-surface)] shadow-xs"
        >
          <span className="flex items-center justify-between text-sm font-semibold text-[var(--color-text-main)]">
            {link.label}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-accent)] transition-colors"
            />
          </span>
          <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
            {link.detail}
          </span>
        </Link>
      ))}
    </nav>
  );
}
