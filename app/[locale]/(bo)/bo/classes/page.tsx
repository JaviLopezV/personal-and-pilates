import { Button, Stack, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/app/lib/prisma";
import { getTranslations } from "next-intl/server";

import ClassesAdminClient from "./classes-admin-client";

export default async function ClassesAdminPage() {
  const t = await getTranslations("bo.boClasses");

  const sessions = await prisma.classSession.findMany({
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      title: true,
      type: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
      _count: {
        select: {
          bookings: { where: { status: "ACTIVE" } },
        },
      },
    },
    take: 200,
  });

  // Server -> client: Dates must be serialized.
  const items = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    type: s.type,
    startsAt: s.startsAt.toISOString(),
    endsAt: s.endsAt.toISOString(),
    capacity: s.capacity,
    bookedActive: s._count.bookings,
  }));

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>

        <Link href="/bo/classes/new" style={{ textDecoration: "none" }}>
          <Button variant="contained">{t("new")}</Button>
        </Link>
      </Stack>

      <ClassesAdminClient items={items} emptyLabel={t("empty")} editLabel={t("edit")} />
    </Stack>
  );
}
