import type { PairStudioEvidenceState } from "./pairStudioModelOptions";

type EvidenceChipProps = {
  readonly label: string;
  readonly state: PairStudioEvidenceState;
  readonly value: string;
};

const STATE_LABEL = {
  configured: "configurado",
  observed: "observado",
  unavailable: "indisponível",
  unknown: "desconhecido",
} as const satisfies Record<PairStudioEvidenceState, string>;

export function PairStudioEvidenceChip({ label, state, value }: EvidenceChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="font-mono text-xs font-medium text-[var(--color-text-main)]">{value}</span>
      <span className="text-[11px] text-[var(--color-text-muted)]">({STATE_LABEL[state]})</span>
    </div>
  );
}
