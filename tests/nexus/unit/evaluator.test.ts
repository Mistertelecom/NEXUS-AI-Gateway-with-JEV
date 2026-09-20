import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SafeConditionEvaluator } from "../../../src/nexus/workflows/evaluator";

describe("NEXUS SafeConditionEvaluator (Zero Eval AST)", () => {
  test("evaluates simple boolean and equality expressions", () => {
    assert.equal(SafeConditionEvaluator.evaluate("true == true"), true);
    assert.equal(SafeConditionEvaluator.evaluate("true == false"), false);
    assert.equal(SafeConditionEvaluator.evaluate("10 > 5"), true);
    assert.equal(SafeConditionEvaluator.evaluate("10 <= 5"), false);
  });

  test("evaluates context identifiers and nested member expressions", () => {
    const context = {
      inputs: { auto_approve: true, count: 42 },
      steps: {
        test_runner: { outputs: { exitCode: 0 } },
        jev_eval: { outputs: { touches_auth: false, confidence: 0.95 } },
      },
    };

    assert.equal(
      SafeConditionEvaluator.evaluate("steps.test_runner.outputs.exitCode == 0", context),
      true
    );

    assert.equal(
      SafeConditionEvaluator.evaluate(
        "steps.jev_eval.outputs.touches_auth == false && steps.jev_eval.outputs.confidence >= 0.90",
        context
      ),
      true
    );

    assert.equal(SafeConditionEvaluator.evaluate("inputs.auto_approve == true", context), true);

    assert.equal(SafeConditionEvaluator.evaluate("inputs.count < 10", context), false);
  });

  test("handles empty and missing conditions gracefully", () => {
    assert.equal(SafeConditionEvaluator.evaluate(""), true);
    assert.equal(SafeConditionEvaluator.evaluate(undefined), true);
  });

  test("returns false safely on syntax or parse errors without throwing", () => {
    assert.equal(SafeConditionEvaluator.evaluate("invalid === syntax"), false);
  });
});
