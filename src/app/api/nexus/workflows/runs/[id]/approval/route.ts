import { NextRequest, NextResponse } from "next/server";

import { buildErrorBody, sanitizeErrorMessage } from "@/nexus/compat/errors";
import { WorkflowEngine } from "@/nexus/workflows/engine";
import { approvalRequestSchema } from "@/nexus/workflows/workflowApiSchema";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: runId } = await params;
    const parsed = approvalRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(buildErrorBody(400, parsed.error.message), { status: 400 });
    }

    const { approvalId, decision, feedback } = parsed.data;
    const consumed = await WorkflowEngine.getInstance().handleApproval(
      runId,
      approvalId,
      decision,
      feedback
    );
    if (!consumed) {
      return NextResponse.json(
        buildErrorBody(
          404,
          "Solicitação de aprovação não encontrada, incompatível ou já processada."
        ),
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, runId, decision });
  } catch (error) {
    return NextResponse.json(buildErrorBody(500, sanitizeErrorMessage(error)), { status: 500 });
  }
}
