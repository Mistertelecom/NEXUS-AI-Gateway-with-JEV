import { NextRequest, NextResponse } from "next/server";

import { buildErrorBody, sanitizeErrorMessage } from "@/nexus/compat/errors";
import * as db from "@/lib/db/nexusWorkflows";
import { workflowDefinitionSchema } from "@/nexus/workflows/workflowApiSchema";

export async function GET() {
  try {
    return NextResponse.json({ workflows: db.listWorkflows() });
  } catch (error) {
    return NextResponse.json(buildErrorBody(500, sanitizeErrorMessage(error)), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = workflowDefinitionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(buildErrorBody(400, parsed.error.message), { status: 400 });
    }

    db.upsertWorkflow(parsed.data);
    return NextResponse.json({ success: true, workflow: parsed.data });
  } catch (error) {
    return NextResponse.json(buildErrorBody(500, sanitizeErrorMessage(error)), { status: 500 });
  }
}
