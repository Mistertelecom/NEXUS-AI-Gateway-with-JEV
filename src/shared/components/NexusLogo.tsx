import React from "react";

type NexusLogoProps = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
};

export default function NexusLogo({
  size = 22,
  className = "",
  showWordmark = false,
}: NexusLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        role={showWordmark ? undefined : "img"}
        aria-label={showWordmark ? undefined : "NEXUS"}
        aria-hidden={showWordmark ? true : undefined}
        focusable="false"
      >
        <path
          d="M5 12H13C18.4 12 19.5 18.3 24 23"
          stroke="var(--nexus-lead, currentColor)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M5 36H13C18.4 36 19.5 29.7 24 25"
          stroke="var(--nexus-worker, currentColor)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M27 24H43"
          stroke="var(--nexus-result, currentColor)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="5" cy="12" r="3.5" fill="var(--nexus-lead, currentColor)" />
        <circle cx="5" cy="36" r="3.5" fill="var(--nexus-worker, currentColor)" />
        <rect
          x="19"
          y="19"
          width="10"
          height="10"
          rx="3"
          transform="rotate(45 24 24)"
          fill="var(--nexus-jev, currentColor)"
        />
        <rect
          x="40"
          y="21"
          width="6"
          height="6"
          rx="1.5"
          fill="var(--nexus-result, currentColor)"
        />
      </svg>

      {showWordmark && (
        <div className="flex min-w-0 select-none flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-[var(--color-text-main)]">
              NEXUS
            </span>
            <span className="rounded-full border border-[var(--color-brand-accent)]/30 bg-[var(--color-brand-accent)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-brand-accent)]">
              v1.1
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            Orquestração Lead · JEV · Worker
          </span>
        </div>
      )}
    </div>
  );
}
