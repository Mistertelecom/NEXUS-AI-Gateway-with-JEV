import NexusLogo from "@/shared/components/NexusLogo";
import type { NexusExecutionRun } from "./executionTypes";

export function ExecutionHeader({ run }: { run: NexusExecutionRun }) {
  const getBadgeClass = () => {
    switch (run.status) {
      case "succeeded":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "waiting_approval":
        return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "failed":
        return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse";
    }
  };

  const getStatusText = () => {
    switch (run.status) {
      case "succeeded":
        return "Concluído";
      case "waiting_approval":
        return "Aguardando aprovação";
      case "failed":
        return "Falhou";
      case "running":
        return "Em execução";
      default:
        return run.status;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--color-border)] pb-6 gap-4 font-sans">
      <div>
        <div className="flex items-center gap-3">
          <NexusLogo className="size-6 text-[var(--color-text-main)]" />
          <h1 className="text-xl font-semibold text-[var(--color-text-main)] tracking-tight">
            {run.inputs?.objective || run.id}
          </h1>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getBadgeClass()}`}
          >
            {getStatusText()}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">
          ID: <code className="font-mono text-[var(--color-text-main)]">{run.id}</code> • Workflow:{" "}
          <code className="font-mono text-[var(--color-text-main)]">{run.workflowId}</code>
        </p>
      </div>

      <div className="text-left md:text-right text-xs">
        <div className="text-[var(--color-text-muted)]">
          Tokens reportados:{" "}
          {Object.values(run.stepRuns ?? {}).some((step) => step.tokensUsed?.total !== undefined) &&
          run.totalTokensUsed?.total !== undefined ? (
            <strong className="text-[var(--color-text-main)]">
              {run.totalTokensUsed.total.toLocaleString("pt-BR")}
            </strong>
          ) : (
            <span className="text-[var(--color-text-muted)]">não medidos</span>
          )}
        </div>
        <div className="text-[var(--color-text-muted)] text-[11px] mt-0.5">
          Custos aparecem somente quando informados pelo provider.
        </div>
      </div>
    </div>
  );
}
