/**
 * Loop Protection for NEXUS Gateway
 * Prevents recursive routing loops when agents or gateways call each other.
 * Tracks and increments `X-Nexus-Hop-Count` (maximum 5 hops).
 */

export const MAX_HOP_COUNT = 5;
export const HOP_HEADER = "x-nexus-hop-count";

export interface LoopCheckResult {
  allowed: boolean;
  currentHop: number;
  nextHop: number;
  error?: string;
}

export function checkLoopProtection(
  headers: Headers | Record<string, string | string[] | undefined>
): LoopCheckResult {
  let hopValue = "0";

  if (headers instanceof Headers) {
    hopValue = headers.get(HOP_HEADER) || "0";
  } else {
    const raw = headers[HOP_HEADER] || headers["X-Nexus-Hop-Count"];
    if (Array.isArray(raw)) {
      hopValue = raw[0] || "0";
    } else if (typeof raw === "string") {
      hopValue = raw;
    }
  }

  const currentHop = parseInt(hopValue, 10) || 0;

  if (currentHop >= MAX_HOP_COUNT) {
    return {
      allowed: false,
      currentHop,
      nextHop: currentHop + 1,
      error: `Loop detectado no NEXUS Gateway: 'X-Nexus-Hop-Count' excedeu o limite máximo de ${MAX_HOP_COUNT} saltos (valor atual: ${currentHop}). Verifique se um agente está chamando a si mesmo em cascata infinita.`,
    };
  }

  return {
    allowed: true,
    currentHop,
    nextHop: currentHop + 1,
  };
}
