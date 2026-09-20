import type { SidebarItemDefinition, SidebarSectionId } from "@/shared/constants/sidebarVisibility";

export type SidebarLabel = (key: string, fallback: string) => string;
export type NavigationItem = SidebarItemDefinition & { label: string; subtitle?: string };
export type NavigationGroup = {
  type: "group";
  id: string;
  title: string;
  separatorHidden?: boolean;
  items: NavigationItem[];
};
export type NavigationSection = {
  id: SidebarSectionId;
  title: string;
  showTitle?: boolean;
  children: Array<NavigationItem | NavigationGroup>;
};
export function isNavigationGroup(
  child: NavigationItem | NavigationGroup
): child is NavigationGroup {
  return "type" in child && child.type === "group";
}
