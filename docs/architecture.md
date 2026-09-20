# Arquitetura — NEXUS 0.1.0-alpha.1

O NEXUS é um monólito modular com dois caminhos: gateway de inferência e executor limitado de workflows locais. Não há garantia de custo, economia, latência ou qualidade sem medição do workload real.

## Pair adaptativo

O usuário seleciona Lead e Worker no catálogo descoberto. O Lead produz um plano JSON limitado a seis etapas. JEV valida IDs, referências a etapas anteriores, limites de entrada e critérios de aceitação. Operações locais suportadas: formatação e validação JSON, ordenação de linhas e substituição literal com contagem explícita. JEV não inventa comandos executados nem alterações no repositório.

Somente geração atravessa o caminho de providers. Um Worker sem evidência de suporte a reasoning desativado é recusado para esse papel. O marcador privado do Worker impede que uma preferência global sobreponha seu contrato na fronteira de tradução testada. Risco, autenticação, baixa confiança, resposta inválida, falha ou exigência explícita acionam o Lead novamente.

Protocolos não suportados pelo Pair são identificados como fora do caminho adaptativo. O gateway comum mantém as políticas existentes sem se apresentar como execução JEV.

## Limites de módulos

`src/nexus/pairs/` coordena estágios e respostas. `src/nexus/jev/` contém contratos e operações locais. `src/nexus/compat/` isola o transporte herdado sem duplicar APIs. O caminho existente mantém fallback, circuit breaker, credenciais e compressão RTK/Caveman.

Catálogo, credenciais configuradas e verificação ao vivo são fatos diferentes. Os 359 providers catalogados não representam 359 integrações configuradas. Metadados desconhecidos de capacidade, custo ou consumo ficam ausentes.

## Workflows e runner

O motor SQLite executa somente os tipos documentados em [workflows](workflows.md). Aprovações pertencem ao run, são consumidas por CAS e não aceitam bypass automático. A combinação run/etapa é única. Leases e serialização de continuações evitam sobreposição no processo; recuperação após queda e scheduler distribuído não estão implementados.

O runner separa política de comandos, validação de caminhos e execução limitada. Não há shell nem herança de credenciais de providers. Erros não são convertidos em sucesso. Ele não é um sandbox do sistema operacional e não oferece execução arbitrária de código por agentes.

## Persistência, acesso e telemetria

O repositório contém 180 migrations. O servidor nativo usa `~/.nexus` e escuta `127.0.0.1:20129`, separado da porta 20128. A composição Docker publica somente em loopback; operação do contêiner exige validação com daemon disponível.

Toda a superfície `/api/nexus/` exige credencial válida e origem loopback confiável. Host, cabeçalhos encaminhados e endereços LAN não concedem acesso local. A opção geral de login desativado não remove essa proteção.

Tokens só são atribuídos quando fornecidos pelo provider. Operações JEV locais não são chamadas LLM. Fixtures usam banco isolado e não comprovam integração externa. A versão pública e CLI são NEXUS; compatibilidade e atribuição histórica permanecem separadas do produto.
