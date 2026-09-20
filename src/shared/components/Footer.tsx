"use client";

import { useTranslations } from "next-intl";

import Link from "next/link";
import { APP_CONFIG } from "@/shared/constants/appConfig";
import NexusLogo from "@/shared/components/NexusLogo";

const footerLinks = {
  product: [
    { key: "featuresLink", href: "#features" },
    { key: "pricing", href: "#pricing" },
    {
      key: "changelog",
      href: "/dashboard/changelog",
    },
  ],
  resources: [
    { key: "documentation", href: "/docs" },
    { key: "apiReference", href: "/docs#api-reference" },
    {
      key: "helpCenter",
      href: "/dashboard/nexus/diagnostics",
    },
  ],
  company: [
    { key: "about", href: "/docs" },
    { key: "blog", href: "/dashboard/changelog" },
    {
      key: "contact",
      href: "/dashboard/nexus/diagnostics",
    },
    { key: "terms", href: "/terms" },
    { key: "privacy", href: "/privacy" },
  ],
};

export default function Footer() {
  const t = useTranslations("landing");
  const renderFooterLink = (link: any) => {
    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          {t(link.key)}
        </a>
      );
    }
    return (
      <Link href={link.href} className="hover:text-white transition-colors">
        {t(link.key)}
      </Link>
    );
  };

  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-12 text-zinc-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                <NexusLogo size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white font-mono tracking-widest uppercase">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-zinc-500 mb-6 max-w-sm text-sm font-mono leading-relaxed">
              {t("footerDescription")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs font-mono uppercase tracking-wider">
              {t("product")}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-zinc-500">
              {footerLinks.product.map((link) => (
                <li key={link.key}>{renderFooterLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs font-mono uppercase tracking-wider">
              {t("resources")}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-zinc-500">
              {footerLinks.resources.map((link) => (
                <li key={link.key}>{renderFooterLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs font-mono uppercase tracking-wider">
              {t("company")}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-zinc-500">
              {footerLinks.company.map((link) => (
                <li key={link.key}>{renderFooterLink(link)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-white transition-colors">
              {t("documentation")}
            </Link>
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
