import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { rateLimitOr429 } from "@/app/lib/rateLimit";
import { hashResetCode, safeEqual } from "@/app/lib/resetCode";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
});

export async function POST(req: NextRequest) {
  // rate limit: 10 intentos por 10 min (por IP)
  const limited = await rateLimitOr429(req, {
    key: "verify_email_code",
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { email, code } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  // ya verificado
  if (user.emailVerifiedAt && !user.disabled) {
    return NextResponse.json({ ok: true });
  }

  if (!user.verifyTokenHash || !user.verifyTokenExp) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  if (new Date() > user.verifyTokenExp) {
    return NextResponse.json({ error: "CODE_EXPIRED" }, { status: 400 });
  }

  const incomingHash = hashResetCode(code);
  const ok = safeEqual(incomingHash, user.verifyTokenHash);
  if (!ok) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      disabled: false,
      emailVerifiedAt: new Date(),
      verifyTokenHash: null,
      verifyTokenExp: null,
    },
  });

  return NextResponse.json({ ok: true });
}
