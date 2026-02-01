"use client";

import * as React from "react";
import { addDays, startOfWeekMonday } from "../utils/date";

export function useWeekCalendar() {
  const [weekOffset, setWeekOffset] = React.useState(0);

  const weekStart = React.useMemo(() => {
    const base = startOfWeekMonday(new Date());
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const weekEnd = React.useMemo(() => addDays(weekStart, 6), [weekStart]);

  return {
    weekOffset,
    setWeekOffset,
    weekStart,
    weekEnd,
    weekDays,
  };
}
