"use client";

import CompressionStylesTile from "../../context/CompressionStylesTile";
import CompressionPanel from "../../context/settings/CompressionPanel";

export default function NexusCompressionPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 pb-12 font-sans">
      <header className="border-b border-[var(--color-border)] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)] sm:text-3xl">
          Compressão de contexto
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
          Configure os motores de compressão e preserve contratos em prompts longos. Economia e
          redução de tokens aparecem com base na telemetria real.
        </p>
      </header>
      <CompressionPanel />
      <CompressionStylesTile />
    </main>
  );
}
