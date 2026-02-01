"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { cancelBookingAsAdmin } from "../actions";

type BookingRow = {
  id: string;
  createdAt: string; // ISO string
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

function fmt(dIso: string) {
  const d = new Date(dIso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function BookingsAdminClient({
  bookings,
}: {
  bookings: BookingRow[];
}) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function handleCancel(bookingId: string) {
    // eslint-disable-next-line no-alert
    if (!confirm("¿Cancelar la reserva de este cliente?")) return;

    setBusyId(bookingId);
    try {
      await cancelBookingAsAdmin(locale, bookingId);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <Typography color="text.secondary">No hay inscritos todavía.</Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {bookings.map((b) => {
        const isBusy: boolean = busyId !== null && busyId === b.id;
        return (
          <Box
            key={b.id}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 220px 160px" },
              gap: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              alignItems: { sm: "center" },
            }}
          >
            <Box>
              <Typography fontWeight={700}>
                {b.user.name ?? "(Sin nombre)"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {b.user.email}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ justifySelf: { sm: "end" } }}
            >
              Reservado: {fmt(b.createdAt)}
            </Typography>

            <Box sx={{ justifySelf: { sm: "end" } }}>
              <Button
                variant="outlined"
                color="error"
                disabled={isBusy}
                onClick={() => handleCancel(b.id)}
                endIcon={
                  isBusy ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
