import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildErrorBody, sanitizeErrorMessage } from "@/nexus/compat/errors";
import { NexusDecisionEngine } from "@/nexus/jev/decisionEngine";
import { requireNexusModelSelection } from "@/nexus/catalog/virtualAliases";
import { ProviderManager } from "@/nexus/providers/manager";
import { AntigravityCliConnector } from "@/nexus/providers/connectors/antigravityCli";
import {
  parseProviderUsageReport,
  telemetryTestRequestSchema,
  type JevCallRecord,
} from "@/nexus/telemetry/telemetryContracts";
import { NexusTelemetryStore } from "@/nexus/telemetry/telemetryStore";
import { isLoopbackRequest } from "@/shared/utils/apiAuth";

export const dynamic = "force-dynamic";

function errorResponse(status: number, message: string): NextResponse {
  return NextResponse.json(buildErrorBody(status, message), { status });
}

export async function GET() {
  try {
    const store = NexusTelemetryStore.getInstance();
    return NextResponse.json({
      stats: store.getStats(),
      calls: store.getCalls(60),
    });
  } catch (error) {
    return errorResponse(500, `Falha ao obter telemetria: ${sanitizeErrorMessage(error)}`);
  }
}

export async function POST(request: NextRequest) {
  if (!isLoopbackRequest(request)) {
    return errorResponse(403, "Este teste ao vivo exige acesso local.");
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse(400, "O corpo da solicitação deve ser JSON válido.");
  }

  const parsedBody = telemetryTestRequestSchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return errorResponse(400, "Solicitação de teste de telemetria inválida.");
  }

  let selectedModel: string;
  try {
    selectedModel = requireNexusModelSelection(parsedBody.data.model);
  } catch (error) {
    return errorResponse(400, sanitizeErrorMessage(error));
  }

  try {
    const requestStartedAt = performance.now();
    const decisionEngine = new NexusDecisionEngine();
    const routing = ProviderManager.getInstance().resolveRouting(selectedModel);

    if (!routing.isLocalAgy || !(routing.connector instanceof AntigravityCliConnector)) {
      return errorResponse(
        501,
        "Este teste ao vivo só está disponível quando o conector local Antigravity está ativo."
      );
    }

    const jevStartedAt = performance.now();
    const jevDecision = await decisionEngine.decideRoute({
      request: parsedBody.data.prompt,
    });
    const jevLatencyMs = Number((performance.now() - jevStartedAt).toFixed(2));

    const execution = await routing.connector.executePrompt(
      parsedBody.data.prompt,
      routing.targetModel
    );
    const totalLatencyMs = Number((performance.now() - requestStartedAt).toFixed(2));
    const usage = parseProviderUsageReport(execution.usage);

    const record: JevCallRecord = {
      id: `call_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      client: "NEXUS dashboard test",
      modelRequested: selectedModel,
      jevUsed: true,
      jev: {
        taskKind: jevDecision.classification.taskKind,
        confidence: jevDecision.confidence,
        touchesAuth: jevDecision.classification.touchesAuth,
        authProbability: jevDecision.classification.authProbability,
        scope: jevDecision.classification.apparentScope,
        latencyMs: jevLatencyMs,
        selectedRoute: routing.targetModel,
        mode: decisionEngine.getMode(),
      },
      engine: routing.connector.id,
      targetModel: routing.targetModel,
      promptPreview: parsedBody.data.prompt.slice(0, 300),
      responsePreview: execution.text.slice(0, 300),
      ...(usage === undefined ? {} : { usage }),
      totalLatencyMs,
      status: "success",
    };

    NexusTelemetryStore.getInstance().recordCall(record);

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    return errorResponse(502, `Falha na chamada de teste ao vivo: ${sanitizeErrorMessage(error)}`);
  }
}
