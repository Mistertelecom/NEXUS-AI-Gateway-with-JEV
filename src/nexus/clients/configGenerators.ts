/**
 * Client configuration generators for the NEXUS Gateway.
 */

import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { NexusModelSelectionError, requireNexusModelSelection } from "../catalog/virtualAliases";
import {
  ConfigTargetError,
  prepareAuthorizedConfigTarget,
  type ConfigClient,
} from "./configTargetPolicy";

export type { ConfigClient } from "./configTargetPolicy";
export { ConfigTargetError } from "./configTargetPolicy";

export class ConfigRequestError extends Error {
  public readonly name = "ConfigRequestError";

  public constructor(message: string) {
    super(message);
  }
}

export interface ConfigOptions {
  readonly gatewayBaseUrl?: string;
  readonly gatewayApiKey?: string;
  readonly defaultModel?: string;
  readonly workspacePath?: string;
}

export interface GenerationResult {
  readonly client: ConfigClient;
  readonly targetPath: string;
  readonly backupPath?: string;
  readonly content: string;
}

function quoteConfigValue(value: string): string {
  return JSON.stringify(value);
}

export class ConfigGenerators {
  private readonly defaultBaseUrl: string;
  private readonly defaultApiKey: string;
  private readonly defaultModel?: string;

  public constructor(options: ConfigOptions = {}) {
    this.defaultBaseUrl = (
      options.gatewayBaseUrl ||
      process.env.NEXUS_GATEWAY_URL ||
      "http://127.0.0.1:20129/v1"
    ).replace(/\/+$/, "");
    this.defaultApiKey = options.gatewayApiKey || "sk-nexus-local-dev-key";
    this.defaultModel = options.defaultModel;
  }

  public generateHermesConfig(options: ConfigOptions = {}): string {
    const baseUrl = quoteConfigValue(options.gatewayBaseUrl || this.defaultBaseUrl);
    const apiKey = quoteConfigValue(options.gatewayApiKey || this.defaultApiKey);
    const defaultModel = quoteConfigValue(this.resolveSelectedModel(options));

    return `# Hermes Agent Configuration — Connected to NEXUS Gateway
# Generated automatically by NEXUS Gateway

gateway:
  endpoint: ${baseUrl}
  api_key: ${apiKey}
  protocol: "openai"

model:
  default: ${defaultModel}
  temperature: 0.2
  max_tokens: 8192
  context_window: 1048576

features:
  streaming: true
  function_calling: true
  loop_prevention: true
  max_iterations: 25

headers:
  X-Nexus-Client: "hermes-agent"
  X-Nexus-Hop-Count: "1"
`;
  }

  public generateCodexConfig(options: ConfigOptions = {}): string {
    const baseUrl = quoteConfigValue(options.gatewayBaseUrl || this.defaultBaseUrl);
    const apiKey = quoteConfigValue(options.gatewayApiKey || this.defaultApiKey);
    const defaultModel = quoteConfigValue(this.resolveSelectedModel(options));

    return `# Codex Configuration — Connected to NEXUS Gateway
# Configured with Responses API wire protocol
# Generated automatically by NEXUS Gateway

[gateway]
base_url = ${baseUrl}
api_key = ${apiKey}
wire_api = "responses"
timeout_ms = 120000

[models]
default = ${defaultModel}

[features]
streaming = true
tool_execution = true
sandbox_mode = "workspace"

[headers]
"X-Nexus-Client" = "codex"
"X-Nexus-Hop-Count" = "1"
`;
  }

  public generateOpenCodeConfig(options: ConfigOptions = {}): string {
    const baseUrl = options.gatewayBaseUrl || this.defaultBaseUrl;
    const apiKey = options.gatewayApiKey || this.defaultApiKey;
    const defaultModel = this.resolveSelectedModel(options);
    const workspace = options.workspacePath || "default";

    return JSON.stringify(
      {
        $schema: "https://opencode.ai/schema/config.json",
        version: "1.0",
        gateway: {
          type: "openai-compatible",
          baseUrl: baseUrl,
          apiKey: apiKey,
          userAgent: "NEXUS-Gateway/1.0",
          headers: {
            "x-opencode-session": `${workspace}:main`,
            "X-Nexus-Client": "opencode",
            "X-Nexus-Hop-Count": "1",
          },
        },
        models: {
          default: defaultModel,
        },
        execution: {
          allowShellCommands: true,
          maxTurnTimeout: 180,
          streamResponses: true,
        },
      },
      null,
      2
    );
  }

  public writeConfig(
    client: ConfigClient,
    targetPath: string,
    options: ConfigOptions = {}
  ): GenerationResult {
    const resolvedTarget = prepareAuthorizedConfigTarget(client, targetPath);
    const backupPath = this.backupExistingFile(resolvedTarget);
    const content = this.generateConfig(client, options);
    const temporaryPath = path.join(
      path.dirname(resolvedTarget),
      `.${path.basename(resolvedTarget)}.${randomUUID()}.tmp`
    );

    try {
      fs.writeFileSync(temporaryPath, content, {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx",
      });
      fs.renameSync(temporaryPath, resolvedTarget);
      fs.chmodSync(resolvedTarget, 0o600);
    } finally {
      if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
    }

    return {
      client,
      targetPath: resolvedTarget,
      backupPath,
      content,
    };
  }

  private resolveSelectedModel(options: ConfigOptions): string {
    try {
      return requireNexusModelSelection(
        options.defaultModel === undefined ? this.defaultModel : options.defaultModel
      );
    } catch (error) {
      if (error instanceof NexusModelSelectionError) {
        throw new ConfigRequestError(error.message);
      }
      throw error;
    }
  }

  private backupExistingFile(filePath: string): string | undefined {
    if (!fs.existsSync(filePath)) return undefined;

    const stats = fs.lstatSync(filePath);
    if (!stats.isFile() || stats.isSymbolicLink()) {
      throw new ConfigTargetError("Configuration target must be a regular file.");
    }

    const backupPath = `${filePath}.bak.${randomUUID()}`;
    fs.copyFileSync(filePath, backupPath, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(backupPath, 0o600);
    return backupPath;
  }

  private generateConfig(client: ConfigClient, options: ConfigOptions): string {
    switch (client) {
      case "hermes":
        return this.generateHermesConfig(options);
      case "codex":
        return this.generateCodexConfig(options);
      case "opencode":
        return this.generateOpenCodeConfig(options);
      default:
        throw new ConfigRequestError("Unsupported NEXUS configuration client.");
    }
  }
}
