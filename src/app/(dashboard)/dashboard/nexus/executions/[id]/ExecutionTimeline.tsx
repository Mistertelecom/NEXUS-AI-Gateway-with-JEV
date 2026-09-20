import { CheckCircle, XCircle, AlertTriangle, Clock, Cpu } from "lucide-react";
import type { NexusStepRun } from "./executionTypes";

export function ExecutionTimeline({ stepsList }: { stepsList: NexusStepRun[] }) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="size-4 text-emerald-500" />;
      case "failed":
        return <XCircle className="size-4 text-red-500" />;
      case "waiting_approval":
        return <AlertTriangle className="size-4 text-amber-500" />;
      default:
        return <Clock className="size-4 text-[var(--color-text-muted)]" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "succeeded":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Concluído
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            Falhou
          </span>
        );
      case "waiting_approval":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Aguardando aprovação
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
            {status || "Pendente"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <h2 className="text-sm font-semibold text-[var(--color-text-main)]">
        Etapas da execução ({stepsList.length})
      </h2>

      <div className="space-y-3">
        {stepsList.map((step) => (
          <div
            key={step.id ?? step.stepId}
            className="bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-xl p-4 sm:p-5 space-y-3"
          >
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[var(--color-text-main)]">
                    Etapa:{" "}
                    <code className="font-mono text-[var(--color-text-muted)]">{step.stepId}</code>{" "}
                    ({step.type})
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {step.tokensUsed?.total !== undefined && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {step.tokensUsed.total.toLocaleString("pt-BR")} tokens
                  </span>
                )}
                {getStatusBadge(step.status)}
              </div>
            </div>

            {/* JEV Evaluation Details */}
            {step.type === "jev_eval" && step.outputs && (
              <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs space-y-1.5">
                <div className="font-medium text-[var(--color-text-main)] flex items-center gap-1.5 text-xs">
                  <Cpu className="size-3.5 text-[var(--color-text-muted)]" />
                  <span>Decisões do JEV</span>
                </div>
                <div className="text-[var(--color-text-muted)] text-xs">
                  Categoria:{" "}
                  <strong className="text-[var(--color-text-main)] font-medium">
                    {step.outputs.task_kind}
                  </strong>{" "}
                  (Confiança:{" "}
                  {typeof step.outputs.task_kind_confidence === "number"
                    ? `${Math.round(step.outputs.task_kind_confidence * 100)}%`
                    : "não informada"}
                  )
                </div>
                <div className="text-[var(--color-text-muted)] text-xs">
                  Toca autenticação:{" "}
                  <strong
                    className={
                      step.outputs.touches_auth
                        ? "text-amber-600 dark:text-amber-400 font-medium"
                        : "text-[var(--color-text-main)] font-medium"
                    }
                  >
                    {typeof step.outputs.touches_auth === "boolean"
                      ? step.outputs.touches_auth
                        ? "Sim (Atenção)"
                        : "Não"
                      : "não informado"}
                  </strong>
                </div>
                <div className="text-[var(--color-text-muted)] text-xs">
                  Escopo:{" "}
                  <strong className="text-[var(--color-text-main)] font-medium">
                    {step.outputs.scope}
                  </strong>
                </div>
              </div>
            )}

            {/* Test Runner Outputs */}
            {(step.type === "test_runner" || step.type === "tool_exec") && step.outputs && (
              <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs font-mono overflow-x-auto">
                <div className="text-[var(--color-text-muted)] mb-1 text-[11px]">
                  ${" "}
                  {typeof step.outputs.command === "string"
                    ? step.outputs.command
                    : JSON.stringify(step.outputs.command)}{" "}
                  (Exit Code: {step.outputs.exitCode})
                </div>
                <pre className="whitespace-pre-wrap text-xs text-[var(--color-text-main)]">
                  {step.outputs.stdout || step.outputs.stderr || "Nenhum output registrado."}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
