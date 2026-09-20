-- 182_nexus_workflows.sql: Persistent SQLite storage for NEXUS Gateway workflows, runs, steps and approvals
CREATE TABLE IF NOT EXISTS nexus_workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT 'nexus.workflow/v1',
  definition TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS nexus_workflow_runs (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  status TEXT NOT NULL,
  inputs TEXT,
  outputs TEXT,
  current_step_id TEXT,
  lease_owner TEXT,
  lease_expires_at TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  total_tokens_used TEXT,
  error TEXT,
  FOREIGN KEY (workflow_id) REFERENCES nexus_workflows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nexus_step_runs (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  inputs TEXT,
  outputs TEXT,
  tokens_used TEXT,
  error TEXT,
  started_at TEXT,
  completed_at TEXT,
  UNIQUE(run_id, step_id),
  FOREIGN KEY (run_id) REFERENCES nexus_workflow_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nexus_approvals (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data TEXT,
  status TEXT NOT NULL,
  feedback TEXT,
  created_at TEXT NOT NULL,
  responded_at TEXT,
  FOREIGN KEY (run_id) REFERENCES nexus_workflow_runs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_nexus_workflow_runs_status ON nexus_workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_nexus_step_runs_run_id ON nexus_step_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_nexus_approvals_run_status ON nexus_approvals(run_id, status);
