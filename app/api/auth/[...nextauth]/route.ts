import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { rateLimitOr429 } from "@/app/lib/rateLimit";

const handler = NextAuth(authOptions);

type RouteContext = {
  params: Promise<{ nextauth: string[] }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  return handler(req as any, context as any);
}

export async function POST(req: NextRequest, context: RouteContext) {
  // (Opcional) no limitar logs internos
  const { nextauth } = await context.params;
  const action = nextauth?.[0]; // "session", "callback", "_log", etc.

  if (action !== "_log") {
    const limited = await rateLimitOr429(req, {
      key: "auth:nextauth:post",
      limit: 20,
      windowMs: 60 * 1000,
    });
    if (limited) return limited;
  }

  return handler(req as any, context as any);
}
