# Pesquisa Técnica e Revalidação — NEXUS Gateway

**Data de verificação:** 18 de setembro de 2026  
**Status:** Concluído e revalidado

Este documento registra a pesquisa aprofundada de código, documentação, contratos e termos de licença e conformidade exigida para a concepção e implementação do **NEXUS Gateway**.

---

## 1. Repositórios Avaliados e Revalidados

| Repositório         | Repositório Remoto            | Commit SHA Avaliado                                 | Data do Commit | Licença    | Decisão de Integração                                                                                                                                                                                             |
| :------------------ | :---------------------------- | :-------------------------------------------------- | :------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **OmniRoute**       | `diegosouzapw/OmniRoute`      | `4d1282be3161ad265695bab5a4f0f2eca9561fd9`          | 18/09/2026     | MIT        | **Base do Fork Modular:** Utilizado como núcleo para infraestrutura de streaming SSE, tradução de protocolos, compressão adaptativa, persistência SQLite/WAL e dashboard Next.js.                                 |
| **CLIProxyAPI**     | `router-for-me/CLIProxyAPI`   | `05391d7b72cb09bc6a7087a57f58ba9a58b963ff`          | 18/09/2026     | MIT        | **Referência de Interoperabilidade:** Avaliado para padrões de compatibilidade entre clientes. Não utilizado como proxy adicional para evitar empilhamento desnecessário e duplicação de funções.                 |
| **RTK Original**    | `rtk-ai/rtk`                  | `6d104308c56c0a51250f8a200e5056787128fb65`          | 18/09/2026     | Apache-2.0 | **Referência de Compressão de Terminal:** Implementado em Rust. O NEXUS diferencia explicitamente o binário nativo executado no runner/cliente do motor de compressão baseado em TypeScript integrado no gateway. |
| **TypeSafe SDK JS** | `typesafe-ai/typesafe-sdk-js` | `66880ccded6cb642dc1809620c2b108c33730214` (v0.6.0) | 15/09/2026     | MIT        | **SDK Oficial Utilizado:** Adotado `@typesafe-ai/sdk` v0.6.0 para integração tipada com o Jev (System One), além de cliente HTTP resiliente de fallback.                                                          |
| **Hermes Agent**    | `NousResearch/hermes-agent`   | `1e4952ddba1bc585416ad43438d60183380035cd`          | 18/09/2026     | MIT        | **Cliente e Runtime Suportado:** Análise da especificação de `config.yaml`, `.env`, e endpoints auxiliares (vision, delegation) para geração de configuração e integração de execução.                            |
| **Codex**           | `openai/codex`                | `7498521d288b9b3b96ffba4eedf089d8d6e06a84`          | 18/09/2026     | Apache-2.0 | **Cliente e App Server:** Suporte dual: geração de `config.toml` compatível com protocolo Responses (`wire_api = "responses"`) e integração com Codex App Server (JSON-RPC) para execução pessoal autorizada.     |
| **OpenCode**        | `anomalyco/opencode`          | `5f9d9187c01708b4e700c9c81c1045ab482bf31d`          | 18/09/2026     | MIT        | **Cliente e Provedor OpenCode Go:** Mapeamento de `opencode.json` (schema v2), envio de `x-opencode-session` estável por conversa e workspace, e identificação com User-Agent autêntico.                          |
| **LLMLingua**       | `microsoft/LLMLingua`         | `5a4c78ae18ab17a98cf997e8259354e546081d64`          | 10/09/2026     | MIT        | **Compressão Experimental Opt-in:** Documentado como alternativa experimental; mantido fora do pipeline padrão para evitar degradação de exatidão de código e JSON.                                               |

---

## 2. Documentação Oficial e Diretrizes Técnicas

### 2.1 TypeSafe Jev / System One

Fontes: `https://docs.typesafe.ai/llms.txt`, `https://docs.typesafe.ai/api`, `https://docs.typesafe.ai/model-jaggedness/jev-1.13`

- **Endpoint HTTP oficial:** `POST https://api.typesafe.ai/v1/systemone`
- **Autenticação:** `Authorization: Bearer <API_KEY>`
- **Modelo de referência:** `jev-latest` (ou versões calibradas como `jev-1.13`)
- **Primitivas Fundamentais:**
  1. **Choice:** Seleção entre opções mutuamente exclusivas. Retorna a opção vencedora (`choice`), distribuição de probabilidades (`probabilities`) e métrica de certeza (`confidence`).
  2. **Score:** Avaliação sobre uma escala ordenada discreta (mínimo 2 níveis). Retorna valor ponderado contínuo (`score`), mapa de legendas (`legend`), probabilidades por nível (`probabilities`) e certeza (`confidence`).
  3. **Noul:** Julgamento binário (afirmação verdadeira ou falsa). Retorna probabilidade escalar entre `0.0` e `1.0` (`noul`). **Não** possui campo de confiança separado.
- **Limites e Fragilidades Estruturais (Jev 1.13 Jaggedness):**
  - **Contexto máximo:** 64.000 tokens totais; 32.000 tokens para o campo `state` somado à maior pergunta.
  - **Leitura literal estrita:** Jev responde estritamente ao que está escrito nas instruções e critérios, sem inferência de intenções ocultas.
  - **Incapacidade matemática e contagem:** Jev **não** conta palavras, tokens ou itens de lista com precisão e não calcula interpolações numéricas. Cálculos devem ser feitos exclusivamente em código determinístico.
  - **Incapacidade de comparação de datas/horas:** Jev lê datas como texto, não como grandezas ordenadas. Ordenação e janelas temporais devem ser tratadas em código.
  - **Sem geração de texto:** Jev **não** deve ser usado para gerar código, explicações discursivas ou resumos livres.
  - **Sensibilidade a distrações em `state` volumoso:** Enviar grandes volumes de código ou logs irrelevantes degrada acurácia. O estado deve ser pré-filtrado antes do envio.
  - **Ausência de invariância estrutural:** As probabilidades de uma pergunta afirmativa e de sua negação não somam necessariamente 1.0 (ex: `P(refund) + P(not_refund) != 1.0`). Thresholds devem ser calibrados individualmente.

### 2.2 Nous Research Hermes Agent

Fontes: `https://hermes-agent.nousresearch.com/docs/user-guide/configuration/`

- Configuração centralizada em `~/.hermes/config.yaml` e segredos em `~/.hermes/.env`.
- Suporte a modelos primários via `model: <provider>/<model_id>`.
- Configuração de endpoints auxiliares (`auxiliary.vision`, `auxiliary.delegation`, `auxiliary.reasoning`) com chaves dedicadas e base URLs.
- Banco de dados de estado SQLite (`state.db`) com modo padrão WAL.

### 2.3 OpenAI Codex

Fontes: `https://developers.openai.com/codex/app-server`, `https://developers.openai.com/codex/auth`, `https://developers.openai.com/codex/config-advanced`

- **Codex App Server:** Servidor local que executa a lógica do agente e se comunica via JSON-RPC. Usado para execução nativa autorizada com as credenciais locais do usuário.
- **Configuração de Provedor de Modelo (`config.toml`):**
  - Seção `[model_providers.<nome>]` com campos: `base_url`, `env_key`, `wire_api = "responses"`, e `env_http_headers`.
  - Separação estrita entre o fluxo de assinatura pessoal e chaves de API faturadas por uso.

### 2.4 OpenCode

Fontes: `https://opencode.ai/docs/providers/`, `https://opencode.ai/docs/go/`, `specs/v2/config.md`

- Configuração unificada em `opencode.json` ou `opencode.jsonc`.
- Suporte a múltiplos provedores em bloco `providers`.
- **OpenCode Go:** Endpoint oficial do serviço para modelos de código abertos com autenticação por chave de API.
- **Requisitos de Cabeçalhos:**
  - Header `x-opencode-session`: Identificador estável por sessão de conversa, associado ao namespace do workspace.
  - User-Agent autêntico: Proibição de falsificar outros clientes; identificação clara como `NEXUS-Gateway/1.0`.

### 2.5 Google Gemini API vs Google AI Pro / Antigravity

Fontes: `https://ai.google.dev/gemini-api/`, `https://antigravity.google/terms`, `https://antigravity.google/docs/plans`

- **Google Gemini API Oficial:** Acesso legítimo, documentado e faturado por uso via Google AI Studio / Vertex AI, com chave de API oficial (`GEMINI_API_KEY`). Descoberta de modelos suportados por conta via `v1beta/models`.
- **Google AI Pro / Antigravity:** Os termos de serviço proíbem categoricamente o acesso ou intermediação do serviço por software de terceiros ou automações externas, inclusive por meio de emulação de tokens OAuth do Antigravity.
- **Decisão NEXUS:** Não fornecer botões de login OAuth falsos ou wrappers enganosos. O conector Antigravity permanece com status `restricted`, com aviso educativo explícito ao operador e direcionamento para a API oficial do Gemini.

### 2.6 Anthropic Claude Code

Fontes: `https://code.claude.com/docs/en/authentication`, `https://code.claude.com/docs/en/legal-and-compliance`

- O binário nativo do Claude Code opera com login próprio do usuário Anthropic ou `ANTHROPIC_API_KEY`.
- É estritamente vedado coletar, armazenar ou intermediar tokens web de contas Claude.ai para retransmissão a terceiros.
- Para inferência através do gateway NEXUS, utilizam-se chaves de API oficiais Anthropic ou provedores compatíveis (como Bedrock/Vertex).
