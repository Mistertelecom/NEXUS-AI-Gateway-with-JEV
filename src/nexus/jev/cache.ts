/**
 * Scoped Decision Cache for TypeSafe Jev
 * Keys include state hash, criteria hash, model, and policy version.
 */

import { createHash } from "crypto";
import { SystemOneResponse } from "./types";

interface CacheEntry {
  response: SystemOneResponse;
  expiresAt: number;
}

export class JevDecisionCache {
  private cache = new Map<string, CacheEntry>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs: number = 60 * 60 * 1000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  public static computeKey(
    state: unknown,
    criteria: unknown,
    model: string,
    policyVersion: string = "v1"
  ): string {
    const raw = JSON.stringify({ state, criteria, model, policyVersion });
    return createHash("sha256").update(raw).digest("hex");
  }

  public get(key: string): SystemOneResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.response;
  }

  public set(key: string, response: SystemOneResponse, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs || this.defaultTtlMs);
    this.cache.set(key, { response, expiresAt });
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const globalJevCache = new JevDecisionCache();
