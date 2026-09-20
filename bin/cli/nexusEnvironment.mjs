import { homedir } from "node:os";
import { join } from "node:path";

/** The only public-to-engine environment compatibility bridge. */
export function applyNexusEnvironment(env = process.env) {
  env.NEXUS_PRODUCT_MODE = "1";
  env.DATA_DIR ||= join(homedir(), ".nexus");
  env.PORT ||= env.NEXUS_PORT || "20129";
  env.API_PORT ||= env.PORT;
  env.DASHBOARD_PORT ||= env.PORT;
  env.HOST ||= env.NEXUS_HOST || "127.0.0.1";
  for (const suffix of [
    "API_KEY",
    "CONTEXT",
    "LANG",
    "CLI_SKIP_REPO_ENV",
    "NO_UPDATE_NOTIFIER",
    "MEMORY_MB",
    "USE_TURBOPACK",
  ]) {
    const value = env[`NEXUS_${suffix}`];
    if (typeof value === "string" && value.length) env[`OMNIROUTE_${suffix}`] = value;
  }
  // Never accidentally address another installed gateway through its inherited URL.
  env.OMNIROUTE_BASE_URL = env.NEXUS_BASE_URL || `http://127.0.0.1:${env.PORT}`;
  return env;
}

applyNexusEnvironment();
