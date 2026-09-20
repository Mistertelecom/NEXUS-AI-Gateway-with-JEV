"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function GetStarted() {
  const t = useTranslations("landing");
  const steps = [
    ["01", "getStartedStep1Title", "getStartedStep1Description"],
    ["02", "getStartedStep2Title", "getStartedStep2Description"],
    ["03", "getStartedStep3Title", "getStartedStep3Description"],
  ];

  return (
    <section className="py-24 px-6 bg-black border-t border-zinc-900 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
              {t("getStartedTitle")}
            </h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              {t("getStartedDescription")}
            </p>

            <div className="flex flex-col gap-6">
              {steps.map(([number, title, description]) => (
                <div key={number} className="flex gap-4 min-w-0">
                  <div className="flex-none size-8 rounded-lg bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center font-bold text-xs">
                    {number}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{t(title)}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{t(description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[480px] shrink-0">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6">
              <div className="border-b border-zinc-800 pb-5">
                <p className="text-xs tracking-[0.2em] uppercase text-zinc-500">NEXUS / alpha</p>
                <p className="mt-3 text-lg text-white font-bold">{t("executionPanelTitle")}</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {t("executionPanelDescription")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-white px-4 py-3 text-center text-xs font-bold text-black hover:bg-zinc-200 transition-colors"
                >
                  {t("openDashboard")}
                </Link>
                <Link
                  href="/docs"
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-center text-xs font-bold text-white hover:bg-zinc-900 transition-colors"
                >
                  {t("readDocumentation")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
