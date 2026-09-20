import type { FormEvent } from "react";
import Link from "next/link";
import { ExternalLink, Settings } from "lucide-react";

import NexusLogo from "@/shared/components/NexusLogo";
import type { PairCompressionMode } from "@/nexus/pairs/definition";

import { PairStudioRoleSelector } from "./PairStudioRoleSelector";
import type { PairStudioModelOptions, PairStudioSelection } from "./pairStudioModelOptions";

export type PairStudioSaveState =
  | { readonly kind: "idle" }
  | { readonly kind: "saving" }
  | { readonly kind: "saved"; readonly comboName: string }
  | { readonly kind: "error"; readonly message: string };

type PairStudioFormProps = {
  readonly loadError: string | null;
  readonly loading: boolean;
  readonly modelOptions: PairStudioModelOptions;
  readonly onSelectionChange: (selection: PairStudioSelection) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly saveState: PairStudioSaveState;
  readonly selection: PairStudioSelection;
  readonly submitDisabled: boolean;
  readonly configuredOnly?: boolean;
  readonly onConfiguredOnlyChange?: (configuredOnly: boolean) => void;
  readonly configuredCount?: number;
};

const COMPRESSION_OPTIONS = [
  { value: "standard", label: "Standard", detail: "Lite + Caveman" },
  { value: "rtk", label: "RTK", detail: "Saídas de ferramentas" },
  { value: "stacked", label: "Stacked", detail: "Cascata configurada" },
  { value: "off", label: "Sem compressão", detail: "Prompt original" },
] as const satisfies readonly {
  readonly value: PairCompressionMode;
  readonly label: string;
  readonly detail: string;
}[];

const JEV_MODE_OPTIONS = [
  { value: "adaptive", label: "Adaptativa", detail: "Plano único com JEV" },
] as const satisfies readonly {
  readonly value: PairStudioSelection["jevMode"];
  readonly label: string;
  readonly detail: string;
}[];

function readCompressionMode(value: string): PairCompressionMode {
  switch (value) {
    case "off":
      return "off";
    case "rtk":
      return "rtk";
    case "stacked":
      return "stacked";
    case "standard":
      return "standard";
    default:
      return "standard";
  }
}

function readJevMode(value: string): PairStudioSelection["jevMode"] {
  switch (value) {
    case "adaptive":
      return "adaptive";
    case "advisory":
      return "advisory";
    case "off":
      return "off";
    default:
      return "adaptive";
  }
}

function saveBoundary(jevMode: PairStudioSelection["jevMode"]): string {
  if (jevMode === "adaptive") {
    return "Salvar registra a política adaptativa e o contrato do Worker com raciocínio none.";
  }
  return "Salvar cria o fallback de pipeline fixo Lead, Worker, Lead para esta política.";
}

export function PairStudioForm({
  loadError,
  loading,
  modelOptions,
  onSelectionChange,
  onSubmit,
  saveState,
  selection,
  submitDisabled,
  configuredOnly = true,
  onConfiguredOnlyChange,
  configuredCount = 0,
}: PairStudioFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4 sm:p-6 font-sans"
    >
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Configuração do Par
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Defina o nome e os papéis dos modelos para o pipeline.
          </p>
        </div>
        <label className="min-w-0 sm:w-64">
          <span className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
            Nome do par
          </span>
          <input
            value={selection.name}
            onChange={(event) => onSelectionChange({ ...selection, name: event.target.value })}
            maxLength={80}
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-text-muted)]"
            required
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--color-text-main)] select-none">
            <input
              type="checkbox"
              checked={configuredOnly}
              onChange={(e) => onConfiguredOnlyChange?.(e.target.checked)}
              className="size-4 rounded border-[var(--color-border)] text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 cursor-pointer"
            />
            <span>Apenas provedores cadastrados</span>
          </label>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[11px] font-mono text-[var(--color-text-muted)]">
            {configuredCount} {configuredCount === 1 ? "provedor" : "provedores"}
          </span>
        </div>
        <Link
          href="/dashboard/nexus/providers"
          className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-emerald-400 transition"
        >
          <span>Gerenciar provedores</span>
          <ExternalLink className="size-3" />
        </Link>
      </div>

      {configuredOnly && configuredCount === 0 && (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-amber-400">Nenhum provedor cadastrado</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Para utilizar o Pair Studio com modelos reais e sem poluição, cadastre suas chaves
                de provedor.
              </p>
            </div>
            <Link
              href="/dashboard/nexus/providers"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-amber-500/30 bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/30 transition shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Settings className="size-3.5" />
              <span>Cadastrar Provedores</span>
            </Link>
          </div>
        </div>
      )}

      {loadError && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]"
        >
          {loadError}
        </div>
      )}

      <div className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] md:items-stretch">
        <PairStudioRoleSelector
          disabled={loading}
          model={selection.leadModel}
          onModelChange={(leadModel) => onSelectionChange({ ...selection, leadModel })}
          options={modelOptions.leadOptions}
          role="Lead"
        />
        <div className="flex flex-row items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-4 md:flex-col shadow-xs">
          <NexusLogo size={28} className="text-[var(--color-text-main)]" />
          <div className="text-center">
            <p className="font-sans text-xs font-semibold text-[var(--color-brand-accent)]">JEV</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">junção</p>
          </div>
        </div>
        <PairStudioRoleSelector
          disabled={loading}
          model={selection.workerModel}
          onModelChange={(workerModel) => onSelectionChange({ ...selection, workerModel })}
          options={modelOptions.workerOptions}
          role="Worker"
        />
      </div>

      <div className="grid gap-4 border-t border-[var(--color-border)] pt-5 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
            Política JEV
          </span>
          <select
            value={selection.jevMode}
            onChange={(event) =>
              onSelectionChange({ ...selection, jevMode: readJevMode(event.target.value) })
            }
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand-accent)] focus:ring-1 focus:ring-[var(--color-brand-accent)]/30"
          >
            {JEV_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}: {option.detail}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
            Compressão
          </span>
          <select
            value={selection.compressionMode}
            onChange={(event) =>
              onSelectionChange({
                ...selection,
                compressionMode: readCompressionMode(event.target.value),
              })
            }
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-brand-accent)] focus:ring-1 focus:ring-[var(--color-brand-accent)]/30"
          >
            {COMPRESSION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}: {option.detail}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          {saveBoundary(selection.jevMode)}
        </p>
        <button
          type="submit"
          disabled={submitDisabled}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--color-brand-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40 shadow-xs cursor-pointer"
        >
          {saveState.kind === "saving" ? "Salvando" : "Salvar par"}
        </button>
      </div>

      {saveState.kind === "saved" && (
        <div className="mt-4 rounded-xl border border-[var(--color-brand-accent)]/40 bg-[var(--color-brand-accent)]/10 px-4 py-3 text-sm text-[var(--color-text-main)]">
          Par salvo como{" "}
          <code className="font-mono text-[var(--color-brand-accent)]">{saveState.comboName}</code>.
        </div>
      )}
      {saveState.kind === "error" && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]"
        >
          {saveState.message}
        </div>
      )}
    </form>
  );
}
