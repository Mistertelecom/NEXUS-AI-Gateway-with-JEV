"use client";

import { useTranslations } from "next-intl";

/**
 * 403 Forbidden Page — Phase 8.1
 *
 * Displayed when access is denied due to:
 * - Invalid API key
 * - IP not in allowlist
 * - Rate limit exceeded
 */

import Link from "next/link";

export default function ForbiddenPage() {
  const t = useTranslations("auth");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-white text-center font-mono">
      <div
        className="text-[96px] font-black leading-none mb-4 text-zinc-700 tracking-tighter select-none"
        aria-hidden="true"
      >
        403
      </div>
      <h1 className="text-2xl font-bold mb-2 text-white font-mono">{t("accessDenied")}</h1>
      <p className="text-sm text-zinc-400 max-w-[400px] leading-relaxed mb-8 font-sans">
        {t("accessDeniedDescription")}
      </p>
      <Link
        href="/dashboard"
        className="px-8 py-3 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold no-underline transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        {t("goToDashboard")}
      </Link>
    </div>
  );
}
