import type { WorkflowDefinition } from "../schema";

/**
 * Managed Lead/Worker/Reviewer pipelines need a persisted, verified role selection.
 * The alpha has no resolver for that selection, so it intentionally exposes no model preset.
 */
export function getWorkflowPreset(_id: string): WorkflowDefinition | null {
  return null;
}
