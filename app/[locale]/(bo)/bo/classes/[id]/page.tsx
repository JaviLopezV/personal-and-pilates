import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";
import BookingsAdminClient from "./BookingsAdminClient";

type Params = { params: Promise<{ id: string }> };

function fmt(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function BoClassDetailPage({ params }: Params) {
  const { id } = await params;

  const cs = await prisma.classSession.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      type: true,
      instructor: true,
      notes: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
      bookings: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!cs) return notFound();

  return (
    <Stack spacing={3} maxWidth={1000}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {cs.title}{" "}
            <Typography component="span" color="text.secondary">
              · {cs.type}
            </Typography>
          </Typography>
          <Typography color="text.secondary">
            {fmt(cs.startsAt)} – {fmt(cs.endsAt)} · Aforo: {cs.capacity} ·
            Inscritos: {cs.bookings.length}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Link
            href={`/bo/classes/${cs.id}/edit`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="outlined">Editar</Button>
          </Link>
        </Stack>
      </Stack>

      <Paper variant="outlined">
        <Box p={3}>
          <Typography fontWeight={800}>Detalles</Typography>
          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            {cs.instructor && (
              <Typography>
                <b>Instructor/a:</b> {cs.instructor}
              </Typography>
            )}
            {cs.notes && (
              <Typography>
                <b>Notas:</b> {cs.notes}
              </Typography>
            )}
          </Stack>
        </Box>
      </Paper>

      <Paper variant="outlined">
        <Box p={3}>
          <Typography fontWeight={800}>Inscritos</Typography>
          <Divider sx={{ my: 2 }} />

          <BookingsAdminClient
            bookings={cs.bookings.map(
              (b: {
                id: string;
                createdAt: Date;
                user: {
                  id: string;
                  name: string | null;
                  email: string;
                };
              }) => ({
                id: b.id,
                createdAt: b.createdAt.toISOString(),
                user: b.user,
              }),
            )}
          />
        </Box>
      </Paper>
    </Stack>
  );
}
