import path from "node:path";

const NEXUS_PACKAGE_NAME = "nexus-ai-control-plane";

/**
 * @param {string} prefix
 * @param {{ readonly name: string, readonly bin: Readonly<Record<string, string>> }} manifest
 */
export function resolvePackBootPaths(prefix, manifest) {
  const executable = manifest.name === NEXUS_PACKAGE_NAME ? "nexus" : "omniroute";
  if (typeof manifest.bin?.[executable] !== "string") {
    throw new Error(`Package ${manifest.name} does not declare its ${executable} executable`);
  }
  return {
    packageRoot: path.join(prefix, "lib", "node_modules", manifest.name),
    binPath: path.join(prefix, "bin", executable),
  };
}

/**
 * @param {{ readonly name: string, readonly version: string }} manifest
 * @param {string} engineVersion
 */
export function resolvePackBootVersions(manifest, engineVersion) {
  const isNexus = manifest.name === NEXUS_PACKAGE_NAME;
  return {
    cliVersion: isNexus ? `NEXUS ${manifest.version}` : manifest.version,
    healthVersion: isNexus ? engineVersion : manifest.version,
  };
}

/** @param {string} output @param {string} expectedVersion */
export function evaluateCliVersion(output, expectedVersion) {
  const actualVersion = output.trim();
  const failures =
    actualVersion === expectedVersion
      ? []
      : [`CLI version "${actualVersion}" (expected "${expectedVersion}")`];
  return { ok: failures.length === 0, failures };
}
