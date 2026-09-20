# Testes e validação — NEXUS Gateway (alpha)

Os testes NEXUS existentes cobrem unidades de gateway, Jev, política e o subconjunto alpha de workflows. Eles não constituem ainda um harness ponta a ponta de implementação por LLM, clientes externos ou recuperação distribuída.

## Cobertura de workflow disponível

| Cenário                                                       | Evidência no repositório                                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Tipos de etapa sem executor falham fechados                   | `tests/nexus/workflows/engine-safety.test.ts`                                                |
| `test_runner` não marca sucesso após código de saída não zero | `tests/nexus/workflows/engine-safety.test.ts`                                                |
| DAG `input` → `output` conclui                                | `tests/nexus/workflows/engine-safety.test.ts`                                                |
| Aprovação é vinculada ao run e consumida uma vez              | `tests/nexus/workflows/approval-cas.test.ts` e `tests/nexus/workflows/engine-safety.test.ts` |
| `autoApprove: true` não cria aprovação pendente               | `tests/nexus/workflows/engine-safety.test.ts`                                                |
| Definição estrutural dos presets                              | `tests/nexus/workflows/preset.test.ts`                                                       |

Os testes de preset são estruturais: não provam que qualquer modelo foi chamado. Como os executores `llm_call` e `review` não existem, tais presets devem falhar fechados se iniciados.

## Cenários ainda ausentes

Não há atualmente testes nem implementação para reserva ou reconciliação de orçamento, retries, cancelamento, recuperação após reinício, snapshots imutáveis, edição por LLM, revisão por LLM, execução paralela ou clientes Hermes/Codex/OpenCode como fluxo integrado.

Os testes devem ser executados com o runner Node configurado pelo projeto. Para a área de workflow, comece pelos arquivos em `tests/nexus/workflows/`; depois execute as verificações de tipo, lint e formatação aplicáveis às alterações.
