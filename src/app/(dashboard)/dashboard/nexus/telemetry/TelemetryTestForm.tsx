import { Send } from "lucide-react";
import type { FormEventHandler } from "react";

type TelemetryTestFormProps = {
  readonly prompt: string;
  readonly model: string;
  readonly submitting: boolean;
  readonly onPromptChange: (prompt: string) => void;
  readonly onModelChange: (model: string) => void;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
};

export function TelemetryTestForm({
  prompt,
  model,
  submitting,
  onPromptChange,
  onModelChange,
  onSubmit,
}: TelemetryTestFormProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5 font-sans">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-1">
          <h2 className="text-base font-semibold text-[var(--color-text-main)]">
            Registrar teste de execução
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Informe um ID de modelo descoberto ou de Pair NEXUS salvo. Uso e custo aparecem apenas
            quando o executor os reporta.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]" role="status">
            {model.trim().length === 0
              ? "Modelo de teste não configurado. Nenhuma execução será iniciada."
              : "Seleção de modelo informada; ela será validada antes da execução."}
          </p>
        </div>

        <form
          className="grid w-full gap-2 md:grid-cols-[minmax(14rem,1fr)_minmax(16rem,1fr)_auto] lg:w-auto"
          onSubmit={onSubmit}
        >
          <label className="sr-only" htmlFor="nexus-telemetry-test-model">
            Modelo ou Pair NEXUS selecionado
          </label>
          <input
            id="nexus-telemetry-test-model"
            type="text"
            value={model}
            onChange={(event) => onModelChange(event.target.value)}
            className="min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand-accent)] focus:ring-1 focus:ring-[var(--color-brand-accent)]/30"
            placeholder="ID do modelo ou Pair NEXUS"
          />
          <label className="sr-only" htmlFor="nexus-telemetry-test-prompt">
            Prompt do teste
          </label>
          <input
            id="nexus-telemetry-test-prompt"
            type="text"
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            className="min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand-accent)] focus:ring-1 focus:ring-[var(--color-brand-accent)]/30"
            placeholder="Digite um prompt para executar..."
          />
          <button
            type="submit"
            disabled={submitting || model.trim().length === 0 || prompt.trim().length === 0}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-accent)] px-4 py-2 text-xs font-medium text-white transition hover:bg-[var(--color-brand-accent-hover)] disabled:opacity-50 shadow-xs cursor-pointer"
          >
            <Send className="size-3.5" aria-hidden="true" />
            {submitting ? "Processando..." : "Executar teste"}
          </button>
        </form>
      </div>
    </section>
  );
}
