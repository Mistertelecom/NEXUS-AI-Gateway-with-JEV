#!/usr/bin/env node
import { homedir } from "node:os";
import { join } from "node:path";

import productPackage from "../package.json" with { type: "json" };

process.env.NEXUS_PRODUCT_MODE = "1";
process.env.DATA_DIR ||= join(homedir(), ".nexus");
process.env.PORT ||= process.env.NEXUS_PORT || "20129";

const command = process.argv[2];

if (["--version", "-v", "-V", "version"].includes(command)) {
  console.log(`NEXUS ${productPackage.version}`);
} else if (command === "update") {
  const { runUpdateCommand } = await import("./cli/commands/update.mjs");
  process.exitCode = await runUpdateCommand();
} else {
  await import("./cli/nexusEnvironment.mjs");
  await import("./gateway.mjs");
}
