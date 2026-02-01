import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/").filter(Boolean);
  const maybe = seg[0];
  return routing.locales.includes(maybe as any)
    ? (maybe as (typeof routing.locales)[number])
    : routing.defaultLocale;
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Deja pasar cosas que no quieres proteger
  // (API ya está fuera por matcher, pero esto evita sustos si cambias config)
  if (pathname.startsWith("/api")) return intlMiddleware(req);

  const locale = getLocaleFromPath(pathname);

  const isAuthRoute = pathname.startsWith(`/${locale}/auth`);
  if (isAuthRoute) {
    return intlMiddleware(req);
  }

  const isBO = pathname.startsWith(`/${locale}/bo`);
  const isAccount = pathname.startsWith(`/${locale}/account`);

  // Solo protegemos estas zonas (ajusta si quieres más)
  const isProtected = isBO || isAccount;

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // No logueado -> /{locale}/auth
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/auth`;
      url.search = "";
      return NextResponse.redirect(url);
    }

    // BO solo ADMIN
    if (isBO && (token as any)?.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/auth`; // o `/${locale}` si prefieres
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Siempre aplicar i18n al final (o devolver redirects/rewrites de locale)
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
