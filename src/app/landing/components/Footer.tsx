"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import NexusLogo from "@/shared/components/NexusLogo";

export default function Footer() {
  const t = useTranslations("landing");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-black pt-16 pb-8 px-6 text-zinc-400 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                <NexusLogo size={18} className="text-white" />
              </div>
              <h3 className="text-white text-base font-bold font-mono tracking-widest uppercase">
                {t("brandName")}
              </h3>
            </div>
            <p className="text-zinc-500 text-xs max-w-xs mb-6 break-words font-mono leading-relaxed">
              {t("footerTagline")}
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {t("product")}
            </h4>
            <a
              className="text-zinc-500 hover:text-white text-xs transition-colors"
              href="#features"
            >
              {t("featuresLink")}
            </a>
            <a
              className="text-zinc-500 hover:text-white text-xs transition-colors"
              href="/dashboard"
            >
              {t("dashboardLink")}
            </a>
            <Link
              className="text-zinc-500 hover:text-white text-xs transition-colors"
              href="/dashboard/changelog"
            >
              {t("changelog")}
            </Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {t("resources")}
            </h4>
            <Link className="text-zinc-500 hover:text-white text-xs transition-colors" href="/docs">
              {t("documentation")}
            </Link>
            <Link
              className="text-zinc-500 hover:text-white text-xs transition-colors"
              href="/dashboard"
            >
              {t("dashboardLink")}
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">{t("legal")}</h4>
            <Link
              className="text-zinc-500 hover:text-white text-xs transition-colors"
              href="/terms"
            >
              {t("terms")}
            </Link>
            <Link
              className="text-zinc-500 hover:text-white text-xs transition-colors"
              href="/privacy"
            >
              {t("privacy")}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs break-words text-center md:text-left">
            {t("copyright", { year })}
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
