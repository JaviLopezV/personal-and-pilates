"use client";

import * as React from "react";
import type { ClassSessionDto } from "../types/classes";
import {
  addDays,
  dateKeyLocal,
  isoLocalEndOfDay,
  isoLocalStartOfDay,
} from "../utils/date";

type State = {
  loading: boolean;
  err: string | null;
  items: ClassSessionDto[];
  busyId: string | null;
};

export function useClassesWeek(weekStart: Date) {
  const [state, setState] = React.useState<State>({
    loading: true,
    err: null,
    items: [],
    busyId: null,
  });

  const loadForWeek = React.useCallback(async (start: Date) => {
    setState((s) => ({ ...s, err: null, loading: true }));
    try {
      const from = isoLocalStartOfDay(start);
      const to = isoLocalEndOfDay(addDays(start, 6));

      const res = await fetch(
        `/api/classes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        { cache: "no-store" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "LOAD_FAILED");

      setState((s) => ({ ...s, items: data.sessions || [] }));
    } catch (e: any) {
      setState((s) => ({ ...s, err: e?.message || "LOAD_FAILED" }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  React.useEffect(() => {
    loadForWeek(weekStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart.getTime()]);

  const book = React.useCallback(
    async (sessionId: string) => {
      setState((s) => ({ ...s, busyId: sessionId, err: null }));
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "BOOK_FAILED");
        await loadForWeek(weekStart);
      } catch (e: any) {
        setState((s) => ({ ...s, err: e?.message || "BOOK_FAILED" }));
      } finally {
        setState((s) => ({ ...s, busyId: null }));
      }
    },
    [loadForWeek, weekStart],
  );

  const cancel = React.useCallback(
    async (bookingId: string) => {
      setState((s) => ({ ...s, busyId: bookingId, err: null }));
      try {
        const res = await fetch(`/api/bookings/${bookingId}`, {
          method: "DELETE",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "CANCEL_FAILED");
        await loadForWeek(weekStart);
      } catch (e: any) {
        setState((s) => ({ ...s, err: e?.message || "CANCEL_FAILED" }));
      } finally {
        setState((s) => ({ ...s, busyId: null }));
      }
    },
    [loadForWeek, weekStart],
  );

  const byDay = React.useMemo(() => {
    return state.items.reduce<Record<string, ClassSessionDto[]>>((acc, it) => {
      const key = dateKeyLocal(new Date(it.startsAt));
      (acc[key] ||= []).push(it);
      return acc;
    }, {});
  }, [state.items]);

  return {
    ...state,
    byDay,
    reload: () => loadForWeek(weekStart),
    book,
    cancel,
  };
}
