"use client";

import * as React from "react";
import { Box } from "@mui/material";
import type { ClassSessionDto } from "../types/classes";
import { dateKeyLocal } from "../utils/date";
import { DayColumn } from "./DayColumn";
import { WeekCalendarGrid } from "./WeekCalendarGrid/WeekCalendarGrid";

type Props = {
  weekDays: Date[];
  byDay: Record<string, ClassSessionDto[]>;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
};

export function WeekGrid({
  weekDays,
  byDay,
  busyId,
  onBook,
  onCancel,
  t,
}: Props) {
  return (
    <>
      {/* Mobile: keep the current list-style columns */}
      <Box
        sx={{
          display: { xs: "grid", md: "none" },
          gap: 2,
          gridTemplateColumns: "1fr",
        }}
      >
        {weekDays.map((d) => {
          const key = dateKeyLocal(d);
          return (
            <DayColumn
              key={key}
              day={d}
              sessions={byDay[key] || []}
              busyId={busyId}
              onBook={onBook}
              onCancel={onCancel}
              t={t}
            />
          );
        })}
      </Box>

      {/* Desktop: calendar-like grid with hours column */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <WeekCalendarGrid
          weekDays={weekDays}
          byDay={byDay}
          busyId={busyId}
          onBook={onBook}
          onCancel={onCancel}
          t={t}
        />
      </Box>
    </>
  );
}
