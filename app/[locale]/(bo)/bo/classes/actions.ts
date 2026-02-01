"use server";

import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export type ClassActionState =
  | { ok: true; classId?: string }
  | { ok: false; fieldErrors?: Record<string, string[]>; formError?: string };

async function requireBoUser(locale: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) redirect(`/${locale}/login`);
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect(`/${locale}`);

  return true;
}

const ClassUpsertSchema = z.object({
  title: z.string().min(1, "Título obligatorio"),
  type: z.string().min(1, "Tipo obligatorio"),
  instructor: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // UI: date/time split in 4 inputs (start date/time + end date/time).
  // Nota: por reglas de negocio, inicio y fin siempre son el mismo día.
  startDate: z.string().min(1, "Día de inicio obligatorio"),
  startTime: z.string().min(1, "Hora de inicio obligatoria"),
  endDate: z.string().min(1, "Día de fin obligatorio"),
  endTime: z.string().min(1, "Hora de fin obligatoria"),
  capacity: z.coerce.number().int().min(1, "Aforo mínimo 1"),
});

function parseDateOrThrow(v: string, key: string) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new Error(`INVALID_${key}`);
  return d;
}

function dateKeyInTz(d: Date, timeZone: string) {
  // YYYY-MM-DD en una zona horaria específica (estable para comparar días)
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d);
}

function assertNotInPastDay(d: Date) {
  // BO: no permitir clases en días anteriores al día actual (Europe/Madrid)
  const tz = "Europe/Madrid";
  const startDay = dateKeyInTz(d, tz);
  const today = dateKeyInTz(new Date(), tz);
  if (startDay < today) throw new Error("PAST_DAY");
}

function combineLocalDateTime(date: string, time: string) {
  // date: YYYY-MM-DD, time: HH:mm
  return `${date}T${time}`;
}

export async function createClassSession(
  locale: string,
  _prev: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  await requireBoUser(locale);

  const parsed = ClassUpsertSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? ""),
    instructor: (formData.get("instructor") as string) || null,
    notes: (formData.get("notes") as string) || null,
    startDate: String(formData.get("startDate") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: flat.fieldErrors,
      formError: flat.formErrors?.[0],
    };
  }

  try {
    // Regla: inicio y fin siempre son el mismo día => forzamos endDate = startDate
    const startsAtStr = combineLocalDateTime(
      parsed.data.startDate,
      parsed.data.startTime,
    );
    const endsAtStr = combineLocalDateTime(
      parsed.data.startDate,
      parsed.data.endTime,
    );

    const starts = parseDateOrThrow(startsAtStr, "STARTS_AT");
    const ends = parseDateOrThrow(endsAtStr, "ENDS_AT");

    assertNotInPastDay(starts);
    if (ends <= starts)
      return {
        ok: false,
        formError: "La hora de fin debe ser posterior al inicio.",
      };

    const created = await prisma.classSession.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        instructor: parsed.data.instructor || null,
        notes: parsed.data.notes || null,
        startsAt: starts,
        endsAt: ends,
        capacity: parsed.data.capacity,
      },
      select: { id: true },
    });

    return { ok: true, classId: created.id };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "";
    if (msg === "PAST_DAY") {
      return {
        ok: false,
        formError: "No se pueden crear clases en fechas anteriores a hoy.",
      };
    }
    return { ok: false, formError: "No se pudo crear la clase." };
  }
}

export async function updateClassSession(
  locale: string,
  classId: string,
  _prev: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  await requireBoUser(locale);

  const parsed = ClassUpsertSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? ""),
    instructor: (formData.get("instructor") as string) || null,
    notes: (formData.get("notes") as string) || null,
    startDate: String(formData.get("startDate") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: flat.fieldErrors,
      formError: flat.formErrors?.[0],
    };
  }

  try {
    const startsAtStr = combineLocalDateTime(
      parsed.data.startDate,
      parsed.data.startTime,
    );
    const endsAtStr = combineLocalDateTime(
      parsed.data.startDate,
      parsed.data.endTime,
    );

    const starts = parseDateOrThrow(startsAtStr, "STARTS_AT");
    const ends = parseDateOrThrow(endsAtStr, "ENDS_AT");

    // En edición: no permitir mover la clase a un día anterior a hoy.
    // (Pero si la clase ya estaba en el pasado, permitimos guardar cambios
    //  sin cambiar el día, para no bloquear correcciones administrativas.)
    const tz = "Europe/Madrid";
    const newDay = dateKeyInTz(starts, tz);
    const today = dateKeyInTz(new Date(), tz);
    if (newDay < today) {
      const existing = await prisma.classSession.findUnique({
        where: { id: classId },
        select: { startsAt: true },
      });
      const existingDay = existing?.startsAt
        ? dateKeyInTz(existing.startsAt, tz)
        : null;
      if (!existingDay || existingDay !== newDay) throw new Error("PAST_DAY");
    }
    if (ends <= starts)
      return {
        ok: false,
        formError: "La hora de fin debe ser posterior al inicio.",
      };

    await prisma.classSession.update({
      where: { id: classId },
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        instructor: parsed.data.instructor || null,
        notes: parsed.data.notes || null,
        startsAt: starts,
        endsAt: ends,
        capacity: parsed.data.capacity,
      },
      select: { id: true },
    });

    return { ok: true, classId };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "";
    if (msg === "PAST_DAY") {
      return {
        ok: false,
        formError: "No se pueden guardar clases en fechas anteriores a hoy.",
      };
    }
    return { ok: false, formError: "No se pudo guardar la clase." };
  }
}

export async function deleteClassSession(locale: string, classId: string) {
  await requireBoUser(locale);
  await prisma.classSession.delete({
    where: { id: classId },
    select: { id: true },
  });
}

export async function cancelBookingAsAdmin(locale: string, bookingId: string) {
  await requireBoUser(locale);

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
    select: { id: true },
  });
}
