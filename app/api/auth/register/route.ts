import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";
import { randomUUID } from "crypto";
import { rateLimitOr429 } from "@/app/lib/rateLimit";
import { generateResetCode, hashResetCode } from "@/app/lib/resetCode";
import { sendVerifyEmailCodeEmail } from "@/app/lib/email";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  locale: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // ✅ 5 registros / minuto / IP
  const limited = await rateLimitOr429(req, {
    key: "auth:register",
    limit: 5,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, password, name } = parsed.data;
  const locale = (parsed.data as any).locale || "es";

  const exists = await db.query('SELECT id FROM "User" WHERE email=$1', [
    email,
  ]);
  if (exists.rowCount) {
    return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const id = randomUUID();

  // ✅ email verification
  const code = generateResetCode(6);
  const codeHash = hashResetCode(code);
  const exp = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await db.query(
    `INSERT INTO "User"(
      id,
      email,
      password,
      name,
      role,
      disabled,
      "emailVerifiedAt",
      "verifyTokenHash",
      "verifyTokenExp",
      "createdAt",
      "updatedAt"
    )
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), now())`,
    [
      id,
      email,
      hash,
      name ?? null,
      "CLIENT",
      true, // ⬅️ deshabilitado hasta verificar email
      null,
      codeHash,
      exp,
    ],
  );

  try {
    await sendVerifyEmailCodeEmail({ to: email, code, locale });
  } catch (e) {
    console.error("sendVerifyEmailCodeEmail failed:", e);
  }

  return NextResponse.json(
    { ok: true, needsEmailVerification: true },
    { status: 201 },
  );
}
