# Mapa de Reaproveitamento e Limitações — NEXUS Gateway

**Data de verificação:** 18 de setembro de 2026  
**Commit base OmniRoute:** `4d1282be3161ad265695bab5a4f0f2eca9561fd9`  
**Licença base:** MIT

Este documento mapeia os módulos reaproveitados do fork modular do OmniRoute, as lacunas técnicas identificadas e a arquitetura de extensão limpa implementada pelo **NEXUS Gateway**.

---

## 1. Módulos Reaproveitados e Justificativa

| Módulo Reaproveitado              | Localização Original             | Rationale e Papel no NEXUS                                                                                                                                                                                             | Adaptações Realizadas                                                                                                                                |
| :-------------------------------- | :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Executores de Inferência**      | `open-sse/executors/`            | Despacho HTTP otimizado para provedores com streaming SSE nativo, retentativas, backoff exponencial e tratamento de sinais de cancelamento (`mergeAbortSignals`).                                                      | Preservado como motor de baixo nível para envio de requisições a provedores oficiais (OpenRouter, Google Gemini API, OpenAI, etc.).                  |
| **Tradutores de Protocolo**       | `open-sse/translator/`           | Conversão bidirecional canônica entre formatos OpenAI, Claude Messages, Gemini Content e OpenAI Responses API.                                                                                                         | Reaproveitado integralmente para normalização de tool calls, blocos de conteúdo e streaming de eventos sem retrabalho.                               |
| **Serviços de Compressão**        | `open-sse/services/compression/` | Filtros de preservação de fidelidade (`preservation.ts`), heurísticas de token (`fidelityGate.ts`), deduplicação e resumo seguro.                                                                                      | Integrado com a nova camada de perfis do NEXUS (`off`, `safe`, `balanced`, `experimental`), distinguindo execuções de terminal no runner do gateway. |
| **Fábrica de Modelos Virtuais**   | `open-sse/services/autoCombo/`   | Estrutura de roteamento multi-fator (`autoCombo`), seleção por latência, custo e capacidades de modelo.                                                                                                                | Estendido pelos aliases lógicos do NEXUS (`nexus/auto`, `nexus/flash-jev`, `nexus/code-review`, `nexus/economy`).                                    |
| **Banco de Dados e Persistência** | `src/lib/db/`                    | Singleton SQLite com WAL journaling (`core.ts`), migrações idempotentes (`migrations/`), criptografia de campos AES-256-GCM (`encryption.ts`), afinidade de sessão (`sessionAccountAffinity.ts`) e controle de quotas. | Reaproveitado como fonte única de verdade no modo local. Tabelas do motor de workflow e cofre do NEXUS adicionadas via novas migrações SQL.          |
| **Cofre e Criptografia**          | `src/lib/db/encryption.ts`       | Criptografia autenticada AES-256-GCM com salt estático e proteção contra truncamento de authTag.                                                                                                                       | Expandido para suporte à chave-mestra externa (`NEXUS_MASTER_KEY`) e isolamento por workspace.                                                       |
| **Dashboard e Frontend**          | `src/app/(dashboard)/`           | Estrutura Next.js 16 App Router com tema claro/escuro, componentes Tailwind/Radix UI e navegação responsiva.                                                                                                           | Adicionadas páginas operacionais dedicadas em PT-BR para workflows, linha do tempo de execuções, Jev e diagnósticos.                                 |

---

## 2. Limitações Identificadas na Base Reaproveitada

1. **Ausência de Motor de Workflows Persistente com Checkpoints:**
   - O OmniRoute original foi concebido primariamente como proxy/router reativo (requisição -> resposta). Ele não possuía um escalonador de etapas assíncronas persistente, capaz de pausar para aprovação humana, retomar após reinício de processo ou controlar transações de longa duração em workspaces locais.
2. **Ausência de Suporte a Modelos de Decisão Rápida (System One):**
   - O roteamento original dependia de heurísticas estatísticas ou LLMs generativas lentas para classificação de complexidade. Não havia suporte para modelos probabilísticos estreitos como o TypeSafe Jev.
3. **Falta de Runner Gerenciado para Edição e Testes em Arquivos Locais:**
   - O modo gateway tradicional não executa comandos de shell (`npm test`, `git diff`, linters) nem manipula workspaces de projetos com isolamento.
4. **Ausência de Geradores de Configuração Nativos para Hermes, Codex e OpenCode:**
   - Os clientes precisavam ser configurados manualmente pelos usuários, gerando atrito e erros de sintaxe nos arquivos `config.yaml`, `config.toml` e `opencode.json`.

---

## 3. Decisões de Arquitetura e Extensões NEXUS

Para sanar as limitações sem desestabilizar os componentes herdados, toda a nova lógica do NEXUS foi estruturada de forma modular:

```
src/nexus/
├── jev/                  # Integração com TypeSafe Jev (System One)
│   ├── client.ts         # Cliente tipado @typesafe-ai/sdk + HTTP fallback
│   ├── guardrails.ts     # Limites de tokens (64k/32k), literalness, anti-adversarial
│   ├── classifier.ts     # Perguntas semânticas atômicas (choice, score, noul)
│   ├── decisionEngine.ts # Fusão de regras determinísticas + Jev
│   └── cache.ts          # Cache escopado de decisões
├── providers/            # Provedores e Gestão de Contas
│   ├── types.ts          # ModelProvider vs AgentRuntime
│   ├── vault.ts          # Cofre AES-256-GCM com NEXUS_MASTER_KEY
│   ├── ssrf.ts           # Proteção contra SSRF e DNS rebinding
│   ├── connectors/       # Conectores OpenRouter, Gemini, Codex, OpenCode, Claude
│   └── aliases.ts        # Resolução de aliases virtuais (nexus/*)
├── gateway/              # Gateway Transparente
│   ├── normalizer.ts     # Modelo interno canônico de mensagens
│   ├── loopProtection.ts # Header X-Nexus-Hop-Count e prevenção de loops
│   └── sessionManager.ts # Afinidade de sessão estável
├── clients/              # Geradores de Configuração
│   ├── configGenerators.ts # Hermes (YAML), Codex (TOML), OpenCode (JSON)
│   └── backupRestore.ts    # Backup automático e restauração segura
├── workflows/            # Motor Persistente de Workflows
│   ├── schema.ts         # Schema versionado (nexus.workflow/v1)
│   ├── evaluator.ts      # Avaliador seguro de condições (sem eval())
│   ├── engine.ts         # DAG engine, leases, heartbeats, checkpoints SQLite
│   └── presets/          # Preset Flash + Jev implementa, Astra revisa
├── runner/               # Runner de Execução Gerenciada
│   ├── managedRunner.ts  # Execução de comandos no workspace, testes, linters
│   └── snapshot.ts       # Congelamento de snapshots (git diff/commits)
├── compression/          # Compressão Adaptativa e Telemetria
│   ├── service.ts        # Perfis off, safe, balanced, experimental
│   └── logTrimmer.ts     # Trimming inteligente de logs de build/testes
└── doctor/               # Diagnóstico de Infraestrutura
    └── diagnose.ts       # nexus doctor (sem consumo de tokens)
```
