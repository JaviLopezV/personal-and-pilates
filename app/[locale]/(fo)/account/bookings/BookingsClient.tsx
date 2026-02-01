"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

type BookingDto = {
  id: string;
  createdAt: string;
  session: {
    id: string;
    title: string;
    type: string;
    instructor: string | null;
    startsAt: string;
    endsAt: string;
  };
};

function fmt(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function BookingsClient() {
  const t = useTranslations("fo.bookings");

  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<BookingDto[]>([]);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/my/bookings", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "LOAD_FAILED");
      setItems(data.bookings || []);
    } catch (e: any) {
      setErr(e?.message || "LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function cancel(bookingId: string) {
    setBusyId(bookingId);
    setErr(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "CANCEL_FAILED");
      await load();
    } catch (e: any) {
      setErr(e?.message || "CANCEL_FAILED");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
      </Stack>
    );
  }

  if (err) {
    const error = `errors.UNAUTHORIZED`;
    return (
      <Stack spacing={2}>
        <Alert severity="error">{t(error)}</Alert>
        <Button variant="contained" onClick={load}>
          {t("retry")}
        </Button>
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <Paper variant="outlined">
        <Box p={3}>
          <Typography color="text.secondary">{t("empty")}</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined">
      <Stack>
        {items.map((b) => {
          const s = b.session;
          const start = new Date(s.startsAt);
          const end = new Date(s.endsAt);
          const isBusy: boolean = busyId !== null && busyId === b.id;

          return (
            <Box key={b.id} px={3} py={2}>
              <Typography fontWeight={900}>
                {s.title}{" "}
                <Typography component="span" color="text.secondary">
                  · {s.type}
                </Typography>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {fmt(start)} – {fmt(end)}
                {s.instructor ? ` · ${t("instructor")}: ${s.instructor}` : ""}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isBusy}
                  onClick={() => cancel(b.id)}
                  endIcon={
                    isBusy ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : undefined
                  }
                >
                  {t("cancel")}
                </Button>
              </Box>

              <Divider sx={{ mt: 2 }} />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
