"use client";

/**
 * Breadcrumbs — FASE-07 UX
 *
 * Dashboard breadcrumb navigation component. Automatically generates
 * breadcrumbs from the current path with friendly labels.
 * Uses usePathname() internally — no props needed.
 *
 * Usage:
 *   <Breadcrumbs />
 */

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

const PATH_LABELS = {
  nexus: "nexus",
  workflows: "workflows",
  telemetry: "telemetry",
  diagnostics: "diagnostics",
  clients: "clients",
  dashboard: "dashboard",
  providers: "providers",
  combos: "combos",
  settings: "settings",
  general: "general",
  appearance: "appearance",
  ai: "ai",
  routing: "routing",
  resilience: "resilience",
  advanced: "advanced",
  "access-tokens": "accessTokens",
  "feature-flags": "featureFlags",
  logs: "logs",
  "audit-log": "auditLog",
  console: "console",
  logger: "logger",
  translator: "translator",
  playground: "playground",
  add: "add",
  edit: "edit",
  keys: "apiKeys",
  models: "models",
  "cli-code": "cliCode",
  "cli-agents": "cliAgents",
  "acp-agents": "acpAgents",
  endpoint: "endpoint",
  "api-manager": "apiManager",
  context: "context",
  compression: "compression",
  services: "services",
  analytics: "analytics",
  costs: "costs",
  health: "health",
  runtime: "runtime",
  webhooks: "webhooks",
  home: "home",
  activity: "activity",
  "agent-skills": "agentSkills",
  "combo-health": "comboHealth",
  evals: "evals",
  search: "search",
  utilization: "utilization",
  "api-endpoints": "apiEndpoints",
  audit: "audit",
  a2a: "a2a",
  mcp: "mcp",
  batch: "batch",
  files: "files",
  media: "media",
  cache: "cache",
  changelog: "changelog",
  chaos: "chaos",
  "cloud-agents": "cloudAgents",
  live: "live",
  studio: "studio",
  aggressive: "aggressive",
  caveman: "caveman",
  ccr: "ccr",
  headroom: "headroom",
  lite: "lite",
  llmlingua: "llmlingua",
  omniglyph: "omniglyph",
  rtk: "rtk",
  "session-dedup": "sessionDedup",
  ultra: "ultra",
  budget: "budget",
  pricing: "pricing",
  "quota-share": "quotaShare",
  discovery: "discovery",
  "free-provider-rankings": "freeProviderRankings",
  radar: "radar",
  setup: "setup",
  "free-tiers": "freeTiers",
  gamification: "gamification",
  leaderboard: "leaderboard",
  limits: "limits",
  profile: "profile",
  plugins: "plugins",
  "provider-stats": "providerStats",
  new: "new",
  quota: "quota",
  relay: "relay",
  "search-tools": "searchTools",
  security: "security",
  sidebar: "sidebar",
  tokens: "tokens",
  tools: "tools",
  "agent-bridge": "agentBridge",
  "traffic-inspector": "trafficInspector",
  usage: "usage",
};

/**
 * Get a friendly label for a path segment.
 * @param {string} segment
 * @returns {string}
 */
function getLabel(segment: string, t: (key: string) => string) {
  const key = PATH_LABELS[segment as keyof typeof PATH_LABELS];
  const fallback = segment.charAt(0).toUpperCase() + segment.slice(1);
  return key && typeof (t as any).has === "function" && (t as any).has(key) ? t(key) : fallback;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("breadcrumbs");
  if (!pathname || pathname === "/dashboard") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, idx) => ({
    label: getLabel(seg, t),
    href: "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }));

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="flex items-center gap-2 font-mono text-xs text-zinc-500 py-1.5 mb-3 select-none"
    >
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-zinc-700 text-[11px]" aria-hidden="true">
              /
            </span>
          )}
          {crumb.isLast ? (
            <span aria-current="page" className="text-white font-semibold tracking-tight">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-zinc-500 hover:text-zinc-200 transition-colors duration-150"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
