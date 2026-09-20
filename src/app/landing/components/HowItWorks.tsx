"use client";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("landing");

  return (
    <section className="py-24 border-y border-zinc-800/80 bg-black" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-mono">
            {t("howItWorks")}
          </h2>
          <p className="text-zinc-400 max-w-xl text-lg">{t("howItWorksDescription")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-linear-to-r from-zinc-800 via-white/40 to-zinc-800 -z-10"></div>

          <div className="flex flex-col gap-6 relative group">
            <div className="w-24 h-24 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center shadow-xl group-hover:border-zinc-500 transition-colors z-10 mx-auto md:mx-0">
              <span className="material-symbols-outlined text-4xl text-zinc-300" aria-hidden="true">
                north_east
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 break-words text-white font-mono">
                {t("howItWorksStep1Title")}
              </h3>
              <p className="text-sm text-zinc-400 break-words">{t("howItWorksStep1Description")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 relative group md:items-center md:text-center">
            <div className="w-24 h-24 rounded-2xl bg-black border-2 border-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] z-10 mx-auto">
              <span className="material-symbols-outlined text-4xl text-white" aria-hidden="true">
                hub
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white font-mono break-words">
                {t("howItWorksStep2Title")}
              </h3>
              <p className="text-sm text-zinc-400 break-words">{t("howItWorksStep2Description")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 relative group md:items-end md:text-right">
            <div className="w-24 h-24 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center shadow-xl group-hover:border-zinc-500 transition-colors z-10 mx-auto md:mx-0">
              <span className="material-symbols-outlined text-4xl text-zinc-300" aria-hidden="true">
                build
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 break-words text-white font-mono">
                {t("howItWorksStep3Title")}
              </h3>
              <p className="text-sm text-zinc-400 break-words">{t("howItWorksStep3Description")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
