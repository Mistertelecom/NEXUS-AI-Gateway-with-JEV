export interface CliUsage {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
}

export interface CliResponse {
  readonly status?: string;
  readonly response?: string;
  readonly usage?: CliUsage;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}

export function readUsage(value: unknown): CliUsage | undefined {
  if (!isRecord(value)) return undefined;

  const inputTokens = readOptionalNumber(value["input_tokens"]);
  const outputTokens = readOptionalNumber(value["output_tokens"]);
  if (inputTokens === undefined && outputTokens === undefined) return undefined;
  return { inputTokens, outputTokens };
}

export function parseCliResponse(value: string): CliResponse {
  const parsed: unknown = JSON.parse(value);
  if (!isRecord(parsed)) return {};

  return {
    status: readOptionalString(parsed["status"]),
    response: readOptionalString(parsed["response"]),
    usage: readUsage(parsed["usage"]),
  };
}

export function parseCliRecord(value: string): Record<string, unknown> | undefined {
  const parsed: unknown = JSON.parse(value);
  return isRecord(parsed) ? parsed : undefined;
}
