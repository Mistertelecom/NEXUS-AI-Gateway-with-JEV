/**
 * NEXUS Provider and Agent Runtime Type Definitions
 * Differentiates ModelProvider (inference) from AgentRuntime (execution).
 */

export type ProviderStatus =
  | "implemented"
  | "configured"
  | "verified_live"
  | "needs_credentials"
  | "unsupported"
  | "restricted";

export interface ModelCapability {
  id: string;
  name: string;
  contextWindow?: number;
  maxOutputTokens?: number;
  supportsStreaming?: boolean;
  supportsTools?: boolean;
  supportsVision?: boolean;
  supportsReasoning?: boolean;
  inputCostPer1k?: number;
  outputCostPer1k?: number;
}

export interface ProviderConnection {
  id: string;
  provider: string; // "openrouter", "gemini", "openai", "anthropic", "opencode", "custom"
  name: string;
  status: ProviderStatus;
  statusReason?: string;
  encryptedKey?: string;
  baseUrl?: string;
  models: ModelCapability[];
  lastTestedAt?: string;
  lastLatencyMs?: number;
  rateLimitedUntil?: string;
  totalTokensUsed: number;
  totalRequests: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * ModelProvider: Provides inference API calls (text generation, streaming, embeddings).
 */
export interface ModelProvider {
  id: string;
  name: string;
  status: ProviderStatus;
  discoverModels(): Promise<ModelCapability[]>;
  testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }>;
}

/**
 * AgentRuntime: Executes agent sessions with workspace/tool access.
 */
export interface AgentRuntime {
  id: string;
  name: string; // "hermes", "codex", "opencode", "claude-code"
  status: ProviderStatus;
  supportsSandboxing: boolean;
  executeCommand(
    command: string,
    cwd: string,
    timeoutMs?: number
  ): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }>;
}
