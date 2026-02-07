"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { cancelBookingAsAdmin, setBookingAttendance } from "../actions";

type BookingRow = {
  id: string;
  createdAt: string; // ISO string
  attended: boolean;
  attendedAt: string | null;
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

  const [busyCancelId, setBusyCancelId] = React.useState<string | null>(null);
  const [busyAttendId, setBusyAttendId] = React.useState<string | null>(null);

  async function handleCancel(bookingId: string) {
    // eslint-disable-next-line no-alert
    if (!confirm("¿Cancelar la reserva de este cliente?")) return;

    setBusyCancelId(bookingId);
    try {
      await cancelBookingAsAdmin(locale, bookingId);
      router.refresh();
    } finally {
      setBusyCancelId(null);
    }
  }

  async function handleAttendance(bookingId: string, attended: boolean) {
    setBusyAttendId(bookingId);
    try {
      await setBookingAttendance(locale, bookingId, attended);
      router.refresh();
    } finally {
      setBusyAttendId(null);
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
        const isBusyCancel: boolean = busyCancelId !== null && busyCancelId === b.id;
        const isBusyAttend: boolean = busyAttendId !== null && busyAttendId === b.id;
        return (
          <Box
            key={b.id}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 220px 200px 160px" },
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
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={!!b.attended}
                    disabled={isBusyAttend || isBusyCancel}
                    onChange={(e) => handleAttendance(b.id, e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Asistencia
                  </Typography>
                }
              />
            </Box>

            <Box sx={{ justifySelf: { sm: "end" } }}>
              <Button
                variant="outlined"
                color="error"
                disabled={isBusyCancel || isBusyAttend}
                onClick={() => handleCancel(b.id)}
                endIcon={
                  isBusyCancel ? (
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
