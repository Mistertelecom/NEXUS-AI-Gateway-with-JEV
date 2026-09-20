import assert from "node:assert/strict";
import test from "node:test";

import {
  JevGuardrailError,
  JevGuardrails,
  validatePayload,
} from "../../../src/nexus/jev/guardrails";
import type { SystemOnePayload } from "../../../src/nexus/jev/types";

const questions: SystemOnePayload["questions"] = {
  eligible: { type: "noul", instructions: "The candidate meets the supplied requirements." },
};

test("content-only guardrails keep their model-free compatibility contract", () => {
  // Given local content validation before a provider model has been selected.
  const state: SystemOnePayload["state"] = { candidate: "ready" };
  // When using the public content-only helper.
  const result = JevGuardrails.validatePayload(state, questions);
  // Then valid content does not require a fabricated provider model.
  assert.deepEqual(result, { valid: true, errors: [] });
});

test("full-payload guardrails still accept the explicitly selected provider model", () => {
  // Given a complete request with a caller-selected model.
  const payload: SystemOnePayload = { model: "jev-1.13", state: "ready", questions };
  // When checking the complete outgoing request.
  const validate = () => validatePayload(payload);
  // Then the HTTP payload contract remains supported.
  assert.doesNotThrow(validate);
});

test("full-payload validation retains the missing-state rejection after sharing content checks", () => {
  // Given a model but no usable state.
  const payload: SystemOnePayload = { model: "jev-1.13", state: null, questions };
  // When checking the outgoing request.
  const validate = () => validatePayload(payload);
  // Then a supplied model cannot bypass the content guardrail.
  assert.throws(
    validate,
    (error: unknown) => error instanceof JevGuardrailError && error.code === "MISSING_STATE"
  );
});

test("content-only validation retains the missing-state rejection", () => {
  // Given no usable state in the compatibility interface.
  // When checking the same content without transport metadata.
  const result = JevGuardrails.validatePayload(null, questions);
  // Then content validation still fails through the nonthrowing interface.
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
});
