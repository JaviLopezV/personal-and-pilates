import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { rateLimitOr429 } from "@/app/lib/rateLimit";
import { hashResetCode, safeEqual } from "@/app/lib/resetCode";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  // rate limit: 10 intentos por 10 min
  const limited = await rateLimitOr429(req, {
    key: "reset_password",
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { email, code, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.resetTokenHash || !user.resetTokenExp) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  if (new Date() > user.resetTokenExp) {
    return NextResponse.json({ error: "CODE_EXPIRED" }, { status: 400 });
  }

  const incomingHash = hashResetCode(code);
  const ok = safeEqual(incomingHash, user.resetTokenHash);
  if (!ok) {
    return NextResponse.json({ error: "INVALID_CODE" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetTokenHash: null,
      resetTokenExp: null,
    },
  });

  return NextResponse.json({ ok: true });
}
