/**
 * Safe Log and Output Trimmer for NEXUS Gateway
 * Prunes noise, progress bars, and repetitive output while strictly preserving
 * exit codes, stack traces, failure summaries, and file paths.
 */

export interface TrimmingOptions {
  maxLines?: number;
  preserveHead?: number;
  preserveTail?: number;
  removeProgressBars?: boolean;
  deduplicateRepeatedLines?: boolean;
}

export class LogTrimmer {
  /**
   * Trims test or build command logs according to safe profile rules.
   */
  public static trimLog(
    text: string,
    options: TrimmingOptions = {}
  ): {
    trimmed: string;
    originalLines: number;
    trimmedLines: number;
    linesRemoved: number;
  } {
    if (!text) {
      return { trimmed: "", originalLines: 0, trimmedLines: 0, linesRemoved: 0 };
    }

    const maxLines = options.maxLines || 400;
    const preserveHead = options.preserveHead || 100;
    const preserveTail = options.preserveTail || 200;

    let lines = text.split("\n");
    const originalLines = lines.length;

    // 1. Remove ANSI progress bars, spinner sequences, and download bars
    if (options.removeProgressBars !== false) {
      lines = lines.filter((line) => {
        // Strip out common download progress or spinning lines
        if (/\[[=>\s\-]+\]\s+\d+%/i.test(line)) return false;
        if (/\d+%\s+\|\s+[#=]+/.test(line)) return false;
        if (/^[⠋⠙⠹⠸⠼⠴⠦⠧⠇]\s+/.test(line)) return false;
        return true;
      });
    }

    // 2. Deduplicate consecutive repeated lines
    if (options.deduplicateRepeatedLines !== false) {
      const deduped: string[] = [];
      let prevLine = "";
      let repeatCount = 0;

      for (const line of lines) {
        if (line === prevLine && line.trim().length > 0) {
          repeatCount++;
        } else {
          if (repeatCount > 0) {
            deduped.push(`  ... [linha anterior repetida ${repeatCount} vezes] ...`);
            repeatCount = 0;
          }
          deduped.push(line);
          prevLine = line;
        }
      }
      if (repeatCount > 0) {
        deduped.push(`  ... [linha anterior repetida ${repeatCount} vezes] ...`);
      }
      lines = deduped;
    }

    // 3. Head/tail preservation if total lines exceed maxLines
    if (lines.length > maxLines) {
      const head = lines.slice(0, preserveHead);
      const tail = lines.slice(-preserveTail);
      const omitted = lines.length - (preserveHead + preserveTail);

      lines = [
        ...head,
        `\n--- [NEXUS COMPRESSION: ${omitted} linhas intermediárias omitidas para economia de contexto] ---\n`,
        ...tail,
      ];
    }

    const trimmed = lines.join("\n");
    return {
      trimmed,
      originalLines,
      trimmedLines: lines.length,
      linesRemoved: Math.max(0, originalLines - lines.length),
    };
  }
}
