"use client";

import { useState, useEffect, use } from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExecutionHeader } from "./ExecutionHeader";
import { ExecutionApproval } from "./ExecutionApproval";
import { ExecutionTimeline } from "./ExecutionTimeline";
import type { NexusExecutionRun, PendingApproval, NexusStepRun } from "./executionTypes";

export default function NexusExecutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [run, setRun] = useState<NexusExecutionRun | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [feedback, setFeedback] = useState("");
  const [submittingApproval, setSubmittingApproval] = useState(false);

  const fetchRun = async () => {
    try {
      const res = await fetch(`/api/nexus/workflows/runs/${id}`);
      const data = await res.json();
      if (data.run) {
        setRun(data.run);
        setPendingApprovals(data.pendingApprovals || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let active = true;
    const refreshRun = () => {
      void fetch(`/api/nexus/workflows/runs/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (active && data.run) {
            setRun(data.run);
            setPendingApprovals(data.pendingApprovals || []);
          }
        })
        .catch((error: unknown) => console.error(error));
    };

    refreshRun();

    // Subscribe to SSE stream
    const evtSource = new EventSource(`/api/nexus/workflows/runs/${id}/events`);

    evtSource.addEventListener("initial_state", (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setRun(parsed);
      } catch {}
    });

    evtSource.addEventListener("step_completed", () => {
      refreshRun();
    });

    evtSource.addEventListener("approval_required", () => {
      refreshRun();
    });

    evtSource.addEventListener("run_completed", () => {
      refreshRun();
    });

    evtSource.addEventListener("run_failed", () => {
      refreshRun();
    });

    return () => {
      active = false;
      evtSource.close();
    };
  }, [id]);

  const handleApprovalDecision = async (approvalId: string, decision: "approved" | "rejected") => {
    setSubmittingApproval(true);
    try {
      const response = await fetch(`/api/nexus/workflows/runs/${id}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalId, decision, feedback }),
      });
      if (!response.ok) throw new Error(`Approval failed: HTTP ${response.status}`);
      await fetchRun();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar decisão de aprovação.");
    } finally {
      setSubmittingApproval(false);
    }
  };

  if (!run) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-[var(--color-text-muted)]">
        <RefreshCw className="size-6 animate-spin" />
      </div>
    );
  }

  const stepsList = Object.values((run.stepRuns || {}) as Record<string, NexusStepRun>);

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12 font-sans">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/nexus/executions"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para Execuções
        </Link>
      </div>

      <ExecutionHeader run={run} />
      <ExecutionApproval
        pendingApprovals={pendingApprovals}
        feedback={feedback}
        setFeedback={setFeedback}
        submittingApproval={submittingApproval}
        handleApprovalDecision={handleApprovalDecision}
      />
      <ExecutionTimeline stepsList={stepsList} />
    </main>
  );
}
