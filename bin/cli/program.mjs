import { Command, Option } from "commander";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { registerCommands } from "./commands/registry.mjs";
import { t } from "./i18n.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "..", "package.json"), "utf8"));
const isNexusPackage = pkg.name === "nexus-ai-control-plane";

function productHelp(text) {
  if (!isNexusPackage) return text;
  return text
    .replaceAll("OMNIROUTE", "NEXUS")
    .replaceAll("OmniRoute", "NEXUS")
    .replaceAll("omniroute", "nexus")
    .replaceAll("20128", "20129");
}

export function createProgram() {
  const program = new Command();
  if (isNexusPackage) {
    program.configureOutput({
      writeOut: (text) => process.stdout.write(productHelp(text)),
      writeErr: (text) => process.stderr.write(productHelp(text)),
      outputError: (text, write) => write(productHelp(text)),
    });
  }

  program
    .name("omniroute")
    .description(t("program.description"))
    .version(pkg.version, "-v, --version", t("program.version"))
    .addOption(
      new Option("--output <format>", t("program.output"))
        .choices(["table", "json", "jsonl", "csv"])
        .default("table")
    )
    .addOption(new Option("-q, --quiet", t("program.quiet")))
    .addOption(new Option("--no-color", t("program.no_color")))
    .addOption(new Option("--timeout <ms>", t("program.timeout")).default("30000"))
    .addOption(
      new Option("--api-key <key>", t("program.api_key")).env(
        isNexusPackage ? "NEXUS_API_KEY" : "OMNIROUTE_API_KEY"
      )
    )
    .addOption(
      new Option("--base-url <url>", t("program.base_url")).env(
        isNexusPackage ? "NEXUS_BASE_URL" : "OMNIROUTE_BASE_URL"
      )
    )
    .addOption(
      new Option(
        "--context <name>",
        t("program.context") || "Server context/profile to use for this command"
      ).env(isNexusPackage ? "NEXUS_CONTEXT" : "OMNIROUTE_CONTEXT")
    )
    .addOption(new Option("--lang <code>", t("program.lang")))
    .showHelpAfterError(true)
    .exitOverride();

  registerCommands(program);
  return program;
}
