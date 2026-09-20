-- Existing installations fail closed if historical duplicate logical step runs exist.
CREATE UNIQUE INDEX IF NOT EXISTS idx_nexus_step_runs_unique_run_step
  ON nexus_step_runs(run_id, step_id);
