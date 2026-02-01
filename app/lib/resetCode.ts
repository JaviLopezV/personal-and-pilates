import "server-only";
import crypto from "crypto";

export function generateResetCode(length = 6) {
  // 6 dígitos (100000-999999)
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  const code = String(crypto.randomInt(min, max + 1));
  return code;
}

export function hashResetCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function safeEqual(a: string, b: string) {
  // comparación segura
  const abuf = Buffer.from(a);
  const bbuf = Buffer.from(b);
  if (abuf.length !== bbuf.length) return false;
  return crypto.timingSafeEqual(abuf, bbuf);
}
