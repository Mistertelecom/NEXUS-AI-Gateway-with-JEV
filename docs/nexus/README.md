# NEXUS adaptive control plane

Product version: **0.1.0-alpha.1**. Native endpoint: **127.0.0.1:20129**.

## Adaptive algorithm

The user selects both models from the discovered catalog. The Lead interprets the request and returns a typed plan, limited to six steps, with risk, scope, confidence, acceptance criteria and a review flag. Invalid plans do not authorize arbitrary execution.

JEV validates the plan and applies deterministic execution policy. Local steps support JSON formatting, JSON validation, line sorting and literal replacement with an exact expected occurrence count. Inputs are limited to 16,000 characters and outputs to 64,000 characters. Local steps cannot read files, edit a repository or execute shell commands. Generation steps invoke the selected Worker through the existing provider/combo engine.

Worker requests carry a private internal stage marker. Global reasoning budgets and routing directives cannot override the disabled reasoning policy at the tested translation boundary. A Worker model whose provider contract requires positive reasoning is not eligible. Unexpected reasoning in the response, truncation and acceptance failures escalate the result rather than being declared successful.

The Lead returns only for required review: risk, security sensitivity, low confidence, explicit review or failed/invalid execution. A protocol not handled by the adaptive path is reported as outside that path; it is not silently certified as JEV execution.

## Integration boundaries

`src/nexus/pairs/` owns the adaptive flow; `src/nexus/jev/` owns typed local operations and decisions. `src/nexus/compat/` wraps the inherited provider engine instead of creating an alternate transport. The existing engine retains credentials, circuit breakers, fallback, protocol translation and compression.

The 359 providers in the engine catalog are metadata. Discovery, configuration and live verification are separate states. NEXUS does not bundle a Lead or Worker, invent future model names, assume account entitlements or infer zero API costs from a subscription.

## Persistence and measurements

Workflows persist in SQLite with a unique logical step per run, CAS approval decisions bound to the run ID, and execution leases. A continuation after human approval waits for the previous in-process pass to release its lease. These are not distributed exactly-once semantics or automatic crash recovery.

A local result contains actual deterministic output, without invented provider usage. Only real provider calls may enter provider-call telemetry; a test fixture must use an isolated test database. Provider token fields are absent when not supplied. Final-stage response usage does not claim to include every Lead/Worker stage.

## Alpha operations

Follow the root [README](../../README.md) for source installation, port and validation commands. The public command is `nexus`; automatic updates are disabled. Legacy environment compatibility is centralized in `bin/cli/nexusEnvironment.mjs`; the data directory is separate from other installations.

All NEXUS control API routes require authentication and strict loopback locality, regardless of the general login preference. Workflows execute only the subset documented in [workflows](../workflows.md). The bounded runner is not an OS sandbox; trusted roots and a trusted host remain prerequisites.

## Attribution

The inherited OmniRoute engine retains its MIT license and attribution. Historical engine versions describe provenance only, never the NEXUS product version. See [LICENSE](../../LICENSE).
