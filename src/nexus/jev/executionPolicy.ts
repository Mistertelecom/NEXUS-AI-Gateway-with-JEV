import type { LeadExecutionPlan } from "./executionPlan";

export type ExecutionDecision = {
  readonly path: "jev_direct" | "cheap_worker" | "lead_escalation";
  readonly mode: "local_deterministic";
  readonly requiresReview: boolean;
  readonly estimatedCallClass: "lead_only" | "lead_worker" | "lead_review" | "lead_worker_review";
  readonly leadCalls: number;
  readonly workerCalls: number;
  readonly estimatedCostUsd: null;
  readonly reasons: readonly string[];
};

export function evaluateLeadPlan(plan: LeadExecutionPlan, request: string): ExecutionDecision {
  const normalized = request
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase();
  const sensitive =
    /\b(auth\w*|login|jwt|oauth|password\w*|senha\w*|credential\w*|credencia\w*|secret\w*|segredo\w*|permission\w*|permiss\w*|crypt\w*|criptograf\w*|tenant\w*|token\w*|security|seguranca)\b/u.test(
      normalized
    );
  const large =
    request.length > 16_000 ||
    /\b(architect\w*|arquitet\w*|migrat\w*|migrac\w*|multiple|multipl\w*|production|producao|billing|payment\w*|pagamento\w*)\b/u.test(
      normalized
    );
  const reasons: string[] = [];
  if (sensitive || plan.touchesAuth) reasons.push("auth_sensitive");
  if (large || plan.scope !== "localized") reasons.push("large_scope");
  if (plan.risk !== "low") reasons.push("elevated_risk");
  if (plan.confidence < 0.75) reasons.push("low_plan_confidence");
  if (plan.reviewRequired) reasons.push("lead_required_review");
  const workerCalls = plan.steps.filter((step) => step.kind === "generate").length;
  const requiresReview = reasons.length > 0;
  return {
    path: requiresReview ? "lead_escalation" : workerCalls ? "cheap_worker" : "jev_direct",
    mode: "local_deterministic",
    requiresReview,
    estimatedCallClass: requiresReview
      ? workerCalls
        ? "lead_worker_review"
        : "lead_review"
      : workerCalls
        ? "lead_worker"
        : "lead_only",
    leadCalls: requiresReview ? 2 : 1,
    workerCalls,
    estimatedCostUsd: null,
    reasons: reasons.length
      ? reasons
      : [workerCalls ? "lead_planned_generation" : "lead_planned_local_operations"],
  };
}
