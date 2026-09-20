import { z } from "zod";

const ProviderCategorySchema = z.enum([
  "local",
  "oauth",
  "apikey",
  "search",
  "audio",
  "noauth",
  "other",
]);

const ProviderStatusSchema = z.enum(["active", "configured", "ready", "requires_key"]);
const ProviderReadinessSchema = z.enum([
  "catalogued",
  "configured",
  "ready",
  "live_verified",
  "unavailable",
]);
const ProviderVerificationSchema = z.enum([
  "not_configured",
  "not_run",
  "binary_present",
  "verified_live",
  "unavailable",
]);

const ProviderSchema = z
  .object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1),
    alias: z.string().trim().min(1).optional(),
    category: ProviderCategorySchema,
    status: ProviderStatusSchema,
    readiness: ProviderReadinessSchema,
    verification: ProviderVerificationSchema,
    statusSummary: z.string().trim().min(1),
    color: z.string().optional(),
    icon: z.string().optional(),
    textIcon: z.string().optional(),
    website: z.string().optional(),
    serviceKinds: z.array(z.string().trim().min(1)).optional(),
  })
  .passthrough();

const StatusSummarySchema = z
  .object({
    catalogued: z.number().int().nonnegative(),
    configured: z.number().int().nonnegative(),
    ready: z.number().int().nonnegative(),
    liveVerified: z.number().int().nonnegative(),
    unavailable: z.number().int().nonnegative(),
  })
  .passthrough();

const JevSchema = z
  .object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1),
    status: z.string().trim().min(1),
    readiness: z.string().trim().min(1),
    verification: z.string().trim().min(1),
    statusSummary: z.string().trim().min(1),
    mode: z.string().trim().min(1),
  })
  .passthrough();

const ProviderPayloadSchema = z
  .object({
    totalCount: z.number().int().nonnegative(),
    activeCount: z.number().int().nonnegative(),
    statusSummary: StatusSummarySchema,
    providers: z.array(ProviderSchema),
    jev: JevSchema,
  })
  .passthrough();

export type ProviderCatalogItem = Readonly<z.infer<typeof ProviderSchema>>;
export type ProviderCategory = z.infer<typeof ProviderCategorySchema>;
export type ProviderReadiness = z.infer<typeof ProviderReadinessSchema>;
export type ProviderVerification = z.infer<typeof ProviderVerificationSchema>;
export type ProviderCatalogSummary = Readonly<{
  totalCount: number;
  activeCount: number;
  catalogued: number;
  configured: number;
  ready: number;
  liveVerified: number;
  unavailable: number;
}>;
export type JevCatalogEvidence = Readonly<z.infer<typeof JevSchema>>;
export type ProviderCatalog = Readonly<{
  summary: ProviderCatalogSummary;
  providers: readonly ProviderCatalogItem[];
  jev: JevCatalogEvidence;
}>;

function compareProviders(left: ProviderCatalogItem, right: ProviderCatalogItem): number {
  return left.name.localeCompare(right.name) || left.id.localeCompare(right.id);
}

export function deriveProviderCatalog(payload: unknown): ProviderCatalog | null {
  const parsed = ProviderPayloadSchema.safeParse(payload);
  if (!parsed.success) return null;

  const { statusSummary } = parsed.data;
  return {
    summary: {
      totalCount: parsed.data.totalCount,
      activeCount: parsed.data.activeCount,
      catalogued: statusSummary.catalogued,
      configured: statusSummary.configured,
      ready: statusSummary.ready,
      liveVerified: statusSummary.liveVerified,
      unavailable: statusSummary.unavailable,
    },
    providers: [...parsed.data.providers].sort(compareProviders),
    jev: parsed.data.jev,
  };
}
