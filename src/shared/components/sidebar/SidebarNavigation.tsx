import { useId } from "react";
import { ChevronDown, Pin, Settings2 } from "lucide-react";
import type { SidebarSectionId } from "@/shared/constants/sidebarVisibility";
import { SidebarNavItem } from "./SidebarNavItem";
import {
  isNavigationGroup,
  type NavigationItem,
  type NavigationSection,
  type SidebarLabel,
} from "./types";
import styles from "./NexusSidebar.module.css";

type Props = {
  sections: NavigationSection[];
  collapsed: boolean;
  searching: boolean;
  activeHref: string | null;
  expanded: ReadonlySet<SidebarSectionId>;
  pinnedSections: ReadonlySet<SidebarSectionId>;
  pinnedItems: ReadonlySet<string>;
  pinnedCollapsed: boolean;
  onToggle: (id: SidebarSectionId) => void;
  onPinSection: (id: SidebarSectionId) => void;
  onPinItem: (id: string) => void;
  onClose?: () => void;
  label: SidebarLabel;
};

export function SidebarNavigation(props: Props) {
  const scope = useId();
  const { sections, collapsed, searching, label } = props;
  const renderItem = (item: NavigationItem) => (
    <SidebarNavItem
      key={item.id}
      item={item}
      active={!item.external && props.activeHref === item.href}
      collapsed={collapsed}
      pinned={props.pinnedItems.has(item.id)}
      onPin={props.onPinItem}
      onClose={props.onClose}
      label={label}
    />
  );
  return (
    <>
      {searching && !sections.length && (
        <p className={styles.emptySearch}>{label("nexusNoPages", "No matching pages.")}</p>
      )}
      {sections.map((section) => {
        const core = section.id === "nexus";
        const open =
          collapsed ||
          core ||
          searching ||
          section.showTitle === false ||
          (section.id === "pinned" ? !props.pinnedCollapsed : props.expanded.has(section.id));
        const pinned = props.pinnedSections.has(section.id);
        const contentId = `${scope}-${section.id}`;
        return (
          <section
            key={section.id}
            className={styles.section}
            data-core={core}
            aria-label={section.title}
          >
            {!collapsed && !core && section.showTitle !== false && (
              <div className={styles.sectionHead}>
                <button
                  type="button"
                  className={styles.sectionToggle}
                  data-section-id={section.id}
                  aria-expanded={open}
                  aria-controls={contentId}
                  onClick={() => props.onToggle(section.id)}
                >
                  {section.id === "configuration" && (
                    <Settings2 size={18} strokeWidth={1.7} aria-hidden="true" />
                  )}
                  <span>{section.title}</span>
                  <ChevronDown className={styles.chevron} size={15} aria-hidden="true" />
                </button>
                {section.id !== "pinned" && (
                  <button
                    type="button"
                    className={styles.sectionPin}
                    onClick={() => props.onPinSection(section.id)}
                    aria-pressed={pinned}
                    title={
                      pinned
                        ? label("unpinSection", "Unpin section")
                        : label("pinSectionOpen", "Keep section open")
                    }
                    aria-label={
                      pinned
                        ? label("unpinSection", "Unpin section")
                        : label("pinSectionOpen", "Keep section open")
                    }
                  >
                    <Pin size={12} fill={pinned ? "currentColor" : "none"} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
            <div id={contentId} hidden={!open} className={styles.sectionContent}>
              {section.children.map((child) =>
                isNavigationGroup(child) ? (
                  <div className={styles.navGroup} key={child.id}>
                    {!child.separatorHidden && <h2 className={styles.groupLabel}>{child.title}</h2>}
                    {child.items.map(renderItem)}
                  </div>
                ) : (
                  renderItem(child)
                )
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
