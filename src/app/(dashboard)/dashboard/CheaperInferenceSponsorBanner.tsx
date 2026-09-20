"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import ProviderIcon from "@/shared/components/ProviderIcon";

// The URL in README.md's Open Source Friends section. This used to go through
// our own link.omniroute.online shortener for click metrics, but that domain no
// longer resolves (every slug 404s) after the move to omniskill.online, so the
// CTA points straight at the destination again.
const CHEAPER_INFERENCE_URL = "https://cheaperinference.com/?utm_source=omniroute";

// Cheaper Inference brand green (#31f889). White text on it fails contrast, so
// the CTA pairs it with the dark ink from the provider's color token (colors.ts:
// cheaperinference.text = #04170d). Hex values stay in sync with that token.

const DISMISS_STORAGE_KEY = "omniroute-cheaperinference-sponsor-banner-dismissed-v1";
// Same-tab signal for the dismiss button, since writing localStorage doesn't
// fire a "storage" event in the tab that wrote it.
const DISMISS_EVENT = "omniroute:cheaperinference-sponsor-banner-dismissed";

function isNotDismissed(): boolean {
  try {
    return !localStorage.getItem(DISMISS_STORAGE_KEY);
  } catch {
    return true;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(DISMISS_EVENT, callback);
  return () => window.removeEventListener(DISMISS_EVENT, callback);
}

// SSR has no localStorage, so the server always renders the banner visible;
// useSyncExternalStore reconciles that against the real client-side value
// right after hydration, mirroring KimiSponsorBanner's pattern.
function getServerSnapshot() {
  return true;
}

/**
 * Dismissable banner announcing the Cheaper Inference OmniRoute partnership on
 * the dashboard home page — same size/shape as KimiSponsorBanner, no version
 * gate (durable partnership, not a time-boxed offer). The logomark reuses
 * <ProviderIcon providerId="cheaperinference" .../>.
 */
export default function CheaperInferenceSponsorBanner() {
  const t = useTranslations("cheaperInferenceSponsorBanner");
  const visible = useSyncExternalStore(subscribe, isNotDismissed, getServerSnapshot);

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, "true");
    } catch {
      // ignore — worst case the banner reappears next visit
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  return (
    <div
      role="complementary"
      aria-label={t("title")}
      className="mb-4 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between font-mono"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
          <ProviderIcon providerId="cheaperinference" size={24} type="color" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-white">{t("title")}</p>
          <p className="mt-0.5 text-xs text-zinc-400">{t("description")}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
        <div className="flex flex-col items-end gap-0.5">
          <a
            href={CHEAPER_INFERENCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={t("partnerLinkNote")}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-zinc-200"
          >
            {t("cta")}
            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
              open_in_new
            </span>
          </a>
          <span className="text-[9px] text-zinc-500">{t("partnerLinkNote")}</span>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismissAriaLabel")}
          className="text-zinc-500 transition-colors hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
