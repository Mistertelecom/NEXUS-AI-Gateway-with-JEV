import type { NexusPairDraft } from "@/nexus/pairs/definition";

type JevMode = NexusPairDraft["jevMode"];

type ContractStep = {
  readonly role: "JEV" | "Lead" | "Worker";
  readonly summary: string;
};

type Contract = {
  readonly boundary: string;
  readonly steps: readonly ContractStep[];
};

const CONTRACTS = {
  adaptive: {
    boundary:
      "Esta política é registrada no par. Ela descreve o despacho esperado, não uma medição de execução ao vivo.",
    steps: [
      {
        role: "Lead",
        summary: "Planeja uma vez e declara restrições, riscos e revisão necessária.",
      },
      {
        role: "JEV",
        summary: "Executa o máximo de operações locais tipadas que o plano permitir.",
      },
      {
        role: "Worker",
        summary:
          "Faz trabalho generativo ou de código delimitado com raciocínio definido como none.",
      },
      {
        role: "Lead",
        summary: "Retorna apenas se houver falha do plano, ambiguidade, risco ou revisão exigida.",
      },
    ],
  },
  advisory: {
    boundary:
      "Fallback atual: a política fica como advisory e o combo preserva a sequência fixa Lead, Worker, Lead.",
    steps: [
      { role: "Lead", summary: "Planeja a solicitação." },
      { role: "Worker", summary: "Executa o trabalho delimitado." },
      { role: "Lead", summary: "Confere e devolve a resposta final." },
    ],
  },
  off: {
    boundary:
      "Fallback atual: o JEV fica desativado neste par e o combo preserva a sequência fixa Lead, Worker, Lead.",
    steps: [
      { role: "Lead", summary: "Planeja a solicitação." },
      { role: "Worker", summary: "Executa o trabalho delimitado." },
      { role: "Lead", summary: "Confere e devolve a resposta final." },
    ],
  },
} as const satisfies Record<JevMode, Contract>;

export function PairStudioExecutionContract({ jevMode }: { readonly jevMode: JevMode }) {
  const contract = CONTRACTS[jevMode];

  return (
    <aside className="space-y-4 font-sans" aria-label="Contrato de execução do par">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
        <h2 className="text-base font-semibold text-[var(--color-text-main)]">
          Contrato de Execução
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          O que este par pode despachar
        </p>
        <ol className="mt-4 space-y-3">
          {contract.steps.map((step, index) => (
            <li key={`${step.role}-${index}`} className="flex items-start gap-2.5">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] shrink-0 w-4">
                {index + 1}.
              </span>
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-main)]">{step.role}</p>
                <p className="mt-0.5 text-xs leading-5 text-[var(--color-text-muted)]">
                  {step.summary}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 p-4">
        <h3 className="text-xs font-semibold text-[var(--color-text-main)]">Limite de Evidência</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {contract.boundary}
        </p>
      </section>
    </aside>
  );
}
