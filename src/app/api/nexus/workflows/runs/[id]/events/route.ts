import { NextRequest, NextResponse } from "next/server";

import { buildErrorBody, sanitizeErrorMessage } from "@/nexus/compat/errors";
import * as db from "@/lib/db/nexusWorkflows";
import { WorkflowEngine } from "@/nexus/workflows/engine";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const run = db.getWorkflowRun(id);
    if (!run) {
      return NextResponse.json(buildErrorBody(404, "Execução não encontrada."), { status: 404 });
    }

    const encoder = new TextEncoder();
    const engine = WorkflowEngine.getInstance();
    let unsubscribe = () => {};
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(`event: initial_state\ndata: ${JSON.stringify(run)}\n\n`)
        );
        unsubscribe = engine.subscribe(id, (event) => {
          controller.enqueue(
            encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`)
          );
          if (event.type === "run_completed" || event.type === "run_failed") {
            unsubscribe();
            controller.close();
          }
        });
        req.signal.addEventListener("abort", unsubscribe, { once: true });
      },
      cancel() {
        unsubscribe();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return NextResponse.json(buildErrorBody(500, sanitizeErrorMessage(error)), { status: 500 });
  }
}
