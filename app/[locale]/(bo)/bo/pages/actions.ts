"use server";

import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

const PageStatusSchema = z.enum(["ACTIVE", "UNDER_CONSTRUCTION", "INACTIVE"]);

async function requireBoUser(locale: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) redirect(`/${locale}/login`);
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect(`/${locale}`);
}

export async function updatePageStatus(
  locale: string,
  path: string,
  formData: FormData,
) {
  await requireBoUser(locale);

  const status = String(formData.get("status") ?? "");
  const parsed = PageStatusSchema.safeParse(status);
  if (!parsed.success) return;

  await prisma.page.upsert({
    where: { path },
    create: { path, status: parsed.data },
    update: { status: parsed.data },
    select: { id: true },
  });
}
