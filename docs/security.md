# Segurança e Isolamento — NEXUS Gateway

O **NEXUS Gateway** foi projetado para operar em ambientes corporativos e self-hosted, adotando uma postura de segurança em profundidade (_defense-in-depth_).

---

## 1. Gestão de Credenciais e Cofre Criptográfico

### 1.1 Criptografia em Repouso (AES-256-GCM)

- Todas as chaves de API de provedores upstream, tokens de autenticação e segredos de ambiente são cifrados no banco de dados SQLite utilizando o algoritmo **AES-256-GCM** (Authenticated Encryption).
- Cada registro possui seu próprio vetor de inicialização (IV) de 16 bytes gerado aleatoriamente e tag de autenticação de 16 bytes.
- Tags truncadas são rejeitadas imediatamente na descriptografia, prevenindo ataques de falsificação de integridade.

### 1.2 Chave-Mestra Externa (`NEXUS_MASTER_KEY`)

- A chave de criptografia do cofre é derivada de uma chave-mestra externa ao banco de dados, configurada através da variável de ambiente `NEXUS_MASTER_KEY`.
- Na ausência da variável, o sistema gera uma chave criptográfica forte (32 bytes / 256 bits) persistida em `.nexus/master.key` com permissões restritas de arquivo (`0600`).
- A chave-mestra **nunca** é gravada no banco de dados SQLite nem exposta em endpoints de API.

### 1.3 Redação Estrita de Segredos

- Filtros de redação em múltiplos níveis garantem que credenciais e tokens não apareçam em:
  - Registros de log do sistema (Pino logger).
  - Mensagens ou pilhas de erro retornadas para clientes HTTP ou streams SSE.
  - Estado exposto no frontend / dashboard web.
  - Contexto e prompts enviados para modelos de linguagem.

---

## 2. Controle de Acesso Baseado em Papéis (RBAC) e Chaves de API

O acesso administrativo ao NEXUS é segmentado em três papéis:

- **`owner`**: Controle total da instância, gerenciamento de operadores, visualização de diagnósticos, aprovação de execução de comandos em workspaces e rotação da chave-mestra.
- **`operator`**: Gerenciamento de provedores, criação e disparo de workflows, inspeção de telemetria e aprovação de etapas em pipelines.
- **`viewer`**: Consulta somente-leitura a dashboards, métricas de consumo e status de execuções.

Chaves de API emitidas pelo NEXUS para clientes externos (Hermes, Codex, OpenCode) são persistidas em hash criptográfico (SHA-256) com prefixo legível (ex: `nx-live-...`) e escopos granulares de permissão.

---

## 3. Prevenção de SSRF e Proteção de Saída de Rede

Ao permitir o cadastro de provedores customizados com URLs base arbitrárias, o gateway aplica proteção rigorosa contra Server-Side Request Forgery (SSRF) e ataques de DNS Rebinding:

1. **Bloqueio de Redes Privadas e Especiais:**
   - Requisições para endereços IPv4 e IPv6 das seguintes faixas são bloqueadas antes do envio:
     - Loopback: `127.0.0.0/8`, `::1`
     - RFC 1918 (Redes Privadas): `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
     - Link-Local: `169.254.0.0/16`, `fe80::/10`
     - CGNAT e Reservados: `100.64.0.0/10`, `0.0.0.0/8`
2. **Proteção contra DNS Rebinding:**
   - A resolução DNS é inspecionada no momento da conexão para garantir que um hostname público não resolva para um IP privado local.
3. **Allowlist Administrativa:**
   - Provedores locais legítimos (ex: Ollama ou vLLM rodando no host) só podem ser contatados caso sejam cadastrados formalmente na lista de permissões administrativas pelo `owner`.

---

## 4. Isolamento de Workspaces e Segurança do Runner

1. **Validação de Fronteiras de Caminho:**
   - Operações em workspaces no modo gerenciado exigem caminho absoluto previamente autorizado.
   - Tentativas de evasão de diretório via traversal (`../`, links simbólicos externos) são validadas e barradas antes de qualquer operação de leitura ou escrita.
2. **Separação de Privilégios e Sandboxing:**
   - O runner executa comandos de shell (como `npm test` ou linters) em subprocessos com timeouts rígidos, sem elevação de privilégios e sem montagem de sockets privilegiados (como o socket do Docker do host).
3. **Imutabilidade de Snapshots na Revisão:**
   - A análise de código feita por revisores (como o GPT Astra) opera sobre o diff ou commit temporário fixado. O código em análise não pode ser modificado concorrentemente durante o processo de revisão.
