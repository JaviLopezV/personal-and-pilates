"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useWeekCalendar } from "./hooks/useWeekCalendar";
import { useClassesWeek } from "./hooks/useClassesWeek";
import { WeekHeader } from "./components/WeekHeader";
import { WeekGrid } from "./components/WeekGrid";

export default function ClassesClient() {
  const t = useTranslations("fo.classes");

  const { weekOffset, setWeekOffset, weekStart, weekEnd, weekDays } =
    useWeekCalendar();
  const { loading, err, items, busyId, byDay, reload, book, cancel } =
    useClassesWeek(weekStart);

  const translateError = React.useCallback(
    (code: string) => {
      try {
        return t(`errors.${code}` as any);
      } catch {
        return t("errors.LOAD_FAILED");
      }
    },
    [t],
  );

  return (
    <Stack spacing={2}>
      <WeekHeader
        title={t("calendarTitle")}
        weekStart={weekStart}
        weekEnd={weekEnd}
        loading={loading}
        weekOffset={weekOffset}
        onPrev={() => setWeekOffset((w) => w - 1)}
        onThisWeek={() => setWeekOffset(0)}
        onNext={() => setWeekOffset((w) => w + 1)}
        tPrev={t("prevWeek")}
        tThis={t("thisWeek")}
        tNext={t("nextWeek")}
      />

      {err ? (
        <Stack spacing={2}>
          <Alert severity="error">{translateError(err)}</Alert>
          <Button variant="contained" onClick={reload}>
            {t("retry")}
          </Button>
        </Stack>
      ) : null}

      {loading ? (
        <Stack alignItems="center" py={6}>
          <CircularProgress />
        </Stack>
      ) : null}

      {!loading && !err && items.length === 0 ? (
        <Paper variant="outlined">
          <Box p={3}>
            <Typography color="text.secondary">{t("emptyWeek")}</Typography>
          </Box>
        </Paper>
      ) : null}

      {!loading && !err ? (
        <WeekGrid
          weekDays={weekDays}
          byDay={byDay}
          busyId={busyId}
          onBook={book}
          onCancel={cancel}
          t={(k) => t(k as any)}
        />
      ) : null}
    </Stack>
  );
}
