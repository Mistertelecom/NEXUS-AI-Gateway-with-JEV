import assert from "node:assert/strict";
import test from "node:test";

import { getWorkflowPreset } from "../../../src/nexus/workflows/presets/flashJevAstra";

test("workflow presets remain unavailable until persisted role selection is implemented", () => {
  // Given an arbitrary former preset identifier.
  const presetId = "preset-managed-pipeline";

  // When the workflow API attempts to resolve a built-in pipeline.
  const preset = getWorkflowPreset(presetId);

  // Then no synthetic Lead, Worker, or Reviewer model is returned.
  assert.equal(preset, null);
});
