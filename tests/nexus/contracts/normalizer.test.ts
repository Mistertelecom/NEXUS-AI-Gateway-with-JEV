import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ProtocolNormalizer } from "../../../src/nexus/gateway/normalizer";

describe("NEXUS ProtocolNormalizer (Contract Validation)", () => {
  test("normalizes valid OpenAI chat completion request into canonical representation", () => {
    const raw = {
      model: "nexus/flash-jev",
      messages: [
        { role: "system", content: "You are an assistant." },
        { role: "user", content: "Implement a feature" },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    };

    const res = ProtocolNormalizer.normalizeOpenAiRequest(raw);
    assert.equal(res.valid, true);
    assert.equal(res.canonical?.model, "nexus/flash-jev");
    assert.equal(res.canonical?.messages.length, 2);
    assert.equal(res.canonical?.messages[0].role, "system");
  });

  test("rejects request missing required fields", () => {
    const missingModel = {
      messages: [{ role: "user", content: "hi" }],
    };
    const res1 = ProtocolNormalizer.normalizeOpenAiRequest(missingModel);
    assert.equal(res1.valid, false);
    assert.ok(res1.errors.some((e) => e.includes("model")));

    const missingMessages = {
      model: "nexus/auto",
    };
    const res2 = ProtocolNormalizer.normalizeOpenAiRequest(missingMessages);
    assert.equal(res2.valid, false);
    assert.ok(res2.errors.some((e) => e.includes("messages")));
  });

  test("strictly rejects unsupported parameters instead of silent dropping", () => {
    // n > 1
    const nGreater = {
      model: "nexus/auto",
      messages: [{ role: "user", content: "hi" }],
      n: 3,
    };
    const resN = ProtocolNormalizer.normalizeOpenAiRequest(nGreater);
    assert.equal(resN.valid, false);
    assert.ok(resN.errors.some((e) => e.includes("n > 1")));

    // logit_bias
    const logitBias = {
      model: "nexus/auto",
      messages: [{ role: "user", content: "hi" }],
      logit_bias: { "50256": -100 },
    };
    const resLogit = ProtocolNormalizer.normalizeOpenAiRequest(logitBias);
    assert.equal(resLogit.valid, false);
    assert.ok(resLogit.errors.some((e) => e.includes("logit_bias")));
  });
});
