import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Ellipsis, Plug, Power, RotateCw, Settings2 } from "lucide-react";
import type { SidebarLabel } from "./types";
import styles from "./NexusSidebar.module.css";

type Props = {
  collapsed: boolean;
  version: string;
  onRestart: () => void;
  onShutdown: () => void;
  onClose?: () => void;
  label: SidebarLabel;
  syncStatus?: ReactNode;
};

export function SidebarFooter({
  collapsed,
  version,
  onRestart,
  onShutdown,
  onClose,
  label,
  syncStatus,
}: Props) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menu.current && event.target instanceof Node && !menu.current.contains(event.target))
        menu.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  const closeAndRun = (action: () => void) => {
    if (menu.current) menu.current.open = false;
    action();
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.utilityLinks}>
        <Link
          href="/dashboard/endpoint"
          prefetch={false}
          onClick={onClose}
          className={styles.utilityLink}
          title={label("nexusApiEndpoint", "API endpoint")}
          aria-label={collapsed ? label("nexusApiEndpoint", "API endpoint") : undefined}
        >
          <Plug size={17} strokeWidth={1.7} aria-hidden="true" />
          <span>{label("nexusApiEndpoint", "API endpoint")}</span>
        </Link>
        <Link
          href="/docs"
          prefetch={false}
          onClick={onClose}
          className={styles.utilityLink}
          title={label("docs", "Documentation")}
          aria-label={collapsed ? label("docs", "Documentation") : undefined}
        >
          <BookOpen size={17} strokeWidth={1.7} aria-hidden="true" />
          <span>{label("docs", "Documentation")}</span>
        </Link>
      </div>
      <div className={styles.instanceRow}>
        {!collapsed && (
          <div className={styles.instanceText}>
            <span>{label("nexusInstance", "NEXUS instance")}</span>
            <span className={styles.version}>{version}</span>
          </div>
        )}
        <details
          ref={menu}
          className={styles.systemMenu}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current) {
              menu.current.open = false;
              menu.current.querySelector("summary")?.focus();
            }
          }}
        >
          <summary
            className={styles.iconButton}
            title={label("nexusSystemMenu", "Instance controls")}
            aria-label={label("nexusSystemMenu", "Instance controls")}
          >
            <Ellipsis size={20} aria-hidden="true" />
          </summary>
          <div className={styles.systemPopover}>
            <p className={styles.popoverTitle}>{label("nexusSystemMenu", "Instance controls")}</p>
            <Link
              href="/dashboard/settings/general"
              prefetch={false}
              onClick={() => closeAndRun(() => onClose?.())}
            >
              <Settings2 size={16} aria-hidden="true" />
              {label("configurationSection", "Settings")}
            </Link>
            {syncStatus}
            <div className={styles.popoverDivider} />
            <button type="button" onClick={() => closeAndRun(onRestart)}>
              <RotateCw size={16} aria-hidden="true" />
              {label("restart", "Restart")}
            </button>
            <button
              type="button"
              className={styles.destructiveAction}
              onClick={() => closeAndRun(onShutdown)}
            >
              <Power size={16} aria-hidden="true" />
              {label("shutdown", "Shut down")}
            </button>
          </div>
        </details>
      </div>
    </footer>
  );
}
