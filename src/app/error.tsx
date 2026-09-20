"use client";

import { useTranslations } from "next-intl";
import NexusLogo from "@/shared/components/NexusLogo";

/**
 * Server Error Page — P-1
 *
 * Per-page error boundary for unrecoverable errors within the
 * dashboard layout. Falls back to global-error.tsx if this fails.
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("publicSystem");
  const tc = useTranslations("common");

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center font-mono bg-black text-white"
      role="alert"
      aria-live="assertive"
    >
      <NexusLogo size={28} className="text-white mb-6" />
      <div className="text-[48px] mb-4 text-zinc-500" aria-hidden="true">
        <span className="material-symbols-outlined text-[56px]">error</span>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-white font-mono">{t("error.title")}</h1>
      <p className="text-sm text-zinc-400 max-w-[400px] leading-relaxed mb-2 font-sans">
        {t("error.description")}
      </p>
      {error?.digest && (
        <p className="text-xs text-zinc-500 mb-6 font-mono">
          {t("error.errorId", { id: error.digest })}
        </p>
      )}
      {process.env.NODE_ENV === "development" && error?.message && (
        <pre
          className="p-4 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-xs max-w-[600px] overflow-auto text-left mb-6 font-mono"
          aria-label={t("error.detailsAriaLabel")}
        >
          {error.message}
        </pre>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          aria-label={t("error.retryAriaLabel")}
          className="px-6 py-2.5 rounded-lg text-black text-xs font-mono font-bold cursor-pointer transition-all bg-white hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          {t("error.tryAgain")}
        </button>
        <a
          href="/dashboard"
          className="px-6 py-2.5 rounded-lg text-white text-xs font-mono font-bold cursor-pointer transition-all border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 no-underline"
          aria-label={t("error.dashboardAriaLabel")}
        >
          {tc("goToDashboard")}
        </a>
        <a
          href="/status"
          className="px-6 py-2.5 rounded-lg text-white text-xs font-mono font-bold cursor-pointer transition-all border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 no-underline"
          aria-label={t("error.statusAriaLabel")}
        >
          {t("error.systemStatus")}
        </a>
      </div>
    </div>
  );
}
