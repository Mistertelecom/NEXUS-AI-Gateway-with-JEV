import type { ModelCapability } from "../types";

export function parseDiscoveredModels(stdout: string): ModelCapability[] {
  const models: ModelCapability[] = [];
  for (const line of stdout.split("\n")) {
    const trimmed = line.replace(/^[⠋⠙⠹⠸⠼⠴⠦⠧⠇\s]+Fetching available models\.\.\./g, "").trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^([a-zA-Z0-9.\-_]+)\s+(.+)$/);
    if (!match) continue;

    const [, id, rawName] = match;
    if (!id || !rawName) continue;
    const name = rawName.trim();
    models.push({
      id: `antigravity/${id}`,
      name,
    });
  }
  return models;
}
