"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import { Link } from "@/i18n/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type ClassHeader = {
  title: string;
  type: string;
  id: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number;
  bookings: Array<unknown>;
};

function fmt(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function ViewClassHeader({ cs }: { cs: ClassHeader }) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const goBack = () => router.push(`/${locale}/bo/classes`);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={goBack} aria-label={"back"}>
          <ArrowBackIcon />
        </IconButton>
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
      </Stack>

      <Stack direction="row" spacing={1}>
        <Link
          href={`/bo/classes/${cs.id}/edit`}
          style={{ textDecoration: "none" }}
        >
          <Button variant="outlined">Editar</Button>
        </Link>
      </Stack>
    </Stack>
  );
}
