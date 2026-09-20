/**
 * SSRF and Network Egress Protection for Custom Providers
 * Blocks internal RFC 1918, loopback, link-local and DNS rebinding attacks.
 */

import dns from "dns/promises";
import net from "net";

export class SsrfBlockError extends Error {
  constructor(
    message: string,
    public ip?: string
  ) {
    super(message);
    this.name = "SsrfBlockError";
  }
}

/**
 * Checks if an IP is in a private, loopback, or link-local range.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  if (!net.isIP(ip)) return false;

  // IPv4 checks
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    const [b0, b1] = parts;

    // 0.0.0.0/8 (Current network)
    if (b0 === 0) return true;

    // 10.0.0.0/8 (Private network)
    if (b0 === 10) return true;

    // 100.64.0.0/10 (Carrier-grade NAT / shared address space)
    if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;

    // 127.0.0.0/8 (Loopback)
    if (b0 === 127) return true;

    // 169.254.0.0/16 (Link-local)
    if (b0 === 169 && b1 === 254) return true;

    // 172.16.0.0/12 (Private network)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;

    // 192.168.0.0/16 (Private network)
    if (b0 === 192 && b1 === 168) return true;

    // 224.0.0.0/4 (Multicast) and 240.0.0.0/4 (Reserved)
    if (b0 >= 224) return true;

    return false;
  }

  // IPv6 checks
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    // ::/128 (Unspecified)
    if (normalized === "::" || normalized === "0:0:0:0:0:0:0:0") return true;

    // ::1 (Loopback)
    if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;

    // ::ffff:0:0/96 (IPv4-mapped IPv6). Re-run the IPv4 policy on the suffix.
    const mappedIpv4 = normalized.match(/^(?:::ffff:|0:0:0:0:0:ffff:)(\d+\.\d+\.\d+\.\d+)$/)?.[1];
    if (mappedIpv4 && isPrivateOrReservedIp(mappedIpv4)) return true;

    // fc00::/7 (Unique local address)
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

    // fe80::/10 (Link-local)
    if (
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    )
      return true;

    // ff00::/8 (Multicast)
    if (normalized.startsWith("ff")) return true;

    return false;
  }

  return false;
}

/**
 * Validates a target URL against SSRF rules and administrative allowlist.
 */
export async function validateOutboundUrl(
  urlString: string,
  options: { allowlist?: string[]; allowPrivate?: boolean; throwOnError?: boolean } = {}
): Promise<{
  valid: boolean;
  allowed: boolean;
  resolvedIp?: string;
  hostname?: string;
  reason?: string;
}> {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    const reason = `Formato de URL inválido: '${urlString}'`;
    if (options.throwOnError) throw new SsrfBlockError(reason);
    return { valid: false, allowed: false, reason };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    const reason = `Protocolo não permitido: '${parsed.protocol}'. Apenas http: e https: são suportados.`;
    if (options.throwOnError) throw new SsrfBlockError(reason);
    return { valid: false, allowed: false, reason };
  }

  const hostname = parsed.hostname.toLowerCase();
  const allowlist =
    options.allowlist ||
    (process.env.NEXUS_SSRF_ALLOWLIST ? process.env.NEXUS_SSRF_ALLOWLIST.split(",") : []);

  // Check explicit allowlist or allowPrivate
  if (allowlist.includes(hostname) || allowlist.includes(parsed.host) || options.allowPrivate) {
    return { valid: true, allowed: true, resolvedIp: "allowlisted", hostname };
  }

  // Check direct IP hostname
  if (net.isIP(hostname)) {
    if (isPrivateOrReservedIp(hostname)) {
      const reason = `Acesso ao IP privado ou de loopback '${hostname}' bloqueado por proteção SSRF.`;
      if (options.throwOnError) throw new SsrfBlockError(reason, hostname);
      return { valid: false, allowed: false, reason };
    }
    return { valid: true, allowed: true, resolvedIp: hostname, hostname };
  }

  // Check localhost
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    const reason = `Acesso a 'localhost' bloqueado por proteção SSRF.`;
    if (options.throwOnError) throw new SsrfBlockError(reason, "127.0.0.1");
    return { valid: false, allowed: false, reason };
  }

  // Resolve DNS to verify IP
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const addr of addresses) {
      if (isPrivateOrReservedIp(addr.address)) {
        const reason = `Host '${hostname}' resolve para IP privado ou de loopback '${addr.address}'. Bloqueado por proteção SSRF.`;
        if (options.throwOnError) throw new SsrfBlockError(reason, addr.address);
        return { valid: false, allowed: false, reason };
      }
    }
    return {
      valid: true,
      allowed: true,
      resolvedIp: addresses[0]?.address || "unknown",
      hostname,
    };
  } catch (err: any) {
    if (err instanceof SsrfBlockError) {
      if (options.throwOnError) throw err;
      return { valid: false, allowed: false, reason: err.message };
    }
    const reason = `Falha na resolução DNS para o host '${hostname}': ${err.message}`;
    if (options.throwOnError) throw new SsrfBlockError(reason);
    return { valid: false, allowed: false, reason };
  }
}

export const isPrivateIp = isPrivateOrReservedIp;
