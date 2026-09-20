"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import NexusLogo from "@/shared/components/NexusLogo";

export default function Navigation() {
  const t = useTranslations("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-zinc-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0 min-w-0"
          onClick={() => router.push("/")}
          aria-label={t("navigateHome")}
        >
          <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <NexusLogo size={20} className="text-white" />
          </div>
          <h2 className="text-white text-lg sm:text-xl font-bold font-mono tracking-widest uppercase truncate sm:max-w-none max-w-[160px]">
            {t("brandName")}
          </h2>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <a
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            href="#features"
          >
            {t("featuresLink")}
          </a>
          <a
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            href="#how-it-works"
          >
            {t("howItWorks")}
          </a>
          <Link
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            href="/docs"
          >
            {t("docsLink")}
          </Link>
          <Link
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
            href="/dashboard"
          >
            {t("dashboardLink")}
          </Link>
        </div>

        {/* CTA + Mobile menu */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="hidden sm:flex h-9 items-center justify-center rounded-lg px-4 bg-white hover:bg-zinc-200 transition-all text-black text-xs font-mono font-bold tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            {t("getStarted")}
          </button>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("toggleMenu")}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-zinc-800 px-4 py-6">
          <div className="flex flex-col gap-4">
            <a
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("featuresLink")}
            </a>
            <a
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("howItWorks")}
            </a>
            <Link
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("docsLink")}
            </Link>
            <Link
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("dashboardLink")}
            </Link>
            <button
              onClick={() => router.push("/dashboard")}
              className="h-9 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold"
            >
              {t("getStarted")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
