"use client";

import * as React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import type { ClassSessionDto } from "../types/classes";
import { fmtTime } from "../utils/date";

type Props = {
  s: ClassSessionDto;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
};

export function ClassCard({ s, busyId, onBook, onCancel, t }: Props) {
  const start = new Date(s.startsAt);
  const end = new Date(s.endsAt);

  const isBusy =
    busyId !== null && (busyId === s.id || busyId === s.myBookingId);

  return (
    <Box px={2} py={1.5}>
      <Typography fontWeight={800}>
        {fmtTime(start)}–{fmtTime(end)}
      </Typography>

      <Typography fontWeight={800} sx={{ mt: 0.25 }}>
        {s.title}{" "}
        <Typography component="span" color="text.secondary" fontWeight={600}>
          · {s.type}
        </Typography>
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {`${s.remaining} ${t("spots")} ${s.capacity}`}
        {s.instructor ? ` · ${t("instructor")}: ${s.instructor}` : ""}
      </Typography>

      {s.notes ? (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {s.notes}
        </Typography>
      ) : null}

      <Box sx={{ mt: 1 }}>
        {s.myBookingId ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            disabled={isBusy}
            onClick={() => onCancel(s.myBookingId!)}
            endIcon={
              isBusy ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {t("cancel")}
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            disabled={isBusy || s.isFull}
            onClick={() => onBook(s.id)}
            endIcon={
              isBusy ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {s.isFull ? t("full") : t("book")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
