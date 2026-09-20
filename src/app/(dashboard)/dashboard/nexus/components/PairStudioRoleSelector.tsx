import type { PairStudioModelOption } from "./pairStudioModelOptions";

type Role = "Lead" | "Worker";

type PairStudioRoleSelectorProps = {
  readonly disabled: boolean;
  readonly model: string;
  readonly onModelChange: (model: string) => void;
  readonly options: readonly PairStudioModelOption[];
  readonly role: Role;
};

const ROLE_COPY = {
  Lead: {
    detail: "Planejamento e julgamento",
  },
  Worker: {
    detail: "Trabalho generativo delimitado",
  },
} as const satisfies Record<Role, { readonly detail: string }>;

const THINKING_EVIDENCE_LABEL = {
  not_advertised: "Raciocínio não anunciado pelo catálogo",
  observed: "Raciocínio anunciado pelo catálogo",
  unknown: "Raciocínio não medido no catálogo",
} as const satisfies Record<PairStudioModelOption["thinkingEvidence"], string>;

function optionEvidence(option: PairStudioModelOption, role: Role): string {
  if (role === "Worker") return "Custo de entrada e saída observado no catálogo";
  return THINKING_EVIDENCE_LABEL[option.thinkingEvidence];
}

export function PairStudioRoleSelector({
  disabled,
  model,
  onModelChange,
  options,
  role,
}: PairStudioRoleSelectorProps) {
  const copy = ROLE_COPY[role];
  const selected = options.find((option) => option.id === model);
  const controlId = `nexus-${role.toLowerCase()}-model`;

  return (
    <section
      aria-labelledby={`${controlId}-heading`}
      className="flex min-h-44 flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4 font-sans"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              id={`${controlId}-heading`}
              className="text-base font-semibold text-[var(--color-text-main)]"
            >
              {role}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{copy.detail}</p>
          </div>
        </div>
        {selected && (
          <p className="mt-4 text-xs leading-5 text-[var(--color-text-muted)]">
            {optionEvidence(selected, role)}
          </p>
        )}
      </div>

      <label className="mt-5 block" htmlFor={controlId}>
        <span className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
          Modelo descoberto
        </span>
        <select
          id={controlId}
          value={model}
          onChange={(event) => onModelChange(event.target.value)}
          disabled={disabled || options.length === 0}
          className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">
            {disabled
              ? "Carregando descoberta"
              : options.length === 0
                ? "Nenhum modelo disponível para este filtro"
                : "Selecione um modelo descoberto"}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {options.length === 0 && !disabled && (
        <p className="mt-3 text-xs leading-5 text-[var(--color-warning)]">
          {role === "Worker"
            ? "Nenhum modelo com custo observado retornado para os provedores configurados."
            : "Nenhum modelo selecionável retornado para os provedores configurados."}
        </p>
      )}
    </section>
  );
}
