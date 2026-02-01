import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export type PageStatus = "ACTIVE" | "UNDER_CONSTRUCTION" | "INACTIVE";

/**
 * Lista de páginas del FO que quieres controlar desde BO.
 * (Aquí defines “qué existe” en FO a efectos de administración.)
 */
export const FO_PAGES: Array<{ path: string; name: string }> = [
  { path: "/blog", name: "Blog" },
  { path: "/games", name: "Games" },
  { path: "/account/settings", name: "Account settings" },
  { path: "/classes", name: "Classes" },
  { path: "/account/bookings", name: "My bookings" },
];

export function normalizeFoPath(path: string): string {
  if (!path) return "/";
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

/** Asegura registros DB para todas las páginas FO (para listado BO) */
export async function ensureFoPagesExist() {
  await Promise.all(
    FO_PAGES.map((p) =>
      prisma.page.upsert({
        where: { path: p.path },
        create: { path: p.path, name: p.name, status: "ACTIVE" },
        update: { name: p.name },
        select: { id: true },
      }),
    ),
  );
}

export async function getFoPageStatus(path: string): Promise<PageStatus> {
  const normalized = normalizeFoPath(path);
  const row = await prisma.page.findUnique({
    where: { path: normalized },
    select: { status: true },
  });

  // Si no existe en DB, por defecto no bloqueamos (útil en dev/rutas nuevas)
  return (row?.status as PageStatus) ?? "ACTIVE";
}

/**
 * Gate para páginas FO.
 * - UNDER_CONSTRUCTION: redirect a /{locale}/under-construction
 * - INACTIVE: NO deberías permitir navegación (y opcionalmente bloquear acceso directo)
 */
export async function enforceFoPageStatus(opts: {
  locale: string;
  path: string;
}) {
  const status = await getFoPageStatus(opts.path);

  if (status === "UNDER_CONSTRUCTION") {
    redirect(`/${opts.locale}/under-construction`);
  }

  // Si quieres bloquear acceso directo cuando está INACTIVE:
  if (status === "INACTIVE") {
    // opción A (suave): mandar a home
    redirect(`/${opts.locale}/home`);

    // opción B (más estricta): notFound()
    // notFound();
  }
}
