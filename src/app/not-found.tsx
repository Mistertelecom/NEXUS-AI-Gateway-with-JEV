"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import NexusLogo from "@/shared/components/NexusLogo";

export default function NotFound() {
  const t = useTranslations("publicSystem");
  const tc = useTranslations("common");

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-white text-center font-mono"
      role="main"
      aria-labelledby="not-found-title"
    >
      <NexusLogo size={32} className="text-white mb-8" />
      <div
        className="text-[96px] font-black leading-none mb-4 text-zinc-700 tracking-tighter select-none"
        aria-hidden="true"
      >
        404
      </div>
      <h1 id="not-found-title" className="text-2xl font-bold mb-2 text-white font-mono">
        {t("notFound.title")}
      </h1>
      <p className="text-sm text-zinc-400 max-w-[400px] leading-relaxed mb-8 font-sans">
        {t("notFound.description")}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/dashboard"
          className="px-8 py-3 rounded-lg text-black text-xs font-mono font-bold no-underline transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] bg-white hover:bg-zinc-200"
          aria-label={t("notFound.dashboardAriaLabel")}
        >
          {tc("goToDashboard")}
        </Link>
        <Link
          href="/status"
          className="px-8 py-3 rounded-lg text-xs font-mono font-bold no-underline border border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 transition-colors duration-200"
          aria-label={t("notFound.statusAriaLabel")}
        >
          {t("notFound.systemStatus")}
        </Link>
      </div>
    </div>
  );
}
