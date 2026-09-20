import { NextResponse } from "next/server";

import { buildErrorBody } from "@/nexus/compat/errors";
import { NexusDoctor } from "@/nexus/doctor/diagnose";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const report = await NexusDoctor.runDiagnostics();
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("[NEXUS] Diagnostics failed", error);
    return NextResponse.json(buildErrorBody(500, "NEXUS diagnostics failed"), {
      status: 500,
    });
  }
}
