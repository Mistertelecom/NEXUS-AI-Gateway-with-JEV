"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("landing");
  const router = useRouter();

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-xs font-mono text-zinc-300">
          <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />
          {t("alphaBadge")}
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight break-words font-mono text-white">
          {t("heroTitleLead")} <br />
          <span className="text-zinc-400">{t("heroTitleWorker")}</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light break-words">
          {t("heroDescription")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white hover:bg-zinc-200 text-black text-sm font-mono font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              rocket_launch
            </span>
            {t("getStarted")}
          </button>
          <Link
            href="/docs"
            className="w-full sm:w-auto h-12 px-8 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-mono font-bold transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              menu_book
            </span>
            {t("readDocumentation")}
          </Link>
        </div>
      </div>
    </section>
  );
}
