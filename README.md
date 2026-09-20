<div align="center">

# NEXUS — AI Gateway with JEV

**The AI gateway that validates before it executes.**

```text
Lead plans ──▶ JEV validates & executes local steps ──▶ Worker generates only when needed
                                                              │
                              Lead reviews only when policy requires it
```

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-0.1.0--alpha.1-orange)
![Node](https://img.shields.io/badge/node-%E2%89%A522-green)

**English** · [Português (BR)](README.pt-BR.md)

</div>

## What is NEXUS?

NEXUS is a **local-first AI control plane**. Instead of blindly forwarding your prompts to a model, NEXUS runs an adaptive pair: a **Lead** model that plans, a **JEV** execution layer that validates and runs deterministic steps locally, and a **Worker** model that is invoked _only_ when actual generation is needed.

A local operation is not a provider call and does not create token usage. Responses always expose the real execution path — you always know whether a human-planned step, a local JEV operation, or a model produced the result.

## How it works

1. **Lead plans** — produces a bounded, validated JSON plan (no free-form shell, no arbitrary code).
2. **JEV validates & executes** — runs supported deterministic text operations locally: JSON formatting and validation, line sorting, and exact literal replacement.
3. **Worker generates** — only generation steps invoke the selected Worker model. The Worker is marked internally with reasoning disabled; incompatible models and invalid results are **escalated**, never reported as success.
4. **Lead reviews** — risk, authentication-sensitive work, low confidence, invalid output, failure, or an explicit review requirement can trigger the Lead again.

## Highlights

- **359-provider engine catalog** — inherited from the OmniRoute engine; a model must still be discovered and explicitly selected before use.
- **Zero-token local steps** — JEV operations never touch a provider.
- **SQLite-persisted workflows** — DAG steps, run-scoped approvals and execution leases.
- **Hardened runner** — `execFile` with no shell, minimal environment, allowlisted commands, bounded execution/output/files, symlink-escape rejection. Human approval cannot be bypassed with `autoApprove`.
- **Loopback-only by default** — native listener on `127.0.0.1:20129`, data in `~/.nexus`.

## Quick start

```bash
npm ci
npm run dev
# Open http://127.0.0.1:20129/dashboard/nexus
```

Production mode:

```bash
npm run build
npm run start
```

CLI from source: `node bin/nexus.mjs --help`.

> An independent OmniRoute installation on port `20128` is not replaced or reconfigured.

## Security model

Every `/api/nexus/` request requires an authenticated session, management credential or validated local service credential **and** a trusted loopback peer — even when dashboard login is otherwise disabled. LAN clients and forwarded requests are not implicitly local. **Never expose this control plane as a public service.**

## Honest boundaries

- The 359-provider count is **metadata**, not 359 configured or verified connections.
- Provider-reported usage is retained only when present — unknown usage is not zero, and no savings, latency, price or success guarantee is inferred from a model name.
- A successful local mock test is not evidence that an external provider is live.
- Not implemented (yet): workflow LLM execution, autonomous edits, crash recovery, distributed heartbeats, retries, budget enforcement. Unsupported request protocols are explicitly outside the contract.

## Documentation

[NEXUS architecture](docs/nexus/README.md) · [Module boundaries](docs/architecture.md) · [Workflows](docs/workflows.md) · [Security](docs/security.md) · [Testing](docs/testing.md)

## License

MIT — NEXUS retains the MIT license and upstream attribution for the [OmniRoute](https://github.com/diegosouzapw/OmniRoute) engine. Legacy identifiers are isolated compatibility details; they do not make NEXUS an upstream release.
