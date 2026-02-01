"use server";

import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const RoleSchema = z.enum(["CLIENT", "ADMIN", "SUPERADMIN"]);
type Role = z.infer<typeof RoleSchema>;

async function requireBoUser(locale: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as Role | undefined;
  const userId = (session?.user as any)?.id as string | undefined;

  if (!session) redirect(`/${locale}/login`);
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect(`/${locale}`);

  return { role, userId };
}

function canAdminDisableTarget(actorRole: Role, targetRole: Role) {
  if (actorRole === "SUPERADMIN") return true;
  // ADMIN: no puede deshabilitar ADMIN/SUPERADMIN
  if (actorRole === "ADMIN") return targetRole === "CLIENT";
  return false;
}

function canAdminSetRole(actorRole: Role, targetRole: Role, newRole: Role) {
  if (actorRole === "SUPERADMIN") return true;

  // ADMIN: puede alternar CLIENT <-> ADMIN, pero nunca tocar SUPERADMIN
  if (actorRole === "ADMIN") {
    const canPromote = targetRole === "CLIENT" && newRole === "ADMIN";
    const canDemote = targetRole === "ADMIN" && newRole === "CLIENT";
    return canPromote || canDemote;
  }

  return false;
}

export async function setUserDisabled(
  locale: string,
  userId: string,
  formData: FormData,
) {
  const { role: actorRole, userId: actorId } = await requireBoUser(locale);

  // Evitar auto-bloqueo accidental
  if (actorId && actorId === userId) return;

  const desired = String(formData.get("disabled") ?? "");
  const parsedDisabled = z.enum(["true", "false"]).safeParse(desired);
  if (!parsedDisabled.success) return;

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) return;

  const targetRole = target.role as Role;

  if (!canAdminDisableTarget(actorRole, targetRole)) return;

  await prisma.user.update({
    where: { id: userId },
    data: { disabled: parsedDisabled.data === "true" },
    select: { id: true },
  });

  // Refrescar el listado de usuarios tras la acción
  revalidatePath(`/${locale}/bo/users`);
}

export async function setUserRole(
  locale: string,
  userId: string,
  formData: FormData,
) {
  const { role: actorRole, userId: actorId } = await requireBoUser(locale);

  // Evitar que alguien se quite su propio acceso por accidente
  if (actorId && actorId === userId) return;

  const desired = String(formData.get("role") ?? "");
  const parsedRole = RoleSchema.safeParse(desired);
  if (!parsedRole.success) return;

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) return;

  const targetRole = target.role as Role;
  const newRole = parsedRole.data;

  if (!canAdminSetRole(actorRole, targetRole, newRole)) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
    select: { id: true },
  });

  // Refrescar el listado de usuarios tras la acción
  revalidatePath(`/${locale}/bo/users`);
}
