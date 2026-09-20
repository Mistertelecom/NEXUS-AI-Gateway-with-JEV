import { z } from "zod";

const nonNegativeIntegerSchema = z.number().int().nonnegative();
const nonNegativeMetricSchema = z.number().finite().nonnegative();
const reportedTokenCountSchema = z.number().int().nonnegative();
const boundedTextSchema = z.string().trim().min(1);

export type TelemetryUsage = {
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
};

export const telemetryUsageSchema = z
  .object({
    promptTokens: nonNegativeIntegerSchema,
    completionTokens: nonNegativeIntegerSchema,
    totalTokens: nonNegativeIntegerSchema,
  })
  .strict()
  .refine(
    (usage) => usage.totalTokens === usage.promptTokens + usage.completionTokens,
    "Total de tokens incompatível com os valores reportados."
  );

export type TelemetryCost = {
  readonly amountUsd: number;
  readonly source: "provider_reported" | "operator_observed";
};

export const telemetryCostSchema = z
  .object({
    amountUsd: nonNegativeMetricSchema,
    source: z.enum(["provider_reported", "operator_observed"]),
  })
  .strict();

export type JevTelemetry = {
  readonly taskKind: string;
  readonly confidence: number;
  readonly touchesAuth: boolean;
  readonly authProbability: number;
  readonly scope: string;
  readonly latencyMs: number;
  readonly selectedRoute: string;
  readonly mode: "local_deterministic" | "cloud_openrouter" | "cloud_typesafe";
};

const jevTelemetrySchema = z
  .object({
    taskKind: boundedTextSchema.max(120),
    confidence: z.number().finite().min(0).max(1),
    touchesAuth: z.boolean(),
    authProbability: z.number().finite().min(0).max(1),
    scope: boundedTextSchema.max(240),
    latencyMs: nonNegativeMetricSchema,
    selectedRoute: boundedTextSchema.max(500),
    mode: z.enum(["local_deterministic", "cloud_openrouter", "cloud_typesafe"]),
  })
  .strict();

export type JevCallRecord = {
  readonly id: string;
  readonly timestamp: string;
  readonly client: string;
  readonly modelRequested: string;
  readonly jevUsed: boolean;
  readonly jev: JevTelemetry;
  readonly engine: string;
  readonly targetModel: string;
  readonly promptPreview: string;
  readonly responsePreview: string;
  readonly usage?: TelemetryUsage;
  readonly cost?: TelemetryCost;
  readonly totalLatencyMs: number;
  readonly status: "success" | "error";
};

export const jevCallRecordSchema = z
  .object({
    id: boundedTextSchema.max(300),
    timestamp: boundedTextSchema.max(100),
    client: boundedTextSchema.max(300),
    modelRequested: boundedTextSchema.max(500),
    jevUsed: z.boolean(),
    jev: jevTelemetrySchema,
    engine: boundedTextSchema.max(300),
    targetModel: boundedTextSchema.max(500),
    promptPreview: z.string().max(12_000),
    responsePreview: z.string().max(12_000),
    usage: telemetryUsageSchema.optional(),
    cost: telemetryCostSchema.optional(),
    totalLatencyMs: nonNegativeMetricSchema,
    status: z.enum(["success", "error"]),
  })
  .strict();

export type TelemetryStats = {
  readonly totalCalls: number;
  readonly jevCalls: number;
  readonly usageMeasuredCalls: number;
  readonly totalTokens?: number;
  readonly costMeasuredCalls: number;
  readonly totalCostUsd?: number;
  readonly avgJevLatencyMs?: number;
  readonly taskBreakdown: Readonly<Record<string, number>>;
  readonly engineBreakdown: Readonly<Record<string, number>>;
};

const breakdownSchema = z.record(z.string(), nonNegativeIntegerSchema);

export const telemetryStatsSchema = z
  .object({
    totalCalls: nonNegativeIntegerSchema,
    jevCalls: nonNegativeIntegerSchema,
    usageMeasuredCalls: nonNegativeIntegerSchema,
    totalTokens: nonNegativeIntegerSchema.optional(),
    costMeasuredCalls: nonNegativeIntegerSchema,
    totalCostUsd: nonNegativeMetricSchema.optional(),
    avgJevLatencyMs: nonNegativeMetricSchema.optional(),
    taskBreakdown: breakdownSchema,
    engineBreakdown: breakdownSchema,
  })
  .strict();

export type TelemetrySnapshot = {
  readonly stats: TelemetryStats;
  readonly calls: readonly JevCallRecord[];
};

export const telemetrySnapshotSchema = z
  .object({
    stats: telemetryStatsSchema,
    calls: z.array(jevCallRecordSchema),
  })
  .strict();

export const telemetryPostSuccessSchema = z
  .object({
    success: z.literal(true),
    record: jevCallRecordSchema,
  })
  .strict();

export const telemetryErrorResponseSchema = z
  .object({
    error: z
      .object({
        message: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

export type TelemetryTestRequest = {
  readonly prompt: string;
  readonly model: string;
};

export const telemetryTestRequestSchema = z
  .object({
    prompt: z.string().trim().min(1).max(12_000),
    model: z.string().trim().min(1).max(500),
  })
  .strict();

const providerUsageReportSchema = z
  .object({
    inputTokens: reportedTokenCountSchema,
    outputTokens: reportedTokenCountSchema,
  })
  .strict();

export function parseProviderUsageReport(value: unknown): TelemetryUsage | undefined {
  const parsed = providerUsageReportSchema.safeParse(value);
  if (!parsed.success) return undefined;

  const totalTokens = parsed.data.inputTokens + parsed.data.outputTokens;

  return {
    promptTokens: parsed.data.inputTokens,
    completionTokens: parsed.data.outputTokens,
    totalTokens,
  };
}
