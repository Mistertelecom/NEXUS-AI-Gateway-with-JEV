import type { JevCatalogEvidence, ProviderCatalogSummary } from "./providerCatalog";

type ProviderEvidenceSummaryProps = {
  readonly jev: JevCatalogEvidence;
  readonly summary: ProviderCatalogSummary;
};

const SUMMARY_FIELDS = [
  { key: "totalCount", label: "Catalogados" },
  { key: "configured", label: "Configurados" },
  { key: "ready", label: "Prontos" },
  { key: "liveVerified", label: "Verificados ao vivo" },
  { key: "unavailable", label: "Indisponíveis" },
] as const satisfies readonly {
  readonly key: keyof ProviderCatalogSummary;
  readonly label: string;
}[];

function readableEvidence(value: string): string {
  return value.replaceAll("_", " ");
}

export function ProviderEvidenceSummary({ jev, summary }: ProviderEvidenceSummaryProps) {
  return (
    <section className="space-y-4 font-sans" aria-labelledby="provider-evidence-heading">
      <div>
        <p className="text-xs font-medium text-[var(--color-text-muted)]">Evidência do catálogo</p>
        <h2
          id="provider-evidence-heading"
          className="mt-1 text-base font-semibold text-[var(--color-text-main)]"
        >
          O que o endpoint reportou agora
        </h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {SUMMARY_FIELDS.map((field) => (
          <div
            key={field.key}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 py-3"
          >
            <p className="text-xs text-[var(--color-text-muted)]">{field.label}</p>
            <p className="mt-1 text-xl font-semibold text-[var(--color-text-main)]">
              {summary[field.key]}
            </p>
          </div>
        ))}
      </div>

      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">JEV Orchestrator</p>
            <h3 className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">{jev.name}</h3>
          </div>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-xs text-[var(--color-text-muted)]">
            {jev.mode}
          </span>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-[var(--color-text-muted)]">Prontidão</dt>
            <dd className="mt-1 text-sm text-[var(--color-text-main)]">
              {readableEvidence(jev.readiness)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--color-text-muted)]">Verificação</dt>
            <dd className="mt-1 text-sm text-[var(--color-text-main)]">
              {readableEvidence(jev.verification)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 break-words text-xs leading-relaxed text-[var(--color-text-muted)]">
          {jev.statusSummary}
        </p>
      </article>
    </section>
  );
}
