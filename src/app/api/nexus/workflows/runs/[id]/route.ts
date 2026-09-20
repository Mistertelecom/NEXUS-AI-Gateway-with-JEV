import { NextRequest, NextResponse } from "next/server";

import { buildErrorBody, sanitizeErrorMessage } from "@/nexus/compat/errors";
import * as db from "@/lib/db/nexusWorkflows";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const run = db.getWorkflowRun(id);

    if (!run) {
      return NextResponse.json(buildErrorBody(404, `Execução '${id}' não encontrada.`), {
        status: 404,
      });
    }

    const pendingApprovals = db.getPendingApprovals(id);

    return NextResponse.json({ run, pendingApprovals });
  } catch (error) {
    return NextResponse.json(buildErrorBody(500, sanitizeErrorMessage(error)), { status: 500 });
  }
}
