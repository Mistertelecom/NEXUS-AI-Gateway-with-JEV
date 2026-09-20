<div align="center">

# NEXUS — AI Gateway with JEV

**O gateway de IA que valida antes de executar.**

```text
Lead planeja ──▶ JEV valida e executa etapas locais ──▶ Worker gera só quando necessário
                                                              │
                              Lead revisa apenas quando a política exige
```

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-0.1.0--alpha.1-orange)
![Node](https://img.shields.io/badge/node-%E2%89%A522-green)

[English](README.md) · **Português (BR)**

</div>

## O que é o NEXUS?

O NEXUS é um **control plane de IA local-first**. Em vez de encaminhar seu prompt cegamente para um modelo, o NEXUS executa um par adaptativo: um modelo **Lead** que planeja, uma camada de execução **JEV** que valida e roda etapas determinísticas localmente, e um modelo **Worker** acionado _apenas_ quando há geração de verdade.

Uma operação local não é uma chamada de provedor e não gera consumo de tokens. As respostas sempre expõem o caminho de execução real — você sempre sabe se o resultado veio de uma etapa planejada, de uma operação local do JEV ou de um modelo.

## Como funciona

1. **Lead planeja** — produz um plano JSON limitado e validado (sem shell livre, sem código arbitrário).
2. **JEV valida e executa** — roda localmente as operações determinísticas de texto suportadas: formatação e validação de JSON, ordenação de linhas e substituição literal exata.
3. **Worker gera** — apenas etapas de geração invocam o Worker selecionado. O Worker é marcado internamente com reasoning desabilitado; modelos incompatíveis e resultados inválidos são **escalados**, nunca reportados como sucesso.
4. **Lead revisa** — risco, trabalho sensível a autenticação, baixa confiança, saída inválida, falha ou exigência explícita de revisão podem reacionar o Lead.

## Destaques

- **Catálogo com 359 provedores** — herdado do motor OmniRoute; um modelo ainda precisa ser descoberto e selecionado explicitamente antes do uso.
- **Etapas locais sem consumir tokens** — operações JEV nunca tocam um provedor.
- **Workflows persistidos em SQLite** — etapas DAG, aprovações por execução e leases de execução.
- **Runner endurecido** — `execFile` sem shell, ambiente mínimo, comandos de allowlist, limites de execução/saída/arquivos, rejeição de escape por symlink. Aprovação humana não pode ser burlada com `autoApprove`.
- **Loopback por padrão** — listener nativo em `127.0.0.1:20129`, dados em `~/.nexus`.

## Início rápido

```bash
npm ci
npm run dev
# Abra http://127.0.0.1:20129/dashboard/nexus
```

Modo produção:

```bash
npm run build
npm run start
```

CLI a partir do fonte: `node bin/nexus.mjs --help`.

> Uma instalação independente do OmniRoute na porta `20128` não é substituída nem reconfigurada.

## Modelo de segurança

Toda requisição a `/api/nexus/` exige sessão autenticada, credencial de gerenciamento ou credencial local de serviço validada **e** um peer loopback confiável — mesmo com o login do dashboard desabilitado. Clientes LAN e requisições encaminhadas não são implicitamente locais. **Nunca exponha este control plane como serviço público.**

## Limites honestos

- A contagem de 359 provedores é **metadado**, não 359 conexões configuradas ou verificadas.
- Uso reportado pelo provedor só é retido quando existe — uso desconhecido não é zero, e nenhuma garantia de economia, latência, preço ou sucesso é inferida de um nome de modelo.
- Um teste local com mock bem-sucedido não é evidência de que um provedor externo está ativo.
- Ainda não implementado: execução LLM em workflows, edições autônomas, recuperação de crash, heartbeats distribuídos, retries, orçamento. Protocolos não suportados ficam explicitamente fora do contrato.

## Documentação

[Arquitetura NEXUS](docs/nexus/README.md) · [Fronteiras de módulos](docs/architecture.md) · [Workflows](docs/workflows.md) · [Segurança](docs/security.md) · [Testes](docs/testing.md)

## Licença

MIT — o NEXUS mantém a licença MIT e a atribuição upstream do motor [OmniRoute](https://github.com/diegosouzapw/OmniRoute). Identificadores legados são detalhes isolados de compatibilidade; não tornam o NEXUS um release upstream.
