import "server-only";
import nodemailer from "nodemailer";

function required(name: string, value?: string) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export async function sendResetCodeEmail(opts: {
  to: string;
  code: string;
  locale: string;
}) {
  const host = required("SMTP_HOST", process.env.SMTP_HOST);
  const port = Number(required("SMTP_PORT", process.env.SMTP_PORT));
  const secure = (process.env.SMTP_SECURE ?? "true") === "true";
  const user = required("SMTP_USER", process.env.SMTP_USER);
  const pass = required("SMTP_PASS", process.env.SMTP_PASS);
  const from = required("SMTP_FROM", process.env.SMTP_FROM);

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/${opts.locale}/reset-password`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const subject =
    opts.locale === "es"
      ? "Código para restablecer tu contraseña"
      : "Password reset code";

  const text =
    opts.locale === "es"
      ? `Tu código para restablecer la contraseña es: ${opts.code}\n\nVe a: ${resetUrl}\n\nCaduca en 1 hora.`
      : `Your password reset code is: ${opts.code}\n\nGo to: ${resetUrl}\n\nIt expires in 1 hour.`;

  const html =
    opts.locale === "es"
      ? `
        <p>Tu código para restablecer la contraseña es:</p>
        <p style="font-size:24px; font-weight:800; letter-spacing:2px">${opts.code}</p>
        <p>Ve a <a href="${resetUrl}">${resetUrl}</a></p>
        <p>Caduca en 1 hora.</p>
      `
      : `
        <p>Your password reset code is:</p>
        <p style="font-size:24px; font-weight:800; letter-spacing:2px">${opts.code}</p>
        <p>Go to <a href="${resetUrl}">${resetUrl}</a></p>
        <p>It expires in 1 hour.</p>
      `;

  await transporter.sendMail({
    from,
    to: opts.to,
    subject,
    text,
    html,
  });
}

export async function sendVerifyEmailCodeEmail(opts: {
  to: string;
  code: string;
  locale: string;
}) {
  const host = required("SMTP_HOST", process.env.SMTP_HOST);
  const port = Number(required("SMTP_PORT", process.env.SMTP_PORT));
  const secure = (process.env.SMTP_SECURE ?? "true") === "true";
  const user = required("SMTP_USER", process.env.SMTP_USER);
  const pass = required("SMTP_PASS", process.env.SMTP_PASS);
  const from = required("SMTP_FROM", process.env.SMTP_FROM);

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/${opts.locale}/verify-email`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const subject =
    opts.locale === "es" ? "Verifica tu correo" : "Verify your email";

  const text =
    opts.locale === "es"
      ? `Tu código para verificar el correo es: ${opts.code}\n\nVe a: ${verifyUrl}\n\nCaduca en 1 hora.`
      : `Your email verification code is: ${opts.code}\n\nGo to: ${verifyUrl}\n\nIt expires in 1 hour.`;

  const html =
    opts.locale === "es"
      ? `
        <p>Tu código para verificar el correo es:</p>
        <p style="font-size:24px; font-weight:800; letter-spacing:2px">${opts.code}</p>
        <p>Ve a <a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Caduca en 1 hora.</p>
      `
      : `
        <p>Your email verification code is:</p>
        <p style="font-size:24px; font-weight:800; letter-spacing:2px">${opts.code}</p>
        <p>Go to <a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>It expires in 1 hour.</p>
      `;

  await transporter.sendMail({
    from,
    to: opts.to,
    subject,
    text,
    html,
  });
}
