import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { requireManagementAuth } from "@/lib/api/requireManagementAuth";
import { issueDashboardCsrfToken } from "@/server/authz/csrf";
import { isAuthRequired, isLoopbackRequest } from "@/shared/utils/apiAuth";
import { getDashboardJwtSecret } from "@/shared/utils/dashboardSessionToken";

export async function GET(request: Request) {
  const authError = await requireManagementAuth(request);
  if (authError) return authError;

  let mintedToken: string | null = null;
  try {
    const cookieStore = await cookies();
    const existingToken = cookieStore.get("auth_token")?.value;
    if (
      !existingToken &&
      isLoopbackRequest(request) &&
      !(await isAuthRequired(request, { loopback: true }))
    ) {
      const secret = getDashboardJwtSecret();
      if (secret) {
        mintedToken = await new SignJWT({ authenticated: true })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("30d")
          .sign(secret);
        cookieStore.set("auth_token", mintedToken, {
          httpOnly: true,
          secure: process.env.AUTH_COOKIE_SECURE === "true",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    }
  } catch {}

  const effectiveRequest =
    mintedToken && !request.headers.get("cookie")?.includes("auth_token")
      ? new Request(request.url, {
          method: request.method,
          headers: new Headers([
            ...request.headers.entries(),
            ["cookie", `auth_token=${mintedToken}`],
          ]),
        })
      : request;

  const issued = issueDashboardCsrfToken(effectiveRequest);
  return NextResponse.json(issued ?? { token: null, expiresAt: null }, {
    headers: { "Cache-Control": "no-store" },
  });
}
