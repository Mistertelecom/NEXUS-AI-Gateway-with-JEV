// Benchmark de Escrita de Código: Gemini 3.8 Flash Puro vs NEXUS Híbrido (TypeSafe JEV Cloud + Gemini)
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OMNIROUTE_URL = "http://127.0.0.1:20128/v1/chat/completions";

const SYSTEM_PROMPT = `Você é um Engenheiro de Software Sênior especialista em TypeScript e sistemas distribuídos de alta resiliência.
Responda fornecendo código TypeScript limpo, modular, fortemente tipado e pronto para produção, contido em um único bloco de código markdown (\`\`\`typescript ... \`\`\`).
O código deve ser estritamente executável sem dependências externas (use apenas módulos nativos do Node.js: 'node:crypto', 'node:events', etc.).`;

const USER_TASK_PROMPT = `Construa um serviço completo de Livro-Razão e Transferência de Pagamentos com Idempotência e Auditoria Criptográfica chamado 'PaymentLedgerService'.

Requisitos Obrigatórios:
1. Modelos e Interfaces TypeScript:
   - Account: { id: string, name: string, balance: number, dailyLimit: number, dailySpent: number }
   - Transaction: { id: string, fromAccountId: string, toAccountId: string, amount: number, timestamp: number, idempotencyKey: string, status: 'completed' | 'failed', error?: string }
   - AuditEntry: { index: number, txId: string, prevHash: string, hash: string, timestamp: number }

2. Classe PaymentLedgerService com os seguintes métodos:
   - createAccount(id: string, name: string, initialBalance: number, dailyLimit: number): Account
   - getAccount(id: string): Account | undefined
   - transfer(fromId: string, toId: string, amount: number, idempotencyKey: string): { success: boolean, transaction: Transaction }
     * Regras:
       - Se a idempotencyKey já tiver sido processada com sucesso, retorne a transação anterior sem duplicar débito/crédito.
       - Valide se as contas de origem e destino existem.
       - Valide se amount > 0.
       - Valide se fromId tem saldo suficiente (balance >= amount).
       - Valide se amount + dailySpent <= dailyLimit.
       - Realize o débito da origem e crédito no destino atomicamente.
       - Atualize dailySpent na conta de origem.
       - Crie uma AuditEntry no encadeamento de hash SHA-256 (hash = sha256(index + txId + prevHash + timestamp)).
   - verifyAuditIntegrity(): boolean
     * Recalcula os hashes de toda a cadeia a partir do hash gênese '0'. Se qualquer transação for adulterada, retorna false.

Forneça a implementação completa com export da classe PaymentLedgerService.`;

async function callModel(modelId, label) {
  console.log(`\n⏳ Disparando benchmark para: ${label} (${modelId})...`);
  const t0 = Date.now();

  const res = await fetch(OMNIROUTE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_TASK_PROMPT },
      ],
      temperature: 0.1,
      stream: false,
    }),
  });

  const latencyMs = Date.now() - t0;
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status} de ${modelId}: ${errText.slice(0, 200)}`);
  }

  // Headers de telemetria do NEXUS
  const jevUsed = res.headers.get("x-nexus-jev-used");
  const jevTask = res.headers.get("x-nexus-jev-task");
  const jevConfidence = res.headers.get("x-nexus-jev-confidence");
  const jevLatency = res.headers.get("x-nexus-jev-latency-ms");

  const data = await res.json();
  const choice = data.choices?.[0]?.message?.content || "";
  const usage = data.usage || {};

  return {
    label,
    modelId,
    latencyMs,
    content: choice,
    usage: {
      input_tokens: usage.prompt_tokens || 0,
      output_tokens: usage.completion_tokens || 0,
      total_tokens: usage.total_tokens || 0,
    },
    jevTelemetry: jevUsed
      ? {
          taskKind: jevTask,
          confidence: Number(jevConfidence) || 0,
          latencyMs: Number(jevLatency) || 0,
        }
      : null,
  };
}

function extractCodeBlock(text) {
  const match = text.match(/```(?:typescript|ts|javascript|js)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

async function runTestBattery(code, label) {
  const testScript = `
${code}

// --- SUÍTE DE TESTES AUTOMATIZADOS DO BENCHMARK ---
const assert = (cond, msg) => { if (!cond) throw new Error("FALHA: " + msg); };

let passed = 0;
let total = 6;
const report = [];

try {
  const ledger = new PaymentLedgerService();

  // Teste 1: Criação de Contas
  ledger.createAccount("acc-1", "Alice", 1000, 500);
  ledger.createAccount("acc-2", "Bob", 200, 300);
  const a1 = ledger.getAccount("acc-1");
  const a2 = ledger.getAccount("acc-2");
  assert(a1 && a1.balance === 1000, "Saldo inicial de Alice incorreto");
  assert(a2 && a2.balance === 200, "Saldo inicial de Bob incorreto");
  passed++;
  report.push("✓ Teste 1: Criação de contas e saldos iniciais");

  // Teste 2: Transferência Válida
  const r1 = ledger.transfer("acc-1", "acc-2", 300, "idem-key-1");
  assert(r1.success === true, "Transferência válida retornou false");
  assert(ledger.getAccount("acc-1").balance === 700, "Saldo pós-débito incorreto (esperado 700)");
  assert(ledger.getAccount("acc-2").balance === 500, "Saldo pós-crédito incorreto (esperado 500)");
  assert(ledger.getAccount("acc-1").dailySpent === 300, "Daily spent incorreto");
  passed++;
  report.push("✓ Teste 2: Transferência válida com débito/crédito atômico");

  // Teste 3: Rejeição por Limite Diário
  const rLimit = ledger.transfer("acc-1", "acc-2", 250, "idem-key-2");
  assert(rLimit.success === false, "Deveria ter rejeitado transferência acima do limite diário (300 + 250 > 500)");
  assert(ledger.getAccount("acc-1").balance === 700, "Saldo não deveria mudar após rejeição de limite");
  passed++;
  report.push("✓ Teste 3: Bloqueio correto por limite diário excedido");

  // Teste 4: Rejeição por Saldo Insuficiente
  ledger.createAccount("acc-3", "Carol", 50, 1000);
  const rBalance = ledger.transfer("acc-3", "acc-2", 100, "idem-key-3");
  assert(rBalance.success === false, "Deveria rejeitar por saldo insuficiente");
  passed++;
  report.push("✓ Teste 4: Bloqueio correto por saldo insuficiente");

  // Teste 5: Idempotência Estrita
  const rDuplicate = ledger.transfer("acc-1", "acc-2", 300, "idem-key-1");
  assert(rDuplicate.success === true, "Reenvio de idempotência deveria retornar sucesso");
  assert(ledger.getAccount("acc-1").balance === 700, "Idempotência FALHOU: debitou duas vezes com a mesma chave!");
  assert(ledger.getAccount("acc-2").balance === 500, "Idempotência FALHOU: creditou duas vezes com a mesma chave!");
  passed++;
  report.push("✓ Teste 5: Idempotência perfeita (não duplica cobrança)");

  // Teste 6: Auditoria Criptográfica SHA-256
  const isChainValid = ledger.verifyAuditIntegrity();
  assert(isChainValid === true, "Integridade da cadeia de auditoria SHA-256 falhou!");
  passed++;
  report.push("✓ Teste 6: Cadeia de blocos de auditoria SHA-256 100% íntegra");

} catch (err) {
  report.push("✗ Erro no teste: " + err.message);
}

console.log(JSON.stringify({ passed, total, score: Math.round((passed / total) * 100), report }));
`;

  const tmpFile = path.join("/tmp", `eval_${label.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.ts`);
  fs.writeFileSync(tmpFile, testScript);

  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--import", "tsx/esm", tmpFile], {
      timeout: 12000,
      cwd: process.cwd(),
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));

    child.on("close", (code) => {
      try {
        fs.unlinkSync(tmpFile);
      } catch {}
      if (code === 0 && stdout.includes("{")) {
        try {
          const jsonStart = stdout.indexOf("{");
          const res = JSON.parse(stdout.slice(jsonStart));
          return resolve(res);
        } catch {}
      }
      resolve({
        passed: 0,
        total: 6,
        score: 0,
        report: [`Erro de execução ou compilação: ${stderr || stdout}`],
      });
    });

    child.on("error", (err) => {
      try {
        fs.unlinkSync(tmpFile);
      } catch {}
      resolve({ passed: 0, total: 6, score: 0, report: [err.message] });
    });
  });
}

async function main() {
  console.log("================================================================================");
  console.log("🚀 INICIANDO BENCHMARK REAL DE CÓDIGO: GEMINI 3.8 FLASH PURO vs HÍBRIDO NEXUS");
  console.log("Tarefa: Desenvolver PaymentLedgerService com Idempotência e Auditoria SHA-256");
  console.log("================================================================================");

  // 1. Executa Gemini 3.8 Flash Puro
  const pureResult = await callModel("antigravity/gemini-3.8-flash-low", "Gemini 3.8 Flash Puro");
  const pureCode = extractCodeBlock(pureResult.content);
  console.log(
    `✓ Gemini Puro concluiu em ${pureResult.latencyMs}ms | Tokens: ${pureResult.usage.total_tokens}`
  );

  // 2. Executa NEXUS Híbrido (TypeSafe JEV Cloud + Gemini 3.8 Flash)
  const hybridResult = await callModel("nexus/flash-jev", "NEXUS Híbrido (JEV + Gemini)");
  const hybridCode = extractCodeBlock(hybridResult.content);
  console.log(
    `✓ NEXUS Híbrido concluiu em ${hybridResult.latencyMs}ms | Tokens: ${hybridResult.usage.total_tokens}`
  );
  if (hybridResult.jevTelemetry) {
    console.log(
      `  └─ JEV Decisão Semântica: kind=${hybridResult.jevTelemetry.taskKind}, confiança=${(hybridResult.jevTelemetry.confidence * 100).toFixed(0)}%, latência JEV=${hybridResult.jevTelemetry.latencyMs}ms`
    );
  }

  // 3. Executa bateria de testes unitários para validar a qualidade do código
  console.log("\n🧪 Executando bateria de testes automatizados de conformidade...");
  const pureEval = await runTestBattery(pureCode, "pure");
  const hybridEval = await runTestBattery(hybridCode, "hybrid");

  console.log("\n================================================================================");
  console.log("📊 RESULTADO FINAL DO BENCHMARK DE CÓDIGO");
  console.log("================================================================================\n");

  const summary = {
    pure: {
      label: "Gemini 3.8 Flash Puro",
      latencyMs: pureResult.latencyMs,
      tokensIn: pureResult.usage.input_tokens,
      tokensOut: pureResult.usage.output_tokens,
      totalTokens: pureResult.usage.total_tokens,
      codeLines: pureCode.split("\n").length,
      unitTestsPassed: `${pureEval.passed}/${pureEval.total}`,
      testScore: `${pureEval.score}%`,
      testReport: pureEval.report,
    },
    hybrid: {
      label: "NEXUS Híbrido (JEV Cloud + Gemini)",
      latencyMs: hybridResult.latencyMs,
      tokensIn: hybridResult.usage.input_tokens,
      tokensOut: hybridResult.usage.output_tokens,
      totalTokens: hybridResult.usage.total_tokens,
      codeLines: hybridCode.split("\n").length,
      jevClassification: hybridResult.jevTelemetry,
      unitTestsPassed: `${hybridEval.passed}/${hybridEval.total}`,
      testScore: `${hybridEval.score}%`,
      testReport: hybridEval.report,
    },
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
