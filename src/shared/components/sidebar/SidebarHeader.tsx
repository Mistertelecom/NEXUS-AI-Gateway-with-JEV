import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import NexusLogo from "../NexusLogo";
import type { SidebarLabel } from "./types";
import styles from "./NexusSidebar.module.css";

type Props = {
  collapsed: boolean;
  name: string;
  customLogo: string | null;
  query: string;
  onQueryChange: (query: string) => void;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  label: SidebarLabel;
};

export function SidebarHeader({
  collapsed,
  name,
  customLogo,
  query,
  onQueryChange,
  onToggleCollapse,
  onClose,
  label,
}: Props) {
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName))
      )
        return;
      if (!search.current?.getClientRects().length) return;
      event.preventDefault();
      search.current.focus();
    };
    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);
  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <Link
          href="/dashboard/nexus"
          prefetch={false}
          onClick={onClose}
          className={styles.brand}
          aria-label={label("nexusOpenStudio", "Open NEXUS Pair Studio")}
        >
          <span className={styles.brandMark} aria-hidden="true">
            {customLogo ? (
              <Image src={customLogo} alt="" width={32} height={32} unoptimized />
            ) : (
              <NexusLogo size={32} />
            )}
          </span>
          {!collapsed && (
            <span className={styles.brandText}>
              <span className={styles.wordmark}>
                {name}
                <span className={styles.alphaBadge}>alpha</span>
              </span>
              <span className={styles.brandSubtitle}>
                {label("nexusControlPlane", "AI orchestration")}
              </span>
            </span>
          )}
        </Link>
        {onClose ? (
          <button
            type="button"
            className={styles.iconButton}
            onClick={onClose}
            aria-label={label("nexusCloseMenu", "Close navigation")}
          >
            <X size={18} aria-hidden="true" />
          </button>
        ) : (
          onToggleCollapse && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={onToggleCollapse}
              aria-expanded={!collapsed}
              title={
                collapsed
                  ? label("expandSidebar", "Expand sidebar")
                  : label("collapseSidebar", "Collapse sidebar")
              }
              aria-label={
                collapsed
                  ? label("expandSidebar", "Expand sidebar")
                  : label("collapseSidebar", "Collapse sidebar")
              }
            >
              {collapsed ? (
                <PanelLeftOpen size={17} aria-hidden="true" />
              ) : (
                <PanelLeftClose size={17} aria-hidden="true" />
              )}
            </button>
          )
        )}
      </div>
      {!collapsed && (
        <>
          <div className={styles.roleSignature} aria-label="Lead → JEV → Worker">
            <span className={styles.leadRole}>
              <i aria-hidden="true" />
              Lead
            </span>
            <span className={styles.roleConnector} aria-hidden="true" />
            <span className={styles.jevRole}>
              <i aria-hidden="true" />
              JEV
            </span>
            <span className={styles.roleConnector} aria-hidden="true" />
            <span className={styles.workerRole}>
              <i aria-hidden="true" />
              Worker
            </span>
          </div>
          <div className={styles.searchField}>
            <Search size={16} aria-hidden="true" />
            <input
              ref={search}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") onQueryChange("");
              }}
              placeholder={label("nexusMenuSearch", "Find a page")}
              aria-label={label("nexusMenuSearch", "Find a page")}
            />
            {!query && <kbd aria-hidden="true">/</kbd>}
          </div>
        </>
      )}
    </header>
  );
}
