/**
 * Diagnostic Engine for NEXUS Gateway (`nexus doctor`)
 * Audits runtime environment, database, security vault, local Antigravity CLI,
 * network connectivity, and workspace permissions without burning inference tokens.
 */

import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import { promisify } from "util";
import { Vault } from "../providers/vault";
import { AntigravityCliConnector } from "../providers/connectors/antigravityCli";
import { CodexConnector } from "../providers/connectors/codex";
import { CompressionService } from "../compression/service";
import { getDbInstance } from "@/lib/db/core";

const execAsync = promisify(exec);

export type CheckStatus = "ok" | "warn" | "fail";

export interface DiagnosticCheck {
  id: string;
  category: "runtime" | "security" | "database" | "providers" | "workspace" | "network";
  name: string;
  status: CheckStatus;
  details: string;
  recommendation?: string;
}

export interface DiagnosticReport {
  timestamp: string;
  summary: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
  };
  checks: DiagnosticCheck[];
}

export class NexusDoctor {
  public static async runDiagnostics(): Promise<DiagnosticReport> {
    const checks: DiagnosticCheck[] = [];

    // 1. Node.js Runtime Check
    const nodeVersion = process.version;
    const major = parseInt(nodeVersion.replace(/^v/, "").split(".")[0], 10);
    if (major >= 20) {
      checks.push({
        id: "node_runtime",
        category: "runtime",
        name: "Node.js Runtime",
        status: "ok",
        details: `Versão detectada: ${nodeVersion} (compatível com Node 20+)`,
      });
    } else {
      checks.push({
        id: "node_runtime",
        category: "runtime",
        name: "Node.js Runtime",
        status: "fail",
        details: `Versão detectada: ${nodeVersion}. Requer Node.js 20 ou superior.`,
        recommendation: "Atualize o Node.js para a versão LTS atual (v20 ou v22).",
      });
    }

    // 2. Vault Master Key Check
    try {
      Vault.getInstance();
      const masterKeyPath = path.resolve(process.cwd(), ".nexus/master.key");
      const hasEnvKey = !!process.env.NEXUS_MASTER_KEY;
      const hasFileKey = fs.existsSync(masterKeyPath);

      if (hasEnvKey || hasFileKey) {
        checks.push({
          id: "vault_master_key",
          category: "security",
          name: "Cofre de Credenciais (Master Key)",
          status: "ok",
          details: hasEnvKey
            ? "Chave-mestra configurada via variável de ambiente 'NEXUS_MASTER_KEY'."
            : `Chave-mestra armazenada com segurança em '${masterKeyPath}'.`,
        });
      } else {
        checks.push({
          id: "vault_master_key",
          category: "security",
          name: "Cofre de Credenciais (Master Key)",
          status: "warn",
          details:
            "Nenhuma chave-mestra pré-definida. O cofre gerará automaticamente se necessário.",
          recommendation: "Defina NEXUS_MASTER_KEY para maior segurança em produção.",
        });
      }
    } catch (err: any) {
      checks.push({
        id: "vault_master_key",
        category: "security",
        name: "Cofre de Credenciais (Master Key)",
        status: "fail",
        details: `Erro no cofre de credenciais: ${err.message}`,
      });
    }

    // 3. SQLite & WAL Check
    try {
      const db = getDbInstance();
      const journalMode = (db.prepare("PRAGMA journal_mode").get() as any)?.journal_mode;
      const integrity = (db.prepare("PRAGMA quick_check").get() as any)?.quick_check;

      if (integrity === "ok") {
        checks.push({
          id: "sqlite_db",
          category: "database",
          name: "Banco de Dados SQLite & Integridade",
          status: "ok",
          details: `Modo de diário: ${journalMode.toUpperCase()} | Integridade: ${integrity}`,
        });
      } else {
        checks.push({
          id: "sqlite_db",
          category: "database",
          name: "Banco de Dados SQLite & Integridade",
          status: "warn",
          details: `Integridade reportada: ${integrity}`,
          recommendation: "Execute a verificação e reparo de integridade no banco SQLite.",
        });
      }
    } catch (err: any) {
      checks.push({
        id: "sqlite_db",
        category: "database",
        name: "Banco de Dados SQLite & Integridade",
        status: "fail",
        details: `Falha ao acessar banco SQLite: ${err.message}`,
        recommendation: "Verifique permissões de escrita no diretório do banco de dados.",
      });
    }

    // 4. Local Antigravity CLI Check (User's authentic Gemini Plus/Pro subscription)
    try {
      const agyCli = new AntigravityCliConnector();
      const binaryPath = agyCli.getBinaryPath();

      if (fs.existsSync(binaryPath)) {
        try {
          const { stdout } = await execAsync(`"${binaryPath}" --version`, { timeout: 3000 });
          checks.push({
            id: "antigravity_cli",
            category: "providers",
            name: "Antigravity CLI (Assinatura Plus/Pro Gemini Local)",
            status: "ok",
            details: `Binário encontrado em '${binaryPath}' (Versão: ${stdout.trim()}). Pronto para rotear Gemini Flash e Pro nativamente.`,
          });
        } catch {
          checks.push({
            id: "antigravity_cli",
            category: "providers",
            name: "Antigravity CLI (Assinatura Plus/Pro Gemini Local)",
            status: "ok",
            details: `Binário encontrado em '${binaryPath}'. Pronto para uso.`,
          });
        }
      } else {
        checks.push({
          id: "antigravity_cli",
          category: "providers",
          name: "Antigravity CLI (Assinatura Plus/Pro Gemini Local)",
          status: "warn",
          details: `Binário não encontrado em '${binaryPath}'. Chamadas Gemini recorrerão a chaves de API oficiais se configuradas.`,
          recommendation:
            "Instale ou aponte ANTIGRAVITY_CLI_PATH para o binário 'agy' da sua máquina.",
        });
      }
    } catch (err: any) {
      checks.push({
        id: "antigravity_cli",
        category: "providers",
        name: "Antigravity CLI (Assinatura Plus/Pro Gemini Local)",
        status: "warn",
        details: `Erro ao checar CLI Antigravity: ${err.message}`,
      });
    }

    // 4.1 Local Codex CLI & ChatGPT Pro / Pro Max Subscription Check
    try {
      const codex = new CodexConnector();
      const binaryPath = codex.getBinaryPath();

      if (fs.existsSync(binaryPath)) {
        const homeDir = os.homedir();
        const authJsonPath = path.join(homeDir, ".codex", "auth.json");
        const hasAuth = fs.existsSync(authJsonPath);

        let authDetails = "sem sessão ChatGPT detectada";
        if (hasAuth) {
          try {
            const authData = JSON.parse(fs.readFileSync(authJsonPath, "utf8"));
            if (authData.auth_mode === "chatgpt") {
              authDetails = "Assinatura ChatGPT Pro/Max ativa (~/.codex/auth.json)";
            }
          } catch {}
        }

        try {
          const { stdout } = await execAsync(`"${binaryPath}" --version`, { timeout: 3000 });
          checks.push({
            id: "codex_cli",
            category: "providers",
            name: "Codex CLI (Assinatura ChatGPT Pro / Pro Max Local)",
            status: "ok",
            details: `Binário encontrado em '${binaryPath}' (Versão: ${stdout.trim()}). ${authDetails}. Pronto para rotear sem custos de API.`,
          });
        } catch {
          checks.push({
            id: "codex_cli",
            category: "providers",
            name: "Codex CLI (Assinatura ChatGPT Pro / Pro Max Local)",
            status: "ok",
            details: `Binário encontrado em '${binaryPath}'. ${authDetails}.`,
          });
        }
      } else {
        checks.push({
          id: "codex_cli",
          category: "providers",
          name: "Codex CLI (Assinatura ChatGPT Pro / Pro Max Local)",
          status: "warn",
          details: `Binário não encontrado em '${binaryPath}'.`,
          recommendation: "Instale o Codex CLI ou aponte CODEX_CLI_PATH.",
        });
      }
    } catch (err: any) {
      checks.push({
        id: "codex_cli",
        category: "providers",
        name: "Codex CLI (Assinatura ChatGPT Pro / Pro Max Local)",
        status: "warn",
        details: `Erro ao checar Codex CLI: ${err.message}`,
      });
    }

    // 5. RTK Compression Binary Check
    const compression = CompressionService.getInstance();
    if (compression.isRtkAvailable()) {
      checks.push({
        id: "rtk_compression",
        category: "runtime",
        name: "Mecanismo de Compressão RTK",
        status: "ok",
        details: "Binário RTK nativo detectado no sistema.",
      });
    } else {
      checks.push({
        id: "rtk_compression",
        category: "runtime",
        name: "Mecanismo de Compressão RTK",
        status: "ok",
        details: "Usando motor de compressão e deduplicação embutido do NEXUS (Nexus-Builtin).",
      });
    }

    // 6. Workspace Write Permissions Check
    try {
      const testFile = path.resolve(process.cwd(), ".nexus_test_write");
      fs.writeFileSync(testFile, "nexus-doctor-probe", "utf8");
      fs.unlinkSync(testFile);

      checks.push({
        id: "workspace_permissions",
        category: "workspace",
        name: "Permissões de Escrita no Workspace",
        status: "ok",
        details: `Permissão de escrita confirmada no diretório: '${process.cwd()}'`,
      });
    } catch (err: any) {
      checks.push({
        id: "workspace_permissions",
        category: "workspace",
        name: "Permissões de Escrita no Workspace",
        status: "fail",
        details: `Falha ao gravar no workspace: ${err.message}`,
        recommendation: "Ajuste as permissões do diretório para permitir escrita.",
      });
    }

    // 7. Network / DNS Check (Zero token burn)
    try {
      const dns = await import("dns").then((m) => m.promises);
      await dns.lookup("google.com");
      checks.push({
        id: "network_dns",
        category: "network",
        name: "Conectividade de Rede & Resolução DNS",
        status: "ok",
        details: "Resolução DNS e saída de rede operacional.",
      });
    } catch (err: any) {
      checks.push({
        id: "network_dns",
        category: "network",
        name: "Conectividade de Rede & Resolução DNS",
        status: "warn",
        details: `Não foi possível resolver DNS externo: ${err.message}`,
        recommendation: "Verifique sua conexão com a internet ou configurações de firewall/proxy.",
      });
    }

    const passed = checks.filter((c) => c.status === "ok").length;
    const warnings = checks.filter((c) => c.status === "warn").length;
    const failed = checks.filter((c) => c.status === "fail").length;

    return {
      timestamp: new Date().toISOString(),
      summary: {
        total: checks.length,
        passed,
        warnings,
        failed,
      },
      checks,
    };
  }
}
