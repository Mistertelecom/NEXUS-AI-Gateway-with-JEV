# Provedores, Assinaturas e Autenticação — NEXUS Gateway

O **NEXUS Gateway** estabelece transparência total sobre a procedência, os limites técnicos e a situação jurídica de cada conexão upstream.

---

## 1. Separação de Interfaces

O gateway diferencia formalmente duas naturezas de integração:

1. **`ModelProvider` (Inferência):**
   Fornece acesso a endpoints HTTP de modelos de linguagem para geração de texto, chamadas de ferramentas e embeddings (ex: OpenRouter, Google Gemini API, OpenAI API).
2. **`AgentRuntime` (Execução de Agente):**
   Ambiente local ou remoto que executa um loop autônomo de raciocínio e ferramentas com acesso ao workspace (ex: Hermes Agent, Codex App Server, OpenCode CLI, Claude Code CLI).

Uma conta ou credencial pode fornecer apenas uma dessas modalidades.

---

## 2. Máquina de Estados de Conectores

Cada conector de provedor reporta um estado explícito no catálogo e na interface:

| Estado            | Significado Técnico                                                  | Comportamento do Gateway                                   |
| :---------------- | :------------------------------------------------------------------- | :--------------------------------------------------------- |
| **`catalogued`**  | O provider existe no catálogo herdado.                               | Ainda não prova credencial nem disponibilidade.            |
| **`configured`**  | Há configuração detectada para ao menos uma conexão.                 | Aguarda teste real ou primeira chamada válida.             |
| **`ready`**       | A conexão está habilitada e não está em cooldown/bloqueio conhecido. | Elegível conforme política, sem prometer sucesso upstream. |
| **`verified`**    | Um teste explícito retornou sucesso e registrou evidência recente.   | A evidência pode expirar; não é garantia permanente.       |
| **`unavailable`** | Binário, credencial ou dependência exigida não está disponível.      | Não é selecionado até nova configuração/verificação.       |

---

## 3. Políticas Específicas por Provedor

### 3.1 OpenRouter

- **Autenticação:** Chave de API Bearer.
- **Descoberta:** Consulta dinâmica a `https://openrouter.ai/api/v1/models`.
- **Governança:** Respeita rigorosamente preferências de privacidade (`no-log`, `data-collection: deny`) e restrições de provedores configuradas pelo usuário.

### 3.2 Google Gemini API

- **Autenticação:** Chave de API oficial (`GEMINI_API_KEY`) via Google AI Studio ou Vertex AI.
- **Descoberta:** Consulta dinâmica a `v1beta/models` por conta.
- **Separação:** Não presume que um modelo disponível na API pública esteja automaticamente acessível em contas de assinatura pessoal, e vice-versa.

### 3.3 Antigravity local

- **Escopo:** conector opcional para um CLI já instalado e autenticado pelo próprio operador.
- **Comportamento NEXUS:** a interface só o marca disponível quando o binário local existe; chamadas de
  teste falham explicitamente quando o processo não executa. O NEXUS não transforma assinatura pessoal
  em chave de API nem afirma compatibilidade contratual em nome do fornecedor.

### 3.4 OpenAI Codex / ChatGPT

- **Execução Nativa:** o catálogo herdado pode usar integrações locais já configuradas; o NEXUS alpha
  não afirma uma sessão Codex ativa sem verificação real.
- **Cliente do Gateway:** O binário do Codex consome o NEXUS Gateway através da API Responses (`wire_api = "responses"`).
- **API OpenAI:** Chamadas diretas faturadas por token utilizam chaves de API padrão (`OPENAI_API_KEY`). Não há exportação de tokens de sessão da web como se fossem chaves de API universais.

### 3.5 Anthropic Claude Code

- **Execução Nativa:** o catálogo pode detectar integrações locais configuradas pelo operador; a versão
  alpha não marca o runtime como disponível antes de um teste real.
- **Gateway de Inferência:** Para rotear tráfego para a Anthropic, o gateway consome exclusivamente chaves de API oficiais (`ANTHROPIC_API_KEY`) ou instâncias cloud autorizadas (AWS Bedrock / GCP Vertex).
- **Conformidade:** O sistema nunca coleta, armazena ou intermedeia tokens de sessão `claude.ai` nem oferece fluxos de login não documentados.

### 3.6 OpenCode Go

- **Autenticação:** Chave de API oficial por modelo.
- **Identificação e Sessão:** Preserva e injeta o header obrigatório `x-opencode-session` com identificador estável por conversa e namespace pelo workspace.
- **User-Agent:** Utiliza identificação própria do NEXUS, sem se apresentar como outro cliente.

### 3.7 Provedor Customizado (OpenAI / Anthropic / Gemini compatível)

- Permite configurar `baseURL` e credencial arbitrária.
- **Validação de Egress (SSRF):** Bloqueio estrito de endereços de rede local (RFC 1918), loopback (`127.0.0.1`, `localhost`, `::1`) e link-local (`169.254.x.x`), impedindo que o gateway seja usado como vetor de ataque contra a infraestrutura interna do host. Provedores locais exigem cadastro explícito em allowlist administrativa.

---

## 4. Gestão Multi-Conta e Falhas de Autenticação

1. **Afinidade por Sessão:**
   - Para manter coerência de cache de contexto e conversação, requisições da mesma sessão priorizam a mesma conta/conexão que iniciou o diálogo.
2. **Rotação Transparente:**
   - A rotação de contas é permitida para balanceamento de carga e distribuição de cotas legítimas. **Nunca** é utilizada como subterfúgio para contornar bloqueios, banimentos ou violações de termos.
3. **Distinção de Erros:**
   - **Falhas de Autenticação (`401`, `403` terminal):** Marcam a conta como `needs_credentials` e alertam o operador imediatamente.
   - **Indisponibilidade Temporária (`408`, `429`, `500`, `502`, `503`, `504`):** Acionam cooldown temporário da conexão ou circuit breaker do provedor, sem invalidar as credenciais.
