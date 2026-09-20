"use client";

import { useEffect, useState } from "react";
import { Laptop, Copy, Check, Save, FileCode } from "lucide-react";

type NexusClient = "hermes" | "codex" | "opencode";

function readStringField(value: unknown, field: string): string | undefined {
  if (typeof value !== "object" || value === null || !(field in value)) return undefined;
  const candidate = Reflect.get(value, field);
  return typeof candidate === "string" ? candidate : undefined;
}

function readBooleanField(value: unknown, field: string): boolean {
  if (typeof value !== "object" || value === null || !(field in value)) return false;
  return Reflect.get(value, field) === true;
}

async function requestConfig(client: NexusClient): Promise<string> {
  const response = await fetch("/api/nexus/clients/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client }),
  });
  const data: unknown = await response.json();
  return readStringField(data, "content") ?? "";
}

export default function NexusClientsPage() {
  const [selectedClient, setSelectedClient] = useState<NexusClient>("hermes");
  const [configContent, setConfigContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void requestConfig(selectedClient)
      .then((content) => {
        if (active) setConfigContent(content);
      })
      .catch((error: unknown) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedClient]);

  const selectClient = (client: NexusClient) => {
    setLoading(true);
    setSavedMessage(null);
    setSelectedClient(client);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(configContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDisk = async () => {
    try {
      const targetPath =
        selectedClient === "hermes"
          ? "config.yaml"
          : selectedClient === "codex"
            ? "config.toml"
            : "opencode.json";

      const res = await fetch("/api/nexus/clients/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: selectedClient,
          writeToFile: true,
          targetPath,
        }),
      });

      const data: unknown = await res.json();
      if (readBooleanField(data, "success")) {
        const backupPath = readStringField(data, "backupPath");
        setSavedMessage(
          `Arquivo '${targetPath}' gravado com sucesso! ${
            backupPath ? `(Backup criado em: ${backupPath})` : ""
          }`
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "erro inesperado";
      alert(`Falha ao gravar arquivo: ${message}`);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12 font-sans">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Laptop className="size-6 text-[var(--color-text-main)]" aria-hidden="true" />
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
              Integrações de clientes
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Gere configurações reproduzíveis para conectar Hermes Agent, Codex e OpenCode
            diretamente ao gateway NEXUS.
          </p>
        </div>
      </header>

      {/* Client Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectClient("hermes")}
          className={`h-8 rounded-full border px-3 text-xs transition cursor-pointer ${
            selectedClient === "hermes"
              ? "border-[var(--color-brand-accent)] bg-[var(--color-brand-accent)] text-white font-medium shadow-xs"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          }`}
        >
          Hermes Agent (config.yaml)
        </button>
        <button
          type="button"
          onClick={() => selectClient("codex")}
          className={`h-8 rounded-full border px-3 text-xs transition cursor-pointer ${
            selectedClient === "codex"
              ? "border-[var(--color-brand-accent)] bg-[var(--color-brand-accent)] text-white font-medium shadow-xs"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          }`}
        >
          Codex (config.toml)
        </button>
        <button
          type="button"
          onClick={() => selectClient("opencode")}
          className={`h-8 rounded-full border px-3 text-xs transition cursor-pointer ${
            selectedClient === "opencode"
              ? "border-[var(--color-brand-accent)] bg-[var(--color-brand-accent)] text-white font-medium shadow-xs"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          }`}
        >
          OpenCode Go (opencode.json)
        </button>
      </div>

      {/* Configuration Viewer & Actions */}
      <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3.5 sm:px-5">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
            <FileCode className="size-4 text-[var(--color-brand-accent)]" />
            <span>
              {selectedClient === "hermes"
                ? "config.yaml"
                : selectedClient === "codex"
                  ? "config.toml"
                  : "opencode.json"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-main)] transition hover:bg-[var(--color-surface)]/80 cursor-pointer"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5 text-[var(--color-text-muted)]" />
              )}
              {copied ? "Copiado!" : "Copiar"}
            </button>

            <button
              type="button"
              onClick={handleSaveToDisk}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--color-brand-accent)] px-3.5 text-xs font-medium text-white transition hover:bg-[var(--color-brand-accent-hover)] shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              Salvar no disco
            </button>
          </div>
        </div>

        {savedMessage && (
          <div className="border-b border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            {savedMessage}
          </div>
        )}

        <div className="min-h-[300px] overflow-x-auto bg-[var(--color-bg)] p-4 sm:p-5 font-mono text-xs leading-relaxed text-[var(--color-text-main)]">
          {loading ? (
            <div className="text-[var(--color-text-muted)]">Gerando configuração...</div>
          ) : (
            <pre className="whitespace-pre">{configContent}</pre>
          )}
        </div>
      </section>
    </main>
  );
}
