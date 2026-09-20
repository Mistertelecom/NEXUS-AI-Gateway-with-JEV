/**
 * Compression Service for NEXUS Gateway
 * Reduces token consumption with strict technical integrity.
 * Supports profiles: `off`, `safe`, `balanced`, `experimental`.
 * Detects native RTK binary when available, falling back to built-in AST/log trimming.
 */

import { execSync } from "child_process";
import { LogTrimmer } from "./logTrimmer";

export type CompressionProfile =
  "off" | "safe" | "balanced" | "caveman" | "headroom" | "omniglyph" | "experimental";

export interface CompressionResult {
  text: string;
  originalTokensEstimated: number;
  compressedTokensEstimated: number;
  savingsRatio: number;
  profileUsed: CompressionProfile;
  engineUsed:
    "native-rtk" | "nexus-caveman" | "nexus-headroom" | "nexus-omniglyph" | "nexus-builtin";
}

export class CompressionService {
  private static instance: CompressionService;
  private hasNativeRtk: boolean = false;
  private rtkPath?: string;

  private constructor() {
    this.detectRtkBinary();
  }

  public static getInstance(): CompressionService {
    if (!CompressionService.instance) {
      CompressionService.instance = new CompressionService();
    }
    return CompressionService.instance;
  }

  private detectRtkBinary(): void {
    try {
      const out = execSync("which rtk 2>/dev/null", { encoding: "utf8" }).trim();
      if (out) {
        this.hasNativeRtk = true;
        this.rtkPath = out;
      }
    } catch {
      this.hasNativeRtk = false;
    }
  }

  public isRtkAvailable(): boolean {
    return this.hasNativeRtk;
  }

  /**
   * Estimates token count (approx. 4 characters per token).
   */
  public estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  /**
   * Compresses content based on type and profile.
   */
  public compress(
    text: string,
    type: "log" | "diff" | "text" = "log",
    profile: CompressionProfile = "safe"
  ): CompressionResult {
    if (profile === "off" || !text) {
      const tokens = this.estimateTokens(text);
      return {
        text,
        originalTokensEstimated: tokens,
        compressedTokensEstimated: tokens,
        savingsRatio: 0,
        profileUsed: "off",
        engineUsed: "nexus-builtin",
      };
    }

    const originalTokens = this.estimateTokens(text);
    let compressedText = text;
    let engineUsed: CompressionResult["engineUsed"] = this.hasNativeRtk
      ? "native-rtk"
      : "nexus-builtin";

    if (profile === "caveman") {
      engineUsed = "nexus-caveman";
      // Apply Caveman semantic token pruning (removes filler, polite framing, hedging)
      compressedText = compressedText
        .replace(
          /\b(could you please|would you please|can you please|i would like you to|please|kindly)\b/gi,
          ""
        )
        .replace(/\b(make sure to|be sure to|it is important to|remember to)\b/gi, "")
        .replace(/\b(due to the fact that|the reason is because)\b/gi, "because")
        .replace(/\b(it seems like|it appears that|i think that|i believe that)\b/gi, "")
        .replace(/\b(as we discussed earlier|as mentioned before|as previously stated)\b/gi, "")
        .replace(/\b(furthermore|additionally|moreover|in addition)\b/gi, "")
        .replace(/\b(is being used|was created|was implemented)\b/gi, "used")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
    } else if (profile === "omniglyph") {
      engineUsed = "nexus-omniglyph";
      // High-density whitespace and redundant comment compaction
      compressedText = compressedText
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    } else if (profile === "headroom" || type === "log") {
      engineUsed = "nexus-headroom";
      let maxLines = 400;
      let preserveHead = 100;
      let preserveTail = 200;

      if (profile === "balanced" || profile === "headroom") {
        maxLines = 200;
        preserveHead = 50;
        preserveTail = 100;
      } else if (profile === "experimental") {
        maxLines = 100;
        preserveHead = 20;
        preserveTail = 50;
      }

      const { trimmed } = LogTrimmer.trimLog(compressedText, {
        maxLines,
        preserveHead,
        preserveTail,
        removeProgressBars: true,
        deduplicateRepeatedLines: true,
      });

      compressedText = trimmed;
    } else if (type === "diff") {
      // For diffs, avoid aggressive trimming to prevent patch corruptions
      if (profile === "balanced" || profile === "experimental") {
        compressedText = text.replace(
          /GIT binary patch[\s\S]*?literal \d+/g,
          "GIT binary patch [conteúdo binário omitido pelo NEXUS Gateway]"
        );
      }
    }

    const compressedTokens = this.estimateTokens(compressedText);
    const savingsRatio =
      originalTokens > 0 ? Math.max(0, (originalTokens - compressedTokens) / originalTokens) : 0;

    return {
      text: compressedText,
      originalTokensEstimated: originalTokens,
      compressedTokensEstimated: compressedTokens,
      savingsRatio: Math.round(savingsRatio * 100) / 100,
      profileUsed: profile,
      engineUsed,
    };
  }
}
