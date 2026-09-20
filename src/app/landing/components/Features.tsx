"use client";
import { useTranslations } from "next-intl";

const FEATURES = [
  {
    icon: "psychology",
    titleKey: "featureLeadTitle",
    descKey: "featureLeadDesc",
  },
  {
    icon: "hub",
    titleKey: "featureJevTitle",
    descKey: "featureJevDesc",
  },
  {
    icon: "construction",
    titleKey: "featureWorkerTitle",
    descKey: "featureWorkerDesc",
  },
  {
    icon: "visibility",
    titleKey: "featureReviewTitle",
    descKey: "featureReviewDesc",
  },
];

export default function Features() {
  const t = useTranslations("landing");

  return (
    <section className="py-24 px-6 bg-black" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-mono">
            {t("powerfulFeatures")}
          </h2>
          <p className="text-zinc-400 max-w-xl text-lg">{t("featuresSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.titleKey}
              className="p-6 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40 transition-all duration-300 group font-mono"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:border-zinc-500 transition-all duration-300">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-base font-bold mb-2 break-words text-white group-hover:text-zinc-200 transition-colors">
                {t(feature.titleKey)}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed break-words font-sans">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
