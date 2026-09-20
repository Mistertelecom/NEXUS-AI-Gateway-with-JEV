/**
 * TypeSafe Jev (System One) Type Definitions
 * Based on the official TypeSafe System One specification (https://docs.typesafe.ai/api)
 */

export type JsonValue =
  string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export type QuestionInstruction = string | Record<string, unknown> | Array<unknown>;

/** Choice Primitive: picks one option from a defined set */
export interface ChoiceQuestion {
  type: "choice";
  instructions: QuestionInstruction;
  criteria: Record<string, string | null>;
}

/** Score Primitive: rates content against ordered, descriptive levels (min 2 levels) */
export interface ScoreQuestion {
  type: "score";
  instructions: QuestionInstruction;
  criteria: string[];
}

/** Noul Primitive: evaluates a yes/no statement and returns probability (0.0 to 1.0) */
export interface NoulQuestion {
  type: "noul";
  instructions: QuestionInstruction;
  criteria?: {
    true?: string;
    false?: string;
  };
}

export type AnyQuestion = ChoiceQuestion | ScoreQuestion | NoulQuestion;

export interface ChoiceAnswer {
  type: "choice";
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface ScoreAnswer {
  type: "score";
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface NoulAnswer {
  type: "noul";
  noul: number;
}

export type AnyAnswer = ChoiceAnswer | ScoreAnswer | NoulAnswer;

export interface SystemOneUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface SystemOneResponse {
  model: string;
  answers: Record<string, AnyAnswer>;
  usage: SystemOneUsage;
}

export interface SystemOnePayload {
  model: string;
  state: JsonValue;
  questions: Record<string, AnyQuestion>;
}

export interface JevClientConfig {
  apiKey?: string;
  baseUrl?: string;
  defaultModel?: string;
  timeoutMs?: number;
  maxRetries?: number;
}
