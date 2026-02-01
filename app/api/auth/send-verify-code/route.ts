import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { rateLimitOr429 } from "@/app/lib/rateLimit";
import { generateResetCode, hashResetCode } from "@/app/lib/resetCode";
import { sendVerifyEmailCodeEmail } from "@/app/lib/email";

const schema = z.object({
  email: z.string().email(),
  locale: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // rate limit: 5 intentos por 15 min (por IP)
  const limited = await rateLimitOr429(req, {
    key: "send_verify_code",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { email } = parsed.data;
  const locale = parsed.data.locale || "es";

  // Respuesta siempre OK (anti-enumeración)
  const okResponse = NextResponse.json({ ok: true });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return okResponse;

  // Si ya está verificado, no hacemos nada
  if (user.emailVerifiedAt && !user.disabled) return okResponse;

  const code = generateResetCode(6);
  const codeHash = hashResetCode(code);
  const exp = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.user.update({
    where: { id: user.id },
    data: {
      disabled: true,
      verifyTokenHash: codeHash,
      verifyTokenExp: exp,
      emailVerifiedAt: null,
    },
  });

  try {
    await sendVerifyEmailCodeEmail({ to: email, code, locale });
  } catch (e) {
    // no revelar fallos de email
    console.error("sendVerifyEmailCodeEmail failed:", e);
  }

  return okResponse;
}
