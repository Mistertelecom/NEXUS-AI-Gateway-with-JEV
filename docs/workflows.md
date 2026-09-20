# Workflows — NEXUS 0.1.0-alpha.1

SQLite persiste definições, runs, etapas e aprovações. Tipos executáveis: `input`, `jev_eval`, `tool_exec`, `test_runner`, `human_approval` e `output`.

Tipos `llm_call`, `agent_task`, `review`, `rule`, `condition`, `parallel` e `join` não possuem executor nesta alpha. Não são aceitos no schema público; valores legados também são rejeitados. Presets dependentes deles permanecem indisponíveis. O Pair adaptativo de chat é separado: não é um executor de edição de arquivos por workflow.

## Comandos estruturados

Um comando permitido tem a forma:

```json
{ "executable": "node", "args": ["--version"] }
```

O runner permite somente a consulta de versão do Node e vetores exatos de consulta Git: commit, branch, status porcelain, diff, diff staged, diff stat e diff check, com os argumentos de segurança de `src/nexus/runner/commandPolicy.ts`. Strings de shell, scripts npm arbitrários, pipes e redirecionamentos são rejeitados. O nome `test_runner` não significa que qualquer suíte possa ser executada.

O workspace deve existir, ser absoluto e resolver dentro das raízes autorizadas. O padrão é `NEXUS_WORKSPACE_ROOT`, quando definido, ou o diretório de trabalho do servidor. Symlinks e hard links são rejeitados nas operações de arquivo. Redirecionamentos Git não são autorizados. Escritas exigem diretórios-pai existentes.

A execução usa `execFile` sem shell, ambiente mínimo sem credenciais de providers, timeout padrão de 60 segundos e saída limitada a 1 MiB. Timeout retorna 124; excesso de saída retorna 125; outros códigos de saída são preservados. Arquivos são limitados a 1 MiB por padrão. Isto não é um sandbox do sistema operacional nem protege contra toda corrida causada por um processo hostil no mesmo host.

## Aprovação e concorrência

Cada aprovação pertence a um run e uma etapa. Somente a primeira decisão pendente é consumida por CAS. Uma decisão para outro run ou já consumida não autoriza continuação. `autoApprove` não dispensa decisão humana.

A restrição única run/etapa mantém uma linha lógica por execução de etapa. Um lease temporário impede passagens concorrentes. A continuação de uma aprovação imediata aguarda a passagem anterior liberar seu lease. Não há heartbeat distribuído, retomada após reinício nem garantia exatamente-uma-vez de efeitos externos.

DAGs vazios, ciclos, IDs duplicados e dependências inexistentes são rejeitados. Retry e orçamento de tokens ainda não são aplicados e não podem ser solicitados como se estivessem disponíveis. Condições usam o avaliador restrito existente.

## Segurança e medição

Toda a API NEXUS exige autenticação e origem loopback confiável, mesmo com a opção geral de login desativada. A ausência de provider configurado não gera tokens, aprovação ou sucesso de LLM. Saídas e códigos de retorno são evidências reais. Um snapshot Git que falha não pode ser apresentado como workspace limpo; um snapshot observado não é congelamento imutável de arquivos.
