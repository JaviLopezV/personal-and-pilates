import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { Stack } from "@mui/material";
import { getTranslations } from "next-intl/server";
import EditUserForm from "./EditUserForm";

type Params = { params: Promise<{ id: string; locale: string }> };

export default async function EditUserPage({ params }: Params) {
  const { id, locale } = await params;
  await getTranslations("bo.boEditUser");

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      disabled: true,
      availableClasses: true,
    },
  });

  if (!user) return notFound();

  return (
    <Stack spacing={3} maxWidth={900}>
      <EditUserForm locale={locale} user={user as any} />
    </Stack>
  );
}
