"use client";

import * as React from "react";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import type { ClassSessionDto } from "../../types/classes";
import { fmtDayHeader, fmtTime } from "../../utils/date";
import { minutesFromMidnight } from "../../utils/time";
import type { LayoutInfo } from "../../utils/layoutOverlaps";

export function CalendarSessionBlock({
  s,
  busyId,
  onBook,
  onCancel,
  t,
  startHour,
  hourPx,
  layout,
}: {
  s: ClassSessionDto;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
  startHour: number;
  hourPx: number;
  layout?: LayoutInfo;
}) {
  const start = new Date(s.startsAt);
  const end = new Date(s.endsAt);

  const startMins = minutesFromMidnight(start);
  const endMins = minutesFromMidnight(end);

  const top = ((startMins - startHour * 60) / 60) * hourPx;
  const rawHeight = ((endMins - startMins) / 60) * hourPx;

  const blockHeight = Math.max(86, rawHeight - 8);
  const compact = blockHeight < 110;

  const isBusy =
    busyId !== null && (busyId === s.id || busyId === s.myBookingId);

  const booked = Boolean(s.myBookingId);
  const full = Boolean(s.isFull);

  const borderColor = booked ? "rgba(211,47,47,0.35)" : "rgba(25,118,210,0.30)";
  const headerBg = booked ? "rgba(211,47,47,0.10)" : "rgba(25,118,210,0.10)";

  const cols = Math.max(1, layout?.cols ?? 1);
  const col = Math.max(0, layout?.col ?? 0);

  const widthPct = 100 / cols;
  const leftPct = col * widthPct;

  const handleBlockClick = () => {
    if (isBusy) return;
    if (booked) return onCancel(s.myBookingId!);
    if (full) return;
    onBook(s.id);
  };

  const tooltip = (
    <Box sx={{ p: 0.5, maxWidth: 320 }}>
      <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 0.25 }}>
        {s.title}
      </Typography>
      <Typography variant="caption" sx={{ display: "block" }}>
        {fmtDayHeader(start)} · {fmtTime(start)}–{fmtTime(end)}
      </Typography>
      <Typography variant="caption" sx={{ display: "block" }}>
        {s.type}
      </Typography>
      {s.instructor ? (
        <Typography variant="caption" sx={{ display: "block" }}>
          {t("instructor")}: {s.instructor}
        </Typography>
      ) : null}
      <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
        {booked ? t("cancel") : full ? "Full" : t("book")}
      </Typography>
    </Box>
  );

  return (
    <Tooltip title={tooltip} placement="top" arrow enterDelay={200}>
      <Paper
        elevation={0}
        variant="outlined"
        onClick={handleBlockClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleBlockClick();
          }
        }}
        sx={{
          position: "absolute",
          left: `calc(${leftPct}% + 6px)`,
          width: `calc(${widthPct}% - 12px)`,
          top: Math.max(4, top + 4),
          height: blockHeight,
          borderRadius: 2,
          borderColor,
          overflow: "hidden",
          cursor: isBusy
            ? "progress"
            : full && !booked
              ? "not-allowed"
              : "pointer",
          userSelect: "none",
          bgcolor: "background.paper",
          boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          "&:hover": {
            boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
            transform: "translateY(-1px)",
            transition: "all 160ms ease",
          },
          "&:focus-visible": {
            outline: "2px solid rgba(25,118,210,0.35)",
            outlineOffset: 2,
          },
        }}
      >
        <Box
          sx={{
            px: 1,
            py: 0.5,
            bgcolor: headerBg,
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 900 }} noWrap>
            {fmtTime(start)}–{fmtTime(end)}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontWeight: 900,
              color: booked
                ? "error.main"
                : full
                  ? "text.secondary"
                  : "primary.main",
              whiteSpace: "nowrap",
            }}
            noWrap
          >
            {booked ? t("cancel") : full ? "Full" : t("book")}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1,
            py: 0.75,
            height: `calc(100% - 28px)`,
            display: "flex",
            flexDirection: "column",
            gap: 0.25,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 900, lineHeight: 1.15 }}
            noWrap
            title={s.title}
          >
            {s.title}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 800 }}
            noWrap
            title={`${s.type}${s.instructor ? ` · ${t("instructor")}: ${s.instructor}` : ""}`}
          >
            {s.type}
            {s.instructor ? ` · ${t("instructor")}: ${s.instructor}` : ""}
          </Typography>

          <Box sx={{ flex: 1 }} />

          {booked ? (
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="error"
              disabled={isBusy}
              onClick={(e) => {
                e.stopPropagation();
                onCancel(s.myBookingId!);
              }}
              sx={{
                fontWeight: 900,
                textTransform: "none",
                borderRadius: 1.5,
                minHeight: compact ? 28 : 32,
                py: 0,
              }}
            >
              {isBusy ? "…" : t("cancel")}
            </Button>
          ) : (
            <Button
              fullWidth
              size="small"
              variant="contained"
              disabled={isBusy || full}
              onClick={(e) => {
                e.stopPropagation();
                if (!full) onBook(s.id);
              }}
              sx={{
                fontWeight: 900,
                textTransform: "none",
                borderRadius: 1.5,
                minHeight: compact ? 28 : 32,
                py: 0,
              }}
            >
              {isBusy ? "…" : full ? "Full" : t("book")}
            </Button>
          )}
        </Box>
      </Paper>
    </Tooltip>
  );
}
