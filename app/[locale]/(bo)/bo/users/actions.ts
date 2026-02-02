"use server";

import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const RoleSchema = z.enum(["CLIENT", "ADMIN", "SUPERADMIN"]);
type Role = z.infer<typeof RoleSchema>;

export type UserActionState =
  | { ok: true; userId?: string }
  | {
      ok: false;
      formError?: string;
      fieldErrors?: Record<string, string[]>;
    };

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

function canAdminCreateRole(actorRole: Role, newRole: Role) {
  if (actorRole === "SUPERADMIN") return true;
  // ADMIN: puede crear CLIENT o ADMIN, nunca SUPERADMIN
  if (actorRole === "ADMIN") return newRole === "CLIENT" || newRole === "ADMIN";
  return false;
}

function canAdminEditTarget(actorRole: Role, targetRole: Role) {
  if (actorRole === "SUPERADMIN") return true;
  // ADMIN: solo puede editar CLIENT y ADMIN (nunca SUPERADMIN)
  if (actorRole === "ADMIN") return targetRole !== "SUPERADMIN";
  return false;
}

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().optional().or(z.literal("")),
  role: RoleSchema,
  disabled: z.enum(["true", "false"]).default("false"),
  availableClasses: z.coerce.number().int().min(0).default(0),
  password: z.string().min(8),
});

const UpdateUserSchema = z.object({
  name: z.string().trim().optional().or(z.literal("")),
  role: RoleSchema.optional(),
  disabled: z.enum(["true", "false"]).optional(),
  availableClasses: z.coerce.number().int().min(0),
  password: z.string().optional().or(z.literal("")),
});

export async function createUser(
  locale: string,
  _prev: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const { role: actorRole } = await requireBoUser(locale);

  const parsed = CreateUserSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    role: formData.get("role"),
    disabled: formData.get("disabled"),
    availableClasses: formData.get("availableClasses"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return { ok: false, fieldErrors: flat.fieldErrors as any };
  }

  if (!canAdminCreateRole(actorRole, parsed.data.role)) {
    return { ok: false, formError: "No autorizado." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, fieldErrors: { email: ["Email ya existe."] } };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const created = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name ? String(parsed.data.name).trim() : null,
      role: parsed.data.role as any,
      disabled: parsed.data.disabled === "true",
      availableClasses: parsed.data.availableClasses,
      password: passwordHash,
    },
    select: { id: true },
  });

  revalidatePath(`/${locale}/bo/users`);
  return { ok: true, userId: created.id };
}

export async function updateUser(
  locale: string,
  userId: string,
  _prev: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const { role: actorRole, userId: actorId } = await requireBoUser(locale);

  const parsed = UpdateUserSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    disabled: (formData.get("disabled") as any) || undefined,
    availableClasses: formData.get("availableClasses"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return { ok: false, fieldErrors: flat.fieldErrors as any };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) return { ok: false, formError: "Usuario no encontrado." };

  const targetRole = target.role as Role;
  if (!canAdminEditTarget(actorRole, targetRole)) {
    return { ok: false, formError: "No autorizado." };
  }

  const isSelf = actorId && actorId === userId;

  const data: any = {
    name: parsed.data.name ? String(parsed.data.name).trim() : null,
    availableClasses: parsed.data.availableClasses,
  };

  // Solo permitir cambiar rol/disabled si no es self
  if (!isSelf) {
    if (parsed.data.disabled) {
      const desiredDisabled = parsed.data.disabled === "true";
      if (canAdminDisableTarget(actorRole, targetRole)) {
        data.disabled = desiredDisabled;
      }
    }

    if (parsed.data.role) {
      const newRole = parsed.data.role;
      if (canAdminSetRole(actorRole, targetRole, newRole)) {
        data.role = newRole;
      }
    }
  }

  if (parsed.data.password && parsed.data.password.trim().length > 0) {
    if (parsed.data.password.trim().length < 8) {
      return { ok: false, fieldErrors: { password: ["Mínimo 8 caracteres."] } };
    }
    data.password = await bcrypt.hash(parsed.data.password.trim(), 10);
  }

  await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true },
  });


  revalidatePath(`/${locale}/bo/users`);
  revalidatePath(`/${locale}/bo/users/${userId}/edit`);
  return { ok: true, userId };
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
