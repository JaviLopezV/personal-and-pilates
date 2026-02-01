import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function getIP(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  const rip = req.headers.get("x-real-ip");
  if (rip) return rip.trim();

  return "unknown";
}

/**
 * Rate limit global (multi-instancia) usando Redis.
 * Ventana fija por buckets (windowMs).
 */
export async function rateLimitOr429(
  req: NextRequest,
  opts: { key: string; limit: number; windowMs: number }
): Promise<NextResponse | null> {
  const ip = getIP(req);
  const now = Date.now();

  const windowSec = Math.max(1, Math.ceil(opts.windowMs / 1000));
  const windowId = Math.floor(now / (windowSec * 1000)); // bucket fijo
  const redisKey = `rl:${opts.key}:${ip}:${windowId}`;

  // INCR + EXPIRE (TTL) para que se limpie solo
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.expire(redisKey, windowSec);
  }

  if (count > opts.limit) {
    const ttl = await redis.ttl(redisKey);
    const retryAfterSec =
      typeof ttl === "number" && ttl > 0 ? ttl : windowSec;

    return NextResponse.json(
      { error: "RATE_LIMITED", retryAfterSec },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
        },
      }
    );
  }

  return null;
}
