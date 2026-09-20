"use client";

import { useTranslations } from "next-intl";

/**
 * EmptyState — FASE-07 UX
 *
 * Reusable empty state component for dashboard sections when no data
 * is available. Provides visual feedback and optional action button.
 *
 * Usage:
 *   <EmptyState
 *     icon="📡"
 *     title="No providers yet"
 *     description="Add your first API provider to get started."
 *     actionLabel="Add Provider"
 *     onAction={() => router.push('/providers/add')}
 *   />
 */

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: (() => void) | null;
}

export default function EmptyState({
  icon = "📭",
  title,
  description = "",
  actionLabel = "",
  onAction = null,
}: EmptyStateProps) {
  const t = useTranslations("common");
  const resolvedTitle = title ?? t("nothingHere");
  const usesMaterialSymbol = /^[a-z][a-z0-9_]*$/.test(icon);
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center min-h-[200px] font-mono">
      <div
        className="text-4xl mb-4 opacity-80 animate-[emptyBounce_2s_ease-in-out_infinite] text-zinc-400"
        role="img"
        aria-hidden="true"
      >
        {usesMaterialSymbol ? (
          <span className="material-symbols-outlined text-[48px]">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <h3 className="text-base font-bold text-white mb-2 font-mono">{resolvedTitle}</h3>
      {description && (
        <p className="text-xs text-zinc-400 max-w-[360px] leading-relaxed mt-1 font-sans">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
      <style>{`
        @keyframes emptyBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
