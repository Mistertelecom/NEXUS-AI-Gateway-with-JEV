import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { LogTrimmer } from "../../../src/nexus/compression/logTrimmer";
import { CompressionService } from "../../../src/nexus/compression/service";

describe("NEXUS Compression Engine", () => {
  test("removes progress bars and download meters", () => {
    const rawLog = [
      "Starting build...",
      "[==========>         ] 45%",
      "[===================>] 100%",
      "Build completed successfully.",
    ].join("\n");

    const { trimmed, linesRemoved } = LogTrimmer.trimLog(rawLog, {
      removeProgressBars: true,
    });

    assert.equal(linesRemoved, 2);
    assert.ok(!trimmed.includes("45%"));
    assert.ok(trimmed.includes("Build completed successfully."));
  });

  test("deduplicates consecutive identical lines", () => {
    const rawLog = [
      "Running health checks...",
      "Waiting for socket connection...",
      "Waiting for socket connection...",
      "Waiting for socket connection...",
      "Connected!",
    ].join("\n");

    const { trimmed } = LogTrimmer.trimLog(rawLog, {
      deduplicateRepeatedLines: true,
    });

    assert.ok(trimmed.includes("linha anterior repetida 2 vezes"));
    assert.ok(trimmed.includes("Connected!"));
  });

  test("CompressionService handles profiles and estimates savings", () => {
    const service = CompressionService.getInstance();
    const rawText = "A".repeat(2000);

    // Profile off leaves text untouched
    const offResult = service.compress(rawText, "text", "off");
    assert.equal(offResult.savingsRatio, 0);
    assert.equal(offResult.text, rawText);

    // RTK engine status is populated
    assert.ok(["native-rtk", "nexus-builtin"].includes(offResult.engineUsed));
  });

  test("CompressionService applies Caveman semantic pruning", () => {
    const service = CompressionService.getInstance();
    const verbosePrompt =
      "Could you please make sure to implement the authentication because it seems like it is important.";
    const result = service.compress(verbosePrompt, "text", "caveman");

    assert.equal(result.profileUsed, "caveman");
    assert.equal(result.engineUsed, "nexus-caveman");
    assert.ok(!result.text.includes("Could you please"));
    assert.ok(!result.text.includes("make sure to"));
    assert.ok(!result.text.includes("it seems like"));
    assert.ok(result.text.includes("implement"));
    assert.ok(result.savingsRatio > 0);
  });

  test("CompressionService applies OmniGlyph whitespace and comment compaction", () => {
    const service = CompressionService.getInstance();
    const commentedCode = `
      // Single line comment
      /* Multi line
         comment here */
      function executeTask() {
        return true;
      }
    `;
    const result = service.compress(commentedCode, "text", "omniglyph");

    assert.equal(result.profileUsed, "omniglyph");
    assert.equal(result.engineUsed, "nexus-omniglyph");
    assert.ok(!result.text.includes("Single line comment"));
    assert.ok(!result.text.includes("Multi line"));
    assert.ok(result.text.includes("function executeTask()"));
  });
});
