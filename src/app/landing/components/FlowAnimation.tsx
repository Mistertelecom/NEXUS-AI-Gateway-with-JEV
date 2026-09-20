"use client";

import { useTranslations } from "next-intl";
import NexusLogo from "@/shared/components/NexusLogo";

export default function FlowAnimation() {
  const t = useTranslations("landing");
  const lanes = [
    { id: "leadLane", icon: "north_east", label: t("leadLane"), detail: t("leadLaneSummary") },
    { id: "workerLane", icon: "build", label: t("workerLane"), detail: t("workerLaneSummary") },
  ];

  return (
    <div className="mt-16 w-full max-w-4xl" aria-label={t("executionDiagramLabel")}>
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="grid gap-4">
          {lanes.map((lane) => (
            <div
              key={lane.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-left transition-colors hover:border-zinc-600"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-zinc-300" aria-hidden="true">
                  {lane.icon}
                </span>
                <p className="text-sm font-bold tracking-wide text-white">{lane.label}</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">{lane.detail}</p>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center text-zinc-600" aria-hidden="true">
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>

        <div className="rounded-2xl border-2 border-white bg-black p-8 text-center shadow-[0_0_40px_rgba(255,255,255,0.12)]">
          <NexusLogo size={42} className="justify-center text-white" />
          <p className="mt-4 text-xs font-bold tracking-[0.24em] text-white">JEV</p>
          <p className="mt-2 text-sm font-bold text-white">{t("jevJunction")}</p>
          <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-zinc-400">
            {t("jevJunctionSummary")}
          </p>
        </div>

        <div className="md:hidden flex justify-center text-zinc-600" aria-hidden="true">
          <span className="material-symbols-outlined">arrow_downward</span>
        </div>
      </div>
    </div>
  );
}
