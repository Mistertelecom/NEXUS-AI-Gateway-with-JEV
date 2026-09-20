import { getDbInstance } from "./core";
import type { WorkflowDefinition } from "@/nexus/workflows/schema";

export function upsertWorkflow(workflow: WorkflowDefinition): void {
  const now = new Date().toISOString();
  getDbInstance()
    .prepare(
      `INSERT INTO nexus_workflows (id, name, description, version, definition, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name, description = excluded.description, version = excluded.version,
         definition = excluded.definition, updated_at = excluded.updated_at`
    )
    .run(
      workflow.id,
      workflow.name,
      workflow.description || null,
      workflow.schemaVersion,
      JSON.stringify(workflow),
      workflow.createdAt || now,
      now
    );
}

export function getWorkflow(id: string): WorkflowDefinition | null {
  const row = getDbInstance()
    .prepare("SELECT definition FROM nexus_workflows WHERE id = ?")
    .get(id) as { definition?: string } | undefined;
  return row?.definition ? JSON.parse(row.definition) : null;
}

export function listWorkflows(): WorkflowDefinition[] {
  const rows = getDbInstance()
    .prepare("SELECT definition FROM nexus_workflows ORDER BY updated_at DESC")
    .all() as { definition: string }[];
  return rows.map((row) => JSON.parse(row.definition));
}

export function deleteWorkflow(id: string): boolean {
  return getDbInstance().prepare("DELETE FROM nexus_workflows WHERE id = ?").run(id).changes > 0;
}
