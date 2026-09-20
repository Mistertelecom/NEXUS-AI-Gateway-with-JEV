"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import NexusLogo from "@/shared/components/NexusLogo";

import { PairStudioEvidenceChip } from "./PairStudioEvidence";
import { PairStudioExecutionContract } from "./PairStudioExecutionContract";
import { PairStudioForm, type PairStudioSaveState } from "./PairStudioForm";
import { PairStudioNavigation } from "./PairStudioNavigation";
import {
  buildPairStudioSavePayload,
  deriveConfiguredProviderIdentifiers,
  deriveEvidenceState,
  derivePairStudioModelOptions,
  derivePairStudioProviderEvidence,
  isPairStudioSelectionReady,
  type PairStudioProviderEvidence,
  type PairStudioSelection,
} from "./pairStudioModelOptions";

const SaveErrorSchema = z
  .object({
    error: z
      .union([z.string().trim().min(1), z.object({ message: z.string().trim().min(1) })])
      .optional(),
  })
  .passthrough();

function readSaveError(payload: unknown): string {
  const parsed = SaveErrorSchema.safeParse(payload);
  if (!parsed.success || parsed.data.error === undefined) return "Não foi possível salvar o par.";
  if (typeof parsed.data.error === "string") return parsed.data.error;
  return parsed.data.error.message;
}

export default function NexusPairStudio() {
  const [rawModelsPayload, setRawModelsPayload] = useState<unknown | null>(null);
  const [providersPayload, setProvidersPayload] = useState<unknown | null>(null);
  const [providerEvidence, setProviderEvidence] = useState<PairStudioProviderEvidence | null>(null);
  const [configuredOnly, setConfiguredOnly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selection, setSelection] = useState<PairStudioSelection>({
    name: "Meu par NEXUS",
    leadModel: "",
    workerModel: "",
    compressionMode: "standard",
    jevMode: "adaptive",
  });
  const [saveState, setSaveState] = useState<PairStudioSaveState>({ kind: "idle" });

  const configuredProviders = useMemo(
    () => deriveConfiguredProviderIdentifiers(providersPayload),
    [providersPayload]
  );

  const modelOptions = useMemo(
    () =>
      derivePairStudioModelOptions(
        rawModelsPayload,
        configuredOnly ? configuredProviders : undefined
      ),
    [rawModelsPayload, configuredOnly, configuredProviders]
  );

  const leadModelIds = useMemo(
    () => modelOptions.leadOptions.map((option) => option.id),
    [modelOptions.leadOptions]
  );
  const workerModelIds = useMemo(
    () => modelOptions.workerOptions.map((option) => option.id),
    [modelOptions.workerOptions]
  );

  const effectiveLeadModel =
    selection.leadModel && leadModelIds.includes(selection.leadModel)
      ? selection.leadModel
      : (modelOptions.leadOptions[0]?.id ?? "");

  const effectiveWorkerModel =
    selection.workerModel && workerModelIds.includes(selection.workerModel)
      ? selection.workerModel
      : (modelOptions.workerOptions[0]?.id ?? "");

  const activeSelection: PairStudioSelection = useMemo(
    () => ({
      ...selection,
      leadModel: effectiveLeadModel,
      workerModel: effectiveWorkerModel,
    }),
    [selection, effectiveLeadModel, effectiveWorkerModel]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadDiscovery(): Promise<void> {
      setLoadError(null);

      try {
        const [modelsResponse, provResponse] = await Promise.all([
          fetch("/api/v1/models", { signal: controller.signal }),
          fetch("/api/nexus/providers", { signal: controller.signal }),
        ]);

        if (!modelsResponse.ok) {
          setLoadError("O catálogo de modelos não respondeu. Verifique o núcleo de providers.");
          return;
        }

        const modelsData: unknown = await modelsResponse.json();
        let provData: unknown = null;
        if (provResponse.ok) provData = await provResponse.json();

        setRawModelsPayload(modelsData);
        setProvidersPayload(provData);
        setProviderEvidence(derivePairStudioProviderEvidence(provData));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError("O catálogo de modelos não respondeu. Verifique o núcleo de providers.");
        setProviderEvidence(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadDiscovery();
    return () => controller.abort();
  }, []);

  const pairIsReady = isPairStudioSelectionReady(activeSelection, leadModelIds, workerModelIds);
  const modelEvidenceState = loading ? "unknown" : loadError ? "unavailable" : "observed";
  const providerEvidenceState = providerEvidence === null ? "unknown" : "observed";
  const jevEvidenceState = deriveEvidenceState(
    providerEvidence?.jevReadiness ?? null,
    providerEvidence?.jevVerification ?? null
  );

  const handleSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!pairIsReady || saveState.kind === "saving") return;

    setSaveState({ kind: "saving" });
    const payload = buildPairStudioSavePayload(activeSelection);

    try {
      const response = await fetch("/api/combos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responsePayload: unknown = await response.json();

      if (!response.ok) {
        setSaveState({ kind: "error", message: readSaveError(responsePayload) });
        return;
      }

      setSaveState({ kind: "saved", comboName: payload.name });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setSaveState({ kind: "error", message: "O núcleo não respondeu. O par não foi salvo." });
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12">
      <header className="grid gap-6 border-b border-[var(--color-border)] pb-6 lg:grid-cols-[1fr_auto] lg:items-end font-sans">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <NexusLogo size={28} className="text-[var(--color-text-main)]" />
            <h1 className="text-2xl font-semibold text-[var(--color-text-main)] tracking-tight sm:text-3xl">
              Estúdio de Pairs
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
            No modo adaptativo, o Lead planeja uma vez; o JEV executa trabalho local elegível; o
            Worker faz trabalho delimitado; e o Lead só retorna quando há necessidade de revisão ou
            exceção.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
          <PairStudioEvidenceChip
            label="Modelos descobertos"
            state={modelEvidenceState}
            value={loading ? "carregando" : String(modelOptions.leadOptions.length)}
          />
          <PairStudioEvidenceChip
            label="Providers configurados"
            state={providerEvidenceState}
            value={
              providerEvidence?.configuredCount === null || providerEvidence === null
                ? "não medido"
                : String(providerEvidence.configuredCount)
            }
          />
          <PairStudioEvidenceChip
            label="JEV"
            state={jevEvidenceState}
            value={providerEvidence?.jevReadiness ?? "não medido"}
          />
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(320px,5fr)]">
        <PairStudioForm
          loadError={loadError}
          loading={loading}
          modelOptions={modelOptions}
          onSelectionChange={(nextSelection) => {
            setSelection(nextSelection);
            if (saveState.kind !== "saving") setSaveState({ kind: "idle" });
          }}
          onSubmit={(event) => void handleSave(event)}
          saveState={saveState}
          selection={activeSelection}
          submitDisabled={!pairIsReady || saveState.kind === "saving"}
          configuredOnly={configuredOnly}
          onConfiguredOnlyChange={setConfiguredOnly}
          configuredCount={configuredProviders.size}
        />
        <PairStudioExecutionContract jevMode={activeSelection.jevMode} />
      </div>

      <PairStudioNavigation />
    </main>
  );
}
