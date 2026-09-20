import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { JevGuardrails } from "../../../src/nexus/jev/guardrails";
import { JevSemanticClassifier } from "../../../src/nexus/jev/classifier";

describe("TypeSafe Jev — System One Guardrails & Classifier", () => {
  test("enforces total token and state ceilings (64k / 32k)", () => {
    // Normal size passes
    const valid = JevGuardrails.validatePayload("short state", {
      q1: {
        type: "choice",
        instructions: "Escolha uma categoria",
        criteria: { a: "A", b: "B" },
      },
    });
    assert.equal(valid.valid, true);

    // Giant state exceeding 32k tokens (~130k chars)
    const giantState = "x".repeat(150000);
    const invalid = JevGuardrails.validatePayload(giantState, {
      q1: {
        type: "choice",
        instructions: "Pergunta",
        criteria: { a: "A", b: "B" },
      },
    });
    assert.equal(invalid.valid, false);
    assert.ok(invalid.errors.some((e) => e.includes("tokens")));
  });

  test("blocks arithmetic and code generation requests directed to Jev", () => {
    const mathCheck = JevGuardrails.isProhibitedJevTask("Quanto é 2548 * 842?");
    assert.equal(mathCheck.prohibited, true);

    const codeGenCheck = JevGuardrails.isProhibitedJevTask(
      "Escreva uma função em Python para calcular fibonacci"
    );
    assert.equal(codeGenCheck.prohibited, true);

    const validSemantic = JevGuardrails.isProhibitedJevTask(
      "Classifique a categoria desta tarefa de desenvolvimento"
    );
    assert.equal(validSemantic.prohibited, false);
  });

  test("classifies requests semantically in mock fallback mode", async () => {
    const classifier = new JevSemanticClassifier();
    const result = await classifier.classifyRequest(
      "Implementar rota de login com JWT e validação de senha",
      undefined,
      { mockFallback: true }
    );

    assert.ok(
      ["implementation", "refactor", "review", "explanation", "other"].includes(result.taskKind)
    );
    assert.equal(typeof result.touchesAuth, "boolean");
    assert.ok(["localized", "multi_component", "architectural"].includes(result.apparentScope));
  });
});
