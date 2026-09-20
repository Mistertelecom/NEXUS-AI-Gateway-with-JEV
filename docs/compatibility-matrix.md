# Matriz de Compatibilidade — NEXUS Gateway

**Data de atualização:** 18 de setembro de 2026

Esta matriz separa compatibilidade herdada, integração NEXUS e verificação ao vivo. A presença
de um provedor no catálogo não prova que uma credencial, modelo ou assinatura específica esteja
disponível. O painel só marca uma conexão como verificada depois de um teste real solicitado pelo
operador.

---

## 1. Matriz de Clientes e Ferramentas de IA

| Cliente / Ferramenta            | Protocolo Utilizado                              | Arquivo de Configuração Gerado     | Suporte a Streaming | Suporte a Ferramentas (Tools) | Situação Operacional                                              |
| :------------------------------ | :----------------------------------------------- | :--------------------------------- | :-----------------: | :---------------------------: | :---------------------------------------------------------------- |
| **Hermes Agent**                | OpenAI Chat Completions (`/v1/chat/completions`) | `~/.hermes/config.yaml`            |       Herdado       |            Herdado            | Gerador alpha; requer Pair salvo e teste local.                   |
| **OpenAI Codex**                | OpenAI Responses API (`/v1/responses`)           | `~/.codex/config.toml`             |       Herdado       |            Herdado            | Gerador alpha; requer Pair salvo e teste local.                   |
| **OpenCode**                    | OpenAI Chat Completions (`/v1/chat/completions`) | `~/.config/opencode/opencode.json` |       Herdado       |            Herdado            | Gerador alpha; requer Pair salvo e teste local.                   |
| **Claude Code**                 | Anthropic Messages API (`/v1/messages`)          | Não gerado pelo NEXUS alpha        |       Herdado       |            Herdado            | Catálogo herdado; sem fluxo NEXUS dedicado validado nesta versão. |
| **VS Code / Cursor / Windsurf** | OpenAI Compatible (`/v1/chat/completions`)       | Não gerado pelo NEXUS alpha        |       Herdado       |            Herdado            | Use um modelo ou Pair realmente persistido no catálogo.           |

---

## 2. Matriz de Provedores e Backends

| Provedor              | Modalidade           | Protocolo Upstream     | Descoberta Dinâmica | Autenticação                | Situação Contratual / Status                                                                               |
| :-------------------- | :------------------- | :--------------------- | :-----------------: | :-------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **TypeSafe JEV**      | Decisão (System One) | SDK / HTTP             |         Não         | API Key Bearer              | Cliente implementado; sem credencial opera apenas nas regras locais; verificação ao vivo depende da conta. |
| **OpenRouter**        | Inferência LLM       | OpenAI compatível      |       Herdada       | API Key Bearer              | Catálogo e executor herdados; disponibilidade é medida por conexão.                                        |
| **Google Gemini**     | Inferência LLM       | Google GenAI           |       Herdada       | Google API Key              | Catálogo e executor herdados; o NEXUS não presume versões futuras de modelos.                              |
| **Antigravity local** | CLI local            | Processo local         |         Não         | Login do CLI                | Opcional e estritamente local; só é marcado disponível quando o binário existe e executa.                  |
| **OpenAI**            | Inferência LLM       | Chat / Responses       |       Herdada       | API Key / conexões herdadas | Catálogo e executor herdados; modelos elegíveis vêm da descoberta real.                                    |
| **Anthropic**         | Inferência LLM       | Messages               |       Herdada       | API Key / cloud autorizado  | Catálogo e executor herdados; modelos elegíveis vêm da descoberta real.                                    |
| **OpenCode**          | Inferência de código | Conector local/API     | Conector específico | Configuração do operador    | Integração alpha; precisa de teste real antes do roteamento.                                               |
| **Custom Provider**   | Inferência LLM       | Compatível configurado |      Opcional       | Configuração do operador    | Conector não é anunciado como pronto sem registro, teste e política de egress aplicável.                   |
