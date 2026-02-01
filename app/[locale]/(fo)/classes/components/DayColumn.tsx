"use client";

import * as React from "react";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import type { ClassSessionDto } from "../types/classes";
import { fmtDayHeader } from "../utils/date";
import { ClassCard } from "./ClassCard";

type Props = {
  day: Date;
  sessions: ClassSessionDto[];
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
};

export function DayColumn({
  day,
  sessions,
  busyId,
  onBook,
  onCancel,
  t,
}: Props) {
  const sorted = React.useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)),
    [sessions],
  );

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box px={2} py={1.5}>
        <Typography fontWeight={900} sx={{ textTransform: "capitalize" }}>
          {fmtDayHeader(day)}
        </Typography>
      </Box>
      <Divider />

      {sorted.length === 0 ? (
        <Box px={2} py={2}>
          <Typography variant="body2" color="text.secondary">
            {t("noClasses")}
          </Typography>
        </Box>
      ) : (
        <Stack divider={<Divider flexItem />}>
          {sorted.map((s) => (
            <ClassCard
              key={s.id}
              s={s}
              busyId={busyId}
              onBook={onBook}
              onCancel={onCancel}
              t={t}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
