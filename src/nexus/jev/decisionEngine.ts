/**
 * NEXUS Decision Engine
 * Fuses deterministic constraints (budget, quota, account eligibility) with
 * TypeSafe Jev (System One) semantic evaluations.
 */

import { JevSemanticClassifier } from "./classifier";
import type { SemanticClassificationResult } from "./classifier";
import { JevDecisionCache, globalJevCache } from "./cache";
import { JevClient } from "./client";
import type { SystemOneResponse } from "./types";

export interface RoutingDecisionOptions {
  readonly request: string;
  readonly evidence?: string;
  readonly confidenceThreshold?: number;
  readonly policyVersion?: string;
}

export interface RoutingDecision {
  readonly confidence: number;
  readonly reasoningCategory: string;
  readonly requiresReview: boolean;
  readonly requiresHumanApproval: boolean;
  readonly fallbackApplied: boolean;
  readonly classification: SemanticClassificationResult;
  readonly estimatedCostUsd: null;
}

function parseTaskKind(value: string): SemanticClassificationResult["taskKind"] {
  switch (value) {
    case "implementation":
    case "explanation":
    case "refactor":
    case "review":
      return value;
    default:
      return "other";
  }
}

function classificationFromResponse(response: SystemOneResponse): SemanticClassificationResult {
  const taskKindAnswer = response.answers.task_kind;
  const authAnswer = response.answers.touches_auth;
  const scopeAnswer = response.answers.scope;
  const taskKind = parseTaskKind(
    taskKindAnswer?.type === "choice" ? taskKindAnswer.choice : "other"
  );
  const authProbability = authAnswer?.type === "noul" ? authAnswer.noul : 0;
  const scopeScore = scopeAnswer?.type === "score" ? scopeAnswer.score : 0;

  return {
    taskKind,
    taskKindConfidence: taskKindAnswer?.type === "choice" ? taskKindAnswer.confidence : 0,
    touchesAuth: authProbability >= 0.5,
    authProbability,
    apparentScope:
      scopeScore >= 1.5 ? "architectural" : scopeScore >= 0.6 ? "multi_component" : "localized",
    scopeConfidence: scopeAnswer?.type === "score" ? scopeAnswer.confidence : 0,
    rawResponse: response,
  };
}

export class NexusDecisionEngine {
  private classifier: JevSemanticClassifier;
  private cache: JevDecisionCache;

  constructor(client?: JevClient, cache?: JevDecisionCache) {
    this.classifier = new JevSemanticClassifier(client);
    this.cache = cache || globalJevCache;
  }

  public getMode(): "cloud_openrouter" | "cloud_typesafe" | "local_deterministic" {
    return this.classifier.getMode();
  }

  /**
   * Evaluates an incoming request and decides the best model route and review policy.
   */
  public async decideRoute(options: RoutingDecisionOptions): Promise<RoutingDecision> {
    const {
      request,
      evidence = "",
      confidenceThreshold = 0.75,
      policyVersion = "nexus-policy-2026.1",
    } = options;

    let classification: SemanticClassificationResult;
    let fallbackApplied = false;

    // 1. Cache lookup
    const cacheKey = JevDecisionCache.computeKey(
      { request, evidence },
      "classification-rubric",
      "jev-latest",
      policyVersion
    );
    const cachedResponse = this.cache.get(cacheKey);

    if (cachedResponse) {
      classification = classificationFromResponse(cachedResponse);
    } else {
      try {
        classification = await this.classifier.classifyRequest(request, evidence, {
          mockFallback: false,
        });
        if (classification.rawResponse) {
          this.cache.set(cacheKey, classification.rawResponse);
        }
      } catch {
        // Conservative deterministic fallback on Jev error/outage
        fallbackApplied = true;
        classification = {
          taskKind: "implementation",
          taskKindConfidence: 0.5, // Low confidence flags uncertainty
          touchesAuth: true, // Conservative assumption: assume security sensitive
          authProbability: 0.9,
          apparentScope: "multi_component",
          scopeConfidence: 0.5,
          rawResponse: {
            model: "deterministic-fallback",
            answers: {},
            usage: { input_tokens: 0, output_tokens: 0 },
          },
        };
      }
    }

    // JEV classifies; the persisted Pair is the sole authority for model selection.
    const requiresReview =
      classification.taskKindConfidence < confidenceThreshold ||
      classification.taskKind === "implementation" ||
      classification.taskKind === "refactor";
    const requiresHumanApproval =
      classification.apparentScope === "architectural" || classification.touchesAuth;

    return {
      confidence: classification.taskKindConfidence,
      reasoningCategory: classification.taskKind,
      requiresReview,
      requiresHumanApproval,
      fallbackApplied,
      classification,
      estimatedCostUsd: null,
    };
  }
}
