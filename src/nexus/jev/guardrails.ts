/**
 * Guardrails and Contract Validation for TypeSafe Jev (System One)
 * Enforces documented limits (64k context / 32k state) and prevents failure modes.
 */

import type { AnyQuestion, SystemOnePayload } from "./types";

export const JEV_CONSTANTS = {
  MAX_TOTAL_TOKENS: 64000,
  MAX_STATE_AND_QUESTION_TOKENS: 32000,
  DEFAULT_MODEL: "jev-latest",
  FALLBACK_MODEL: "jev-1.13",
};

/** Approximate token count (conservatively ~3.5 chars per token for code/JSON) */
export function estimateTokens(content: unknown): number {
  if (!content) return 0;
  const str = typeof content === "string" ? content : JSON.stringify(content);
  return Math.ceil(str.length / 3.5);
}

export class JevGuardrailError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "JevGuardrailError";
  }
}

/**
 * Validates a Question structure against TypeSafe API rules and failure mode restrictions.
 */
export function validateQuestion(id: string, q: AnyQuestion): void {
  if (!q || typeof q !== "object") {
    throw new JevGuardrailError(`Question '${id}' must be an object`, "INVALID_QUESTION");
  }

  if (!q.type || !["choice", "score", "noul"].includes(q.type)) {
    throw new JevGuardrailError(
      `Question '${id}' has invalid type '${(q as { type: string }).type}'. Allowed: choice, score, noul`,
      "INVALID_QUESTION_TYPE"
    );
  }

  if (!q.instructions) {
    throw new JevGuardrailError(
      `Question '${id}' is missing required field 'instructions'`,
      "MISSING_INSTRUCTIONS"
    );
  }

  const instrStr = typeof q.instructions === "string" ? q.instructions.toLowerCase() : "";

  // Prohibited usages documented in Jev Jaggedness
  const prohibitedMathTerms = [
    "calculate",
    "how many lines",
    "count the characters",
    "count words",
    "sum of",
  ];
  for (const term of prohibitedMathTerms) {
    if (instrStr.includes(term)) {
      throw new JevGuardrailError(
        `Question '${id}' asks Jev to perform math or counting ('${term}'). Jev is not a calculator; compute math deterministically in code.`,
        "PROHIBITED_MATH"
      );
    }
  }

  const prohibitedCodeTerms = [
    "generate the code",
    "write python",
    "write javascript",
    "rewrite the file",
  ];
  for (const term of prohibitedCodeTerms) {
    if (instrStr.includes(term)) {
      throw new JevGuardrailError(
        `Question '${id}' asks Jev to generate code ('${term}'). Jev is a System One decision model, not a generative LLM. Use Gemini Flash/GPT for code generation.`,
        "PROHIBITED_GENERATION"
      );
    }
  }

  if (q.type === "choice") {
    if (!q.criteria || typeof q.criteria !== "object" || Array.isArray(q.criteria)) {
      throw new JevGuardrailError(
        `Choice question '${id}' requires 'criteria' as a map of option to description`,
        "INVALID_CHOICE_CRITERIA"
      );
    }
    const options = Object.keys(q.criteria);
    if (options.length === 0) {
      throw new JevGuardrailError(
        `Choice question '${id}' must define at least one option in 'criteria'`,
        "EMPTY_CHOICE_CRITERIA"
      );
    }
  } else if (q.type === "score") {
    if (!q.criteria || !Array.isArray(q.criteria)) {
      throw new JevGuardrailError(
        `Score question '${id}' requires 'criteria' as an ordered array of levels`,
        "INVALID_SCORE_CRITERIA"
      );
    }
    if (q.criteria.length < 2) {
      throw new JevGuardrailError(
        `Score question '${id}' must define at least two ordered levels in 'criteria'`,
        "INSUFFICIENT_SCORE_LEVELS"
      );
    }
  } else if (q.type === "noul") {
    if (q.criteria && typeof q.criteria !== "object") {
      throw new JevGuardrailError(
        `Noul question '${id}' criteria must be an object with optional 'true' and 'false' descriptions`,
        "INVALID_NOUL_CRITERIA"
      );
    }
  }
}

/**
 * Validates the content shared by outgoing requests and local compatibility checks.
 */
function validateContent(payload: Pick<SystemOnePayload, "state" | "questions">): void {
  if (!payload.state && payload.state !== "" && payload.state !== false && payload.state !== 0) {
    throw new JevGuardrailError("SystemOne request requires a non-null 'state'", "MISSING_STATE");
  }

  if (
    !payload.questions ||
    typeof payload.questions !== "object" ||
    Object.keys(payload.questions).length === 0
  ) {
    throw new JevGuardrailError(
      "SystemOne request requires at least one question in 'questions'",
      "NO_QUESTIONS"
    );
  }

  const stateTokens = estimateTokens(payload.state);
  let maxQuestionTokens = 0;
  let totalQuestionTokens = 0;

  for (const [id, q] of Object.entries(payload.questions)) {
    validateQuestion(id, q);
    const qTokens = estimateTokens(q);
    totalQuestionTokens += qTokens;
    if (qTokens > maxQuestionTokens) {
      maxQuestionTokens = qTokens;
    }
  }

  if (stateTokens + maxQuestionTokens > JEV_CONSTANTS.MAX_STATE_AND_QUESTION_TOKENS) {
    throw new JevGuardrailError(
      `State (${stateTokens} est. tokens) + largest question (${maxQuestionTokens} est. tokens) exceeds Jev 1.13 limit of ${JEV_CONSTANTS.MAX_STATE_AND_QUESTION_TOKENS} tokens. Filter state before evaluation.`,
      "TOKEN_LIMIT_EXCEEDED"
    );
  }

  if (stateTokens + totalQuestionTokens > JEV_CONSTANTS.MAX_TOTAL_TOKENS) {
    throw new JevGuardrailError(
      `Total request size (${stateTokens + totalQuestionTokens} est. tokens) exceeds Jev 1.13 total limit of ${JEV_CONSTANTS.MAX_TOTAL_TOKENS} tokens.`,
      "TOTAL_TOKEN_LIMIT_EXCEEDED"
    );
  }
}

export function validatePayload(payload: SystemOnePayload): void {
  validateContent(payload);
}

export class JevGuardrails {
  public static validatePayload(state: any, questions: any): { valid: boolean; errors: string[] } {
    try {
      validateContent({ state, questions });
      return { valid: true, errors: [] };
    } catch (err: any) {
      return { valid: false, errors: [err.message] };
    }
  }

  public static isProhibitedJevTask(prompt: string): { prohibited: boolean; reason?: string } {
    const lower = prompt.toLowerCase();
    const prohibited = [
      "quanto é",
      "calculate",
      "compute",
      "escreva uma função",
      "generate the code",
      "write python",
      "write javascript",
      "rewrite the file",
    ];
    for (const term of prohibited) {
      if (lower.includes(term)) {
        return { prohibited: true, reason: `Tarefa proibida para o Jev: '${term}'` };
      }
    }
    return { prohibited: false };
  }
}
