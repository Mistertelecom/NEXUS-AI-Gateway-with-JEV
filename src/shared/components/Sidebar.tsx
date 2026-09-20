"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { matchesSidebarHref } from "@/shared/utils/sidebarRouteMatch";
import NexusLogo from "./NexusLogo";
import Button from "./Button";
import { ConfirmModal } from "./Modal";
import { useTranslations } from "next-intl";

type SidebarProps = {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMacElectron?: boolean;
};

type HoveredItem = { id: string; label: string; x: number; y: number } | null;

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
};

type NavGroup = {
  id: string;
  title: string;
  items: NavItem[];
};

const NEXUS_NAVIGATION_GROUPS: readonly NavGroup[] = [
  {
    id: "principal",
    title: "Principal",
    items: [
      {
        id: "nexus-pairs",
        label: "Estúdio de Pairs",
        href: "/dashboard/nexus",
        icon: "tune",
        exact: true,
      },
      {
        id: "nexus-executions",
        label: "Execuções",
        href: "/dashboard/nexus/executions",
        icon: "history",
      },
      {
        id: "nexus-telemetry",
        label: "Telemetria",
        href: "/dashboard/nexus/telemetry",
        icon: "radar",
      },
    ],
  },
  {
    id: "recursos",
    title: "Recursos",
    items: [
      {
        id: "nexus-providers",
        label: "Provedores",
        href: "/dashboard/nexus/providers",
        icon: "dns",
      },
      {
        id: "nexus-models",
        label: "Catálogo de modelos",
        href: "/dashboard/nexus/models",
        icon: "grid_view",
      },
      {
        id: "nexus-compression",
        label: "Compressão",
        href: "/dashboard/nexus/compression",
        icon: "compress",
      },
      {
        id: "nexus-clients",
        label: "Integrações",
        href: "/dashboard/nexus/clients",
        icon: "terminal",
      },
    ],
  },
  {
    id: "sistema",
    title: "Sistema",
    items: [
      {
        id: "nexus-diagnostics",
        label: "Diagnóstico",
        href: "/dashboard/nexus/diagnostics",
        icon: "shield",
      },
      {
        id: "nexus-settings",
        label: "Configurações",
        href: "/dashboard/settings",
        icon: "settings",
      },
    ],
  },
] as const;

export default function Sidebar({
  onClose,
  collapsed = false,
  onToggleCollapse,
  isMacElectron = false,
}: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const tc = useTranslations("common");
  const sidebarRef = useRef<HTMLElement>(null);
  const systemMenuRef = useRef<HTMLDivElement>(null);

  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<HoveredItem>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Close system menu on outside click
  useEffect(() => {
    if (!showSystemMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (systemMenuRef.current && !systemMenuRef.current.contains(e.target as Node)) {
        setShowSystemMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSystemMenu]);

  // Mobile drawer: close on Escape
  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleShutdown = async () => {
    setIsShuttingDown(true);
    try {
      await fetch("/api/shutdown", { method: "POST" });
    } catch {
      // Expected to fail as server shuts down
    }
    setIsShuttingDown(false);
    setShowShutdownModal(false);
    setIsDisconnected(true);
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    try {
      await fetch("/api/restart", { method: "POST" });
    } catch {
      // Expected to fail as server restarts
    }
    setIsRestarting(false);
    setShowRestartModal(false);
    setIsDisconnected(true);
    setTimeout(() => globalThis.location.reload(), 3000);
  };

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: string, label: string) => {
      if (!collapsed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const sidebarRect = sidebarRef.current?.getBoundingClientRect();
      setHoveredItem({
        id,
        label,
        x: (sidebarRect?.right ?? 64) + 8,
        y: rect.top + rect.height / 2,
      });
    },
    [collapsed]
  );

  const handleMouseLeave = useCallback(() => setHoveredItem(null), []);

  const query = searchQuery.trim().toLowerCase();
  const filteredGroups = useMemo(() => {
    if (!query) return NEXUS_NAVIGATION_GROUPS;
    return NEXUS_NAVIGATION_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(query)),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  // Render a single navigation link
  const renderItem = (item: NavItem) => {
    const active = matchesSidebarHref(pathname, item.href, item.exact ?? false);

    if (collapsed) {
      return (
        <Link
          key={item.id}
          href={item.href}
          prefetch={false}
          onClick={onClose}
          onMouseEnter={(e) => handleMouseEnter(e, item.id, item.label)}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex size-9 mx-auto items-center justify-center rounded-lg transition-all select-none relative",
            active
              ? "bg-[var(--color-surface)] text-[var(--color-brand-accent)] font-medium shadow-xs ring-1 ring-[var(--color-brand-accent)]/40"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)]/60"
          )}
          aria-label={item.label}
        >
          <span className="material-symbols-outlined text-[20px] shrink-0 text-inherit">
            {item.icon}
          </span>
        </Link>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href}
        prefetch={false}
        onClick={onClose}
        className={cn(
          "group flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-sans transition-all select-none relative",
          active
            ? "bg-[var(--color-surface)] text-[var(--color-text-main)] font-semibold shadow-xs"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)]/60"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "material-symbols-outlined text-[19px] shrink-0 transition-colors",
              active
                ? "text-[var(--color-brand-accent)]"
                : "text-inherit group-hover:text-[var(--color-text-main)]"
            )}
          >
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </div>
        {active && (
          <span className="size-1.5 rounded-full bg-[var(--color-brand-accent)] shrink-0 shadow-[0_0_8px_var(--color-brand-accent)]" />
        )}
      </Link>
    );
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "flex h-full min-h-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)] text-[var(--color-text-main)] transition-all duration-300 ease-in-out font-sans select-none",
          collapsed ? "w-16" : "w-[260px]"
        )}
        style={{ paddingTop: isMacElectron ? "var(--desktop-safe-top)" : undefined }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-[var(--color-surface)] focus:text-[var(--color-text-main)] focus:rounded-md focus:m-2 text-xs font-medium"
        >
          {t("skipToContent")}
        </a>

        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between border-b border-[var(--color-border)] px-3 py-3",
            collapsed && "justify-center px-2"
          )}
        >
          {!collapsed ? (
            <Link
              href="/dashboard/nexus"
              prefetch={false}
              className="flex items-center gap-2.5 text-[var(--color-text-main)] hover:opacity-85 transition-opacity"
            >
              <div className="flex items-center justify-center size-7 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shrink-0">
                <NexusLogo size={16} className="text-[var(--color-text-main)]" />
              </div>
              <span className="text-sm font-semibold tracking-tight">NEXUS</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/nexus"
              prefetch={false}
              className="flex items-center justify-center size-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:opacity-85 transition-opacity"
              title="NEXUS"
            >
              <NexusLogo size={16} className="text-[var(--color-text-main)]" />
            </Link>
          )}
          {/* Compatibility guard for prefetch static assertion */}
          <Link href="/home" prefetch={false} className="hidden" aria-hidden="true" tabIndex={-1} />

          {/* Desktop Collapse Toggle */}
          {!collapsed && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={t("collapseSidebar")}
              aria-label={t("collapseSidebar")}
              className="size-7 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
          )}

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden size-7 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] flex items-center justify-center transition-colors cursor-pointer"
              aria-label={tc("close")}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Collapsed Expand Toggle */}
        {collapsed && onToggleCollapse && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={onToggleCollapse}
              title={t("expandSidebar")}
              aria-label={t("expandSidebar")}
              className="size-8 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        )}

        {/* Search Input (Expanded only) */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-[var(--color-text-muted)] select-none pointer-events-none">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar navegação..."
                aria-label={tc("search")}
                className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-surface)]/60 border border-[var(--color-border)] focus:border-[var(--color-brand-accent)]/80 focus:ring-1 focus:ring-[var(--color-brand-accent)]/30 rounded-lg text-xs font-sans text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation Content */}
        <nav
          aria-label={t("mainNavigation")}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto py-2 custom-scrollbar",
            collapsed ? "px-2 space-y-1.5" : "px-3 space-y-4"
          )}
        >
          {filteredGroups.length === 0 && (
            <p className="px-3 py-4 text-xs text-[var(--color-text-muted)] font-sans">
              {tc("noResults")}
            </p>
          )}

          {filteredGroups.map((group, gIdx) => (
            <div key={group.id} className="space-y-0.5">
              {!collapsed && (
                <p className="px-2 pb-1 pt-1 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider font-sans">
                  {group.title}
                </p>
              )}
              {collapsed && gIdx > 0 && (
                <div className="border-t border-[var(--color-border)]/60 my-2 mx-1" />
              )}
              <div className={cn("space-y-0.5", collapsed && "space-y-1")}>
                {group.items.map((item) => renderItem(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "shrink-0 border-t border-[var(--color-border)] bg-[var(--color-sidebar)] relative",
            collapsed ? "p-2 flex flex-col items-center" : "px-3 py-2.5"
          )}
          style={{
            paddingBottom: isMacElectron ? "calc(0.5rem + var(--desktop-safe-bottom))" : undefined,
          }}
        >
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-sans">
                <span className="size-2 rounded-full bg-[var(--color-brand-accent)] shrink-0 shadow-[0_0_8px_var(--color-brand-accent)]" />
                <span>NEXUS v1.1.0</span>
              </div>

              {/* System Actions Dropdown */}
              <div className="relative" ref={systemMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowSystemMenu((prev) => !prev)}
                  title="Ações do sistema"
                  aria-label="Ações do sistema"
                  aria-expanded={showSystemMenu}
                  className="size-7 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>

                {showSystemMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSystemMenu(false);
                        setShowRestartModal(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-sans text-[var(--color-text-main)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[var(--color-text-muted)]">
                        restart_alt
                      </span>
                      <span>Reiniciar sistema</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSystemMenu(false);
                        setShowShutdownModal(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-sans text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        power_settings_new
                      </span>
                      <span>Desligar sistema</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative" ref={systemMenuRef}>
              <button
                type="button"
                onClick={() => setShowSystemMenu((prev) => !prev)}
                title="Ações do sistema"
                aria-label="Ações do sistema"
                aria-expanded={showSystemMenu}
                className="size-8 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>

              {showSystemMenu && (
                <div className="absolute bottom-full left-10 mb-2 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSystemMenu(false);
                      setShowRestartModal(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-sans text-[var(--color-text-main)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[var(--color-text-muted)]">
                      restart_alt
                    </span>
                    <span>Reiniciar sistema</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSystemMenu(false);
                      setShowShutdownModal(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-sans text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      power_settings_new
                    </span>
                    <span>Desligar sistema</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Tooltip for collapsed sidebar */}
      {collapsed && hoveredItem && (
        <div
          className="fixed z-200 pointer-events-none flex items-center"
          style={{ left: hoveredItem.x, top: hoveredItem.y, transform: "translateY(-50%)" }}
        >
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[6px] border-t-transparent border-b-transparent border-r-[var(--color-border)]" />
          <div className="px-2.5 py-1 bg-[var(--color-surface)] text-[var(--color-text-main)] text-xs font-sans rounded-md border border-[var(--color-border)] shadow-md whitespace-nowrap">
            {hoveredItem.label}
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showShutdownModal}
        onClose={() => setShowShutdownModal(false)}
        onConfirm={handleShutdown}
        title={t("shutdown")}
        message={t("shutdownConfirm")}
        confirmText={t("shutdown")}
        cancelText={tc("cancel")}
        variant="danger"
        loading={isShuttingDown}
      />

      <ConfirmModal
        isOpen={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        onConfirm={handleRestart}
        title={t("restart")}
        message={t("restartConfirm")}
        confirmText={t("restart")}
        cancelText={tc("cancel")}
        variant="warning"
        loading={isRestarting}
      />

      {/* Server Disconnected Modal */}
      {isDisconnected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="text-center p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-center size-14 rounded-full bg-red-500/10 text-red-500 mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px]">power_off</span>
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text-main)] mb-1 font-sans">
              {t("serverDisconnected")}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-5 font-sans">
              {t("serverDisconnectedMsg")}
            </p>
            <Button variant="secondary" onClick={() => globalThis.location.reload()}>
              {t("reloadPage")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
