import { NextRequest, NextResponse } from "next/server";

import { buildErrorBody, sanitizeErrorMessage } from "@/nexus/compat/errors";
import * as db from "@/lib/db/nexusWorkflows";
import { WorkflowEngine } from "@/nexus/workflows/engine";
import {
  assertWorkflowExecutable,
  InvalidWorkflowDefinitionError,
  UnsupportedWorkflowStepError,
} from "@/nexus/workflows/executionPolicy";
import type { WorkflowDefinition } from "@/nexus/workflows/schema";
import { workflowRunRequestSchema } from "@/nexus/workflows/workflowApiSchema";

export async function GET(req: NextRequest) {
  try {
    const workflowId = new URL(req.url).searchParams.get("workflowId") || undefined;
    return NextResponse.json({ runs: db.listWorkflowRuns(workflowId) });
  } catch (error) {
    return NextResponse.json(buildErrorBody(500, sanitizeErrorMessage(error)), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = workflowRunRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(buildErrorBody(400, parsed.error.message), { status: 400 });
    }

    const { inputs = {}, pipelineConfig, workflow: requestedWorkflow, workflowId } = parsed.data;
    if (pipelineConfig) {
      return NextResponse.json(
        buildErrorBody(
          409,
          "Os presets gerenciados exigem seleção persistida de Lead, Worker e Reviewer e ainda não estão disponíveis."
        ),
        { status: 409 }
      );
    }

    let workflow: WorkflowDefinition | null = null;
    if (requestedWorkflow) {
      workflow = requestedWorkflow;
      assertWorkflowExecutable(workflow);
      db.upsertWorkflow(workflow);
    } else if (workflowId) {
      workflow = db.getWorkflow(workflowId);
    } else {
      return NextResponse.json(
        buildErrorBody(400, "Informe workflowId ou uma definição de workflow executável."),
        { status: 400 }
      );
    }

    if (!workflow) {
      return NextResponse.json(buildErrorBody(404, "Workflow não encontrado."), { status: 404 });
    }

    const run = await WorkflowEngine.getInstance().startRun(workflow, inputs);
    return NextResponse.json({ run }, { status: 201 });
  } catch (error) {
    if (
      error instanceof InvalidWorkflowDefinitionError ||
      error instanceof UnsupportedWorkflowStepError
    ) {
      return NextResponse.json(buildErrorBody(400, error.message), { status: 400 });
    }
    return NextResponse.json(buildErrorBody(500, sanitizeErrorMessage(error)), { status: 500 });
  }
}
