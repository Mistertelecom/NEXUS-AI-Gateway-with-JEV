import inheritedEnginePackage from "../../../open-sse/package.json" with { type: "json" };
import productPackage from "../../../package.json" with { type: "json" };

export const APP_CONFIG = {
  name: "NEXUS",
  description: "Control plane for Lead/Worker/JEV triage.",
  version: inheritedEnginePackage.version,
  productVersion: productPackage.version,
};

export const THEME_CONFIG = {
  storageKey: "theme",
  defaultTheme: "dark",
};
