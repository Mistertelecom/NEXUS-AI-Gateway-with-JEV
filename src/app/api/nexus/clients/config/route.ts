import { NextResponse } from "next/server";
import { z } from "zod";

import { buildErrorBody } from "@/nexus/compat/errors";
import {
  ConfigGenerators,
  ConfigRequestError,
  ConfigTargetError,
} from "@/nexus/clients/configGenerators";

const ConfigOptionsSchema = z
  .object({
    gatewayBaseUrl: z.string().url().optional(),
    gatewayApiKey: z.string().min(1).max(4096).optional(),
    defaultModel: z.string().trim().min(1).max(512),
    workspacePath: z.string().min(1).max(4096).optional(),
  })
  .strict();

const ConfigRequestSchema = z
  .object({
    client: z.enum(["hermes", "codex", "opencode"]),
    targetPath: z.string().trim().min(1).max(4096).optional(),
    options: ConfigOptionsSchema,
    writeToFile: z.boolean().default(false),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.writeToFile && !value.targetPath) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetPath"],
        message: "targetPath is required when writeToFile is true",
      });
    }
  });

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(buildErrorBody(400, "Request body must be valid JSON"), {
      status: 400,
    });
  }

  const parsed = ConfigRequestSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      buildErrorBody(400, parsed.error.issues[0]?.message ?? "Invalid request body"),
      { status: 400 }
    );
  }

  const { client, targetPath, options, writeToFile } = parsed.data;

  try {
    const generator = new ConfigGenerators(options);
    if (writeToFile && targetPath) {
      const result = generator.writeConfig(client, targetPath, options);
      return NextResponse.json({
        success: true,
        client: result.client,
        written: true,
        backupCreated: result.backupPath !== undefined,
      });
    }

    const content =
      client === "hermes"
        ? generator.generateHermesConfig(options)
        : client === "codex"
          ? generator.generateCodexConfig(options)
          : generator.generateOpenCodeConfig(options);

    return NextResponse.json({ client, content });
  } catch (error) {
    if (error instanceof ConfigRequestError || error instanceof ConfigTargetError) {
      return NextResponse.json(buildErrorBody(400, "Invalid configuration request"), {
        status: 400,
      });
    }

    console.error("[NEXUS] Failed to generate client configuration");
    return NextResponse.json(buildErrorBody(500, "Failed to generate client configuration"), {
      status: 500,
    });
  }
}
