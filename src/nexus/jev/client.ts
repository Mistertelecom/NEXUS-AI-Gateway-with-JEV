/**
 * TypeSafe Jev (System One) Client
 * Uses official @typesafe-ai/sdk with HTTP fallback and exponential backoff.
 */

import { TypeSafeClient } from "@typesafe-ai/sdk";
import {
  AnyQuestion,
  JevClientConfig,
  SystemOnePayload,
  SystemOneResponse,
  AnyAnswer,
} from "./types";
import { validatePayload, JEV_CONSTANTS } from "./guardrails";

export class JevClient {
  private apiKey: string | null;
  private baseUrl: string;
  private defaultModel: string;
  private timeoutMs: number;
  private maxRetries: number;
  private sdkClient: TypeSafeClient | null = null;

  constructor(config: JevClientConfig = {}) {
    const openrouterKey = process.env.OPENROUTER_API_KEY || null;
    const typesafeKey = process.env.TYPESAFE_API_KEY || null;

    this.apiKey = config.apiKey || typesafeKey || openrouterKey || null;

    const detectedOpenRouter =
      (this.apiKey?.startsWith("sk-or-") ?? false) || (!typesafeKey && Boolean(openrouterKey));

    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    } else if (process.env.TYPESAFE_BASE_URL) {
      this.baseUrl = process.env.TYPESAFE_BASE_URL;
    } else if (detectedOpenRouter) {
      this.baseUrl = "https://openrouter.ai";
    } else {
      this.baseUrl = "https://api.typesafe.ai";
    }

    if (config.defaultModel) {
      this.defaultModel = config.defaultModel;
    } else if (process.env.TYPESAFE_MODEL) {
      this.defaultModel = process.env.TYPESAFE_MODEL;
    } else if (this.isOpenRouter()) {
      this.defaultModel = "~typesafe/jev-latest";
    } else {
      this.defaultModel = JEV_CONSTANTS.DEFAULT_MODEL;
    }

    this.timeoutMs = config.timeoutMs || 15000;
    this.maxRetries = config.maxRetries !== undefined ? config.maxRetries : 3;

    if (this.apiKey && !this.isOpenRouter()) {
      try {
        this.sdkClient = new TypeSafeClient({
          apiKey: this.apiKey,
          baseURL: this.baseUrl,
          timeout: this.timeoutMs,
        });
      } catch {
        this.sdkClient = null;
      }
    }
  }

  public isOpenRouter(): boolean {
    return this.baseUrl.includes("openrouter.ai") || (this.apiKey?.startsWith("sk-or-") ?? false);
  }

  public getMode(): "cloud_openrouter" | "cloud_typesafe" | "local_deterministic" {
    if (!this.apiKey) return "local_deterministic";
    if (this.isOpenRouter()) return "cloud_openrouter";
    return "cloud_typesafe";
  }

  public hasCredentials(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Evaluates state against a map of questions.
   */
  public async evaluate(
    state: SystemOnePayload["state"],
    questions: Record<string, AnyQuestion>,
    options: { model?: string; mockFallback?: boolean } = {}
  ): Promise<SystemOneResponse> {
    const model = options.model || this.defaultModel;
    const payload: SystemOnePayload = { model, state, questions };

    // 1. Enforce strict guardrails
    validatePayload(payload);

    // 2. If credentials are missing, check if mock fallback is permitted
    if (!this.apiKey) {
      if (
        options.mockFallback ||
        process.env.NODE_ENV === "test" ||
        process.env.NEXUS_JEV_MOCK === "true"
      ) {
        return this.generateDeterministicMockResponse(model, questions);
      }
      throw new Error(
        "Missing TYPESAFE_API_KEY or OPENROUTER_API_KEY. Provide an official TypeSafe or OpenRouter API key or enable mock mode in test environments."
      );
    }

    // 3. Try official SDK first (for native TypeSafe AI endpoint)
    if (this.sdkClient && !this.isOpenRouter()) {
      try {
        const sdkRes = await (this.sdkClient as any).systemOne({
          state,
          model,
          questions,
        });
        if (sdkRes && sdkRes.answers) {
          return {
            model: sdkRes.model || model,
            answers: sdkRes.answers as Record<string, AnyAnswer>,
            usage: sdkRes.usage || { input_tokens: 0, output_tokens: 0 },
          };
        }
      } catch (err: any) {
        // Fallback to direct HTTP on SDK errors
        if (err?.status === 401 || err?.status === 422) {
          throw err; // Terminal errors, do not retry
        }
      }
    }

    // 4. Resilient HTTP fallback with exponential backoff (also used for OpenRouter Decisions API)
    return this.executeHttpWithRetry(payload);
  }

  private async executeHttpWithRetry(payload: SystemOnePayload): Promise<SystemOneResponse> {
    let delay = 500;
    let lastError: Error | null = null;

    const isOpenRouter = this.isOpenRouter();
    const url = isOpenRouter
      ? `${this.baseUrl.replace(/\/+$/, "")}/api/alpha/decisions`
      : `${this.baseUrl.replace(/\/+$/, "")}/v1/systemone`;

    const requestModel =
      isOpenRouter && !payload.model.startsWith("~")
        ? payload.model.startsWith("typesafe/")
          ? `~${payload.model}`
          : `~typesafe/${payload.model}`
        : payload.model;

    const requestPayload: SystemOnePayload = {
      ...payload,
      model: requestModel,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "User-Agent": "NEXUS/0.1",
    };

    if (isOpenRouter) {
      headers["HTTP-Referer"] = "http://127.0.0.1:20129";
      headers["X-Title"] = "NEXUS";
    }

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (res.ok) {
          const data = (await res.json()) as SystemOneResponse;
          return data;
        }

        const errorBody = await res.text().catch(() => "");
        const providerLabel = isOpenRouter ? "OpenRouter Decisions" : "TypeSafe";
        if (res.status === 401) {
          throw new Error(`${providerLabel} Authentication failed (401): ${errorBody}`);
        }
        if (res.status === 422) {
          throw new Error(`${providerLabel} Unprocessable Entity (422): ${errorBody}`);
        }
        if (res.status === 429 || res.status === 529 || res.status >= 500) {
          // Retryable status codes
          lastError = new Error(
            `${providerLabel} API temporary error (${res.status}): ${errorBody}`
          );
        } else {
          throw new Error(`${providerLabel} API error (${res.status}): ${errorBody}`);
        }
      } catch (err: any) {
        const providerLabel = isOpenRouter ? "OpenRouter Decisions" : "TypeSafe";
        if (err.name === "AbortError") {
          lastError = new Error(`${providerLabel} request timed out after ${this.timeoutMs}ms`);
        } else {
          lastError = err;
        }
      }

      if (attempt < this.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    throw lastError || new Error("TypeSafe Jev request failed after retries");
  }

  /**
   * Deterministic mock response for offline CI and testing when no API key is set.
   * Produces fully-formed calibrated responses adhering to the TypeSafe schema.
   */
  private generateDeterministicMockResponse(
    model: string,
    questions: Record<string, AnyQuestion>
  ): SystemOneResponse {
    const answers: Record<string, AnyAnswer> = {};

    for (const [id, q] of Object.entries(questions)) {
      if (q.type === "choice") {
        const options = Object.keys(q.criteria);
        const choice = options[0] || "unknown";
        const probabilities: Record<string, number> = {};
        options.forEach((opt, idx) => {
          probabilities[opt] =
            idx === 0 ? 0.85 : Number((0.15 / (options.length - 1 || 1)).toFixed(2));
        });
        answers[id] = {
          type: "choice",
          choice,
          probabilities,
          confidence: 0.88,
        };
      } else if (q.type === "score") {
        const levels = q.criteria;
        const legend: Record<string, string> = {};
        const probabilities: Record<string, number> = {};
        levels.forEach((lvl, idx) => {
          legend[String(idx)] = lvl;
          probabilities[String(idx)] = idx === 0 ? 0.75 : idx === 1 ? 0.2 : 0.05;
        });
        answers[id] = {
          type: "score",
          score: 0.3,
          legend,
          probabilities,
          confidence: 0.82,
        };
      } else if (q.type === "noul") {
        answers[id] = {
          type: "noul",
          noul: 0.78,
        };
      }
    }

    return {
      model,
      answers,
      usage: { input_tokens: 120, output_tokens: 45 },
    };
  }
}
