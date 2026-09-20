import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { sanitizeErrorMessage } from "@/nexus/compat/errors";
import { testSingleConnection } from "@/app/api/providers/[id]/test/route";
import { getProviderConnections } from "@/lib/db/providers";
import { NexusDecisionEngine } from "@/nexus/jev/decisionEngine";
import {
  buildNexusProviderCatalogSnapshot,
  providerConnectionEvidenceFromRecords,
  selectProviderTestConnection,
} from "@/nexus/providers/catalogBridge";
import { AI_PROVIDERS } from "@/shared/constants/providers";
import { isLoopbackRequest } from "@/shared/utils/apiAuth";

export const dynamic = "force-dynamic";

type JevMode = "cloud_openrouter" | "cloud_typesafe" | "local_deterministic";

const providerTestRequestSchema = z
  .object({
    providerId: z.string().trim().min(1).max(200),
    connectionId: z.string().trim().min(1).max(200).optional(),
    validationModelId: z.string().trim().min(1).max(500).optional(),
  })
  .strict();

const inheritedProviderTestResultSchema = z.object({
  valid: z.boolean(),
  error: z.string().nullable().optional(),
  latencyMs: z.number().finite().nonnegative().optional(),
  warning: z.string().nullable().optional(),
  skipped: z.boolean().optional(),
});

class UnexpectedProviderTestSelectionError extends Error {
  readonly name = "UnexpectedProviderTestSelectionError";

  constructor(readonly selection: never) {
    super("Unexpected provider test selection.");
  }
}

function assertNever(selection: never): never {
  throw new UnexpectedProviderTestSelectionError(selection);
}

export function buildJevStatus(mode: JevMode) {
  if (mode === "local_deterministic") {
    return {
      id: "typesafe-jev",
      name: "TypeSafe JEV (System One)",
      status: "rules_only_unavailable",
      readiness: "unavailable",
      verification: "not_configured",
      statusSummary:
        "Rules-only fallback is available; cloud JEV evaluation is unavailable without credentials.",
      mode,
      hasKey: false,
      description:
        "Local decision rules are available, but cloud JEV evaluation has not been configured.",
    };
  }

  return {
    id: "typesafe-jev",
    name: "TypeSafe JEV (System One)",
    status: "configured",
    readiness: "configured",
    verification: "not_run",
    statusSummary: "Cloud JEV credentials are configured; no live verification is recorded.",
    mode,
    hasKey: true,
    description:
      "Cloud JEV evaluation is configured but has not been live-verified by this status endpoint.",
  };
}

export async function GET() {
  try {
    const connections = providerConnectionEvidenceFromRecords(await getProviderConnections());
    const catalog = buildNexusProviderCatalogSnapshot(connections);
    const jev = buildJevStatus(new NexusDecisionEngine().getMode());

    return NextResponse.json({ ...catalog, jev });
  } catch (error) {
    return NextResponse.json(
      { error: `Falha ao listar provedores: ${sanitizeErrorMessage(error)}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isLoopbackRequest(request)) {
    return NextResponse.json({ error: "This endpoint requires localhost access" }, { status: 403 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "O corpo da solicitação deve ser JSON válido." },
      { status: 400 }
    );
  }

  const parsedBody = providerTestRequestSchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Solicitação de teste de provedor inválida." },
      { status: 400 }
    );
  }

  const { providerId, connectionId, validationModelId } = parsedBody.data;
  if (providerId === "typesafe-jev" || providerId === "jev") {
    const jev = buildJevStatus(new NexusDecisionEngine().getMode());
    return NextResponse.json(
      {
        providerId: "typesafe-jev",
        success: false,
        error:
          "JEV não possui uma conexão de provedor para testar; consulte seu status nesta rota.",
        jev,
      },
      { status: 409 }
    );
  }

  if (!Object.hasOwn(AI_PROVIDERS, providerId)) {
    return NextResponse.json(
      { error: `Provedor '${providerId}' não encontrado.` },
      { status: 404 }
    );
  }

  try {
    const connections = providerConnectionEvidenceFromRecords(
      await getProviderConnections({ provider: providerId })
    );
    const selection = selectProviderTestConnection(connections, connectionId);

    switch (selection.kind) {
      case "selected": {
        const rawResult: unknown = await testSingleConnection(
          selection.connectionId,
          validationModelId
        );
        const result = inheritedProviderTestResultSchema.safeParse(rawResult);
        if (!result.success) {
          return NextResponse.json(
            { error: "O teste de conexão herdado retornou um resultado inválido." },
            { status: 502 }
          );
        }

        return NextResponse.json({
          providerId,
          connectionId: selection.connectionId,
          success: result.data.valid,
          ...(result.data.latencyMs === undefined ? {} : { latencyMs: result.data.latencyMs }),
          error: result.data.error ? sanitizeErrorMessage(result.data.error) : undefined,
          warning: result.data.warning ?? undefined,
          skipped: result.data.skipped ?? false,
          testPath: `/api/providers/${encodeURIComponent(selection.connectionId)}/test`,
        });
      }
      case "not_configured":
        return NextResponse.json(
          {
            providerId,
            success: false,
            error: "Nenhuma conexão persistida está configurada para este provedor.",
          },
          { status: 409 }
        );
      case "not_found":
        return NextResponse.json(
          {
            providerId,
            connectionId,
            success: false,
            error: "A conexão solicitada não pertence a este provedor.",
          },
          { status: 404 }
        );
      case "ambiguous":
        return NextResponse.json(
          {
            providerId,
            success: false,
            error:
              "Há várias conexões configuradas; informe connectionId para usar o testador oficial.",
            connectionIds: selection.connectionIds,
          },
          { status: 409 }
        );
      default:
        return assertNever(selection);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Erro ao testar conexões: ${sanitizeErrorMessage(error)}` },
      { status: 500 }
    );
  }
}
