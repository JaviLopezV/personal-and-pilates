"use client";

import * as React from "react";
import { Box } from "@mui/material";
import type { ClassSessionDto } from "../../types/classes";
import { layoutOverlaps } from "../../utils/layoutOverlaps";
import { minutesFromMidnight, isSameDayLocal } from "../../utils/time";
import { NowIndicator } from "./NowIndicator";
import { CalendarSessionBlock } from "./CalendarSessionBlock";

export function CalendarDayColumn({
  day,
  sessions,
  busyId,
  onBook,
  onCancel,
  t,
  startHour,
  hourPx,
  hoursCount,
  today,
  now,
}: {
  day: Date;
  sessions: ClassSessionDto[];
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
  startHour: number;
  hourPx: number;
  hoursCount: number;
  today: Date;
  now: Date;
}) {
  const sorted = React.useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)),
    [sessions],
  );

  const layout = React.useMemo(() => layoutOverlaps(sorted), [sorted]);
  const height = hoursCount * hourPx;

  const isToday = isSameDayLocal(day, today);
  const isWeekend = day.getDay() === 0 || day.getDay() === 6;

  const bg = isToday
    ? "rgba(25,118,210,0.06)"
    : isWeekend
      ? "rgba(0,0,0,0.02)"
      : "transparent";

  const showNowLine = isSameDayLocal(day, now);
  const nowTop = React.useMemo(() => {
    if (!showNowLine) return 0;
    const mins = minutesFromMidnight(now);
    return ((mins - startHour * 60) / 60) * hourPx;
  }, [showNowLine, now, startHour, hourPx]);

  return (
    <Box
      sx={{
        position: "relative",
        height,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: bg,
        backgroundImage: `
          repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent ${hourPx - 1}px,
            rgba(0,0,0,0.07) ${hourPx - 1}px,
            rgba(0,0,0,0.07) ${hourPx}px
          ),
          repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent ${hourPx * 3 - 1}px,
            rgba(0,0,0,0.10) ${hourPx * 3 - 1}px,
            rgba(0,0,0,0.10) ${hourPx * 3}px
          )
        `,
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, px: 1 }}>
        {showNowLine ? (
          <NowIndicator top={nowTop} height={height} now={now} />
        ) : null}

        {sorted.map((s) => (
          <CalendarSessionBlock
            key={s.id}
            s={s}
            busyId={busyId}
            onBook={onBook}
            onCancel={onCancel}
            t={t}
            startHour={startHour}
            hourPx={hourPx}
            layout={layout[s.id]}
          />
        ))}
      </Box>
    </Box>
  );
}
