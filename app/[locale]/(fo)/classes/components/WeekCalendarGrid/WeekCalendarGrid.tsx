"use client";

import * as React from "react";
import { Box, Paper } from "@mui/material";
import type { ClassSessionDto } from "../../types/classes";
import { dateKeyLocal } from "../../utils/date";
import { useNowTickEveryMinute } from "../../hooks/useNowTickEveryMinute";
import { CalendarHeaderRow } from "./CalendarHeaderRow";
import { TimeGutter } from "./TimeGutter";
import { CalendarDayColumn } from "./CalendarDayColumn";

type Props = {
  weekDays: Date[];
  byDay: Record<string, ClassSessionDto[]>;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
};

export function WeekCalendarGrid({
  weekDays,
  byDay,
  busyId,
  onBook,
  onCancel,
  t,
}: Props) {
  const startHour = 0;
  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    [],
  );

  const HOUR_PX = 64;
  const HEADER_PX = 48;
  const LEFT_COL_PX = 76;

  const bodyHeight = hours.length * HOUR_PX;
  const today = React.useMemo(() => new Date(), []);
  const now = useNowTickEveryMinute();

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "min(78vh, 980px)",
        overflow: "hidden",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box
          sx={{
            minWidth: 980,
            display: "grid",
            gridTemplateColumns: `${LEFT_COL_PX}px repeat(7, minmax(0, 1fr))`,
            gridTemplateRows: `${HEADER_PX}px ${bodyHeight}px`,
          }}
        >
          <CalendarHeaderRow
            weekDays={weekDays}
            headerPx={HEADER_PX}
            leftColPx={LEFT_COL_PX}
            today={today}
          />

          <TimeGutter hours={hours} hourPx={HOUR_PX} />

          {weekDays.map((d) => {
            const key = dateKeyLocal(d);
            return (
              <CalendarDayColumn
                key={`day-${key}`}
                day={d}
                sessions={byDay[key] || []}
                busyId={busyId}
                onBook={onBook}
                onCancel={onCancel}
                t={t}
                startHour={startHour}
                hourPx={HOUR_PX}
                hoursCount={hours.length}
                today={today}
                now={now}
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
