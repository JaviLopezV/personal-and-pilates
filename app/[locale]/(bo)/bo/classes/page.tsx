import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/app/lib/prisma";
import { getTranslations } from "next-intl/server";

function fmt(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

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

      <Paper variant="outlined">
        {sessions.length === 0 ? (
          <Box p={3}>
            <Typography color="text.secondary">{t("empty")}</Typography>
          </Box>
        ) : (
          <Box>
            {sessions.map((s) => (
              <Box
                key={s.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 180px",
                  px: 3,
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={800}>
                    {s.title}{" "}
                    <Typography component="span" color="text.secondary">
                      · {s.type}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {fmt(s.startsAt)} – {fmt(s.endsAt)} · Aforo: {s.capacity} ·
                    Inscritos: {s._count.bookings}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {fmt(s.startsAt)}
                </Typography>

                <Link
                  href={`/bo/classes/${s.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button size="small">Ver</Button>
                </Link>

                <Link
                  href={`/bo/classes/${s.id}/edit`}
                  style={{ textDecoration: "none" }}
                >
                  <Button size="small">{t("edit")}</Button>
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
