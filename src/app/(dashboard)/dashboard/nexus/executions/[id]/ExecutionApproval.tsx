import { HelpCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import type { PendingApproval } from "./executionTypes";

type Props = {
  pendingApprovals: PendingApproval[];
  feedback: string;
  setFeedback: (value: string) => void;
  submittingApproval: boolean;
  handleApprovalDecision: (id: string, decision: "approved" | "rejected") => Promise<void>;
};

export function ExecutionApproval({
  pendingApprovals,
  feedback,
  setFeedback,
  submittingApproval,
  handleApprovalDecision,
}: Props) {
  if (pendingApprovals.length === 0) return null;

  return (
    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-4 font-sans">
      <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
        <HelpCircle className="size-5 shrink-0" />
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-main)]">
            Aprovação humana necessária
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Uma etapa do pipeline solicitou decisão humana. Revise as evidências antes de continuar.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
          Feedback ou observações (opcional):
        </label>
        <textarea
          rows={2}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Digite observações sobre a alteração ou motivo de rejeição..."
          className="w-full p-2.5 border rounded-lg text-xs bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text-muted)] transition"
        />
      </div>

      <div className="flex gap-2.5 justify-end">
        <button
          type="button"
          onClick={() => handleApprovalDecision(pendingApprovals[0].id, "rejected")}
          disabled={submittingApproval}
          className="px-3.5 py-1.5 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
        >
          <ThumbsDown className="size-3.5" /> Rejeitar
        </button>
        <button
          type="button"
          onClick={() => handleApprovalDecision(pendingApprovals[0].id, "approved")}
          disabled={submittingApproval}
          className="px-4 py-1.5 bg-[var(--color-text-main)] text-[var(--color-bg)] hover:opacity-90 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition shadow-xs"
        >
          <ThumbsUp className="size-3.5" /> Aprovar etapa
        </button>
      </div>
    </div>
  );
}
