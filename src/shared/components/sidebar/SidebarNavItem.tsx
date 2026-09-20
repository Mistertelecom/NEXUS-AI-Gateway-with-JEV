import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { SidebarIcon } from "./SidebarIcon";
import type { NavigationItem, SidebarLabel } from "./types";
import styles from "./NexusSidebar.module.css";

type Props = {
  item: NavigationItem;
  active: boolean;
  collapsed: boolean;
  pinned: boolean;
  onClose?: () => void;
  onPin: (id: string) => void;
  label: SidebarLabel;
};

export function SidebarNavItem({ item, active, collapsed, pinned, onClose, onPin, label }: Props) {
  const content = (
    <>
      <span className={styles.itemIcon}>
        <SidebarIcon name={item.icon} />
      </span>
      <span className={styles.itemLabel}>{item.label}</span>
      {item.external && !collapsed && (
        <ArrowUpRight size={13} className={styles.externalIcon} aria-hidden="true" />
      )}
    </>
  );
  return (
    <div className={styles.navItem} data-active={active} data-pinned={pinned}>
      {item.external ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={styles.navLink}
          title={item.label}
          aria-label={collapsed ? item.label : undefined}
        >
          {content}
        </a>
      ) : (
        <Link
          href={item.href}
          prefetch={false}
          onClick={onClose}
          className={styles.navLink}
          title={collapsed ? item.label : undefined}
          aria-label={collapsed ? item.label : undefined}
          aria-current={active ? "page" : undefined}
        >
          {content}
        </Link>
      )}
      {!collapsed && item.id !== "home" && (
        <button
          type="button"
          className={styles.pinButton}
          onClick={() => onPin(item.id)}
          title={pinned ? label("unpinItem", "Unpin item") : label("pinItem", "Pin item")}
          aria-label={pinned ? label("unpinItem", "Unpin item") : label("pinItem", "Pin item")}
          aria-pressed={pinned}
        >
          <Star
            size={14}
            strokeWidth={1.7}
            fill={pinned ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
