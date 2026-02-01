"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { dateKeyLocal, fmtDayHeader } from "../../utils/date";
import { isSameDayLocal } from "../../utils/time";

export function CalendarHeaderRow({
  weekDays,
  headerPx,
  leftColPx,
  today,
}: {
  weekDays: Date[];
  headerPx: number;
  leftColPx: number;
  today: Date;
}) {
  return (
    <>
      {/* Top-left corner (sticky) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 6,
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
          height: headerPx,
          width: leftColPx,
        }}
      />

      {weekDays.map((d) => {
        const isToday = isSameDayLocal(d, today);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

        return (
          <Box
            key={`hdr-${dateKeyLocal(d)}`}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 5,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderRight: "1px solid",
              borderColor: "divider",
              px: 1.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              backdropFilter: "saturate(180%) blur(8px)",
              height: headerPx,
            }}
          >
            <Typography
              fontWeight={900}
              sx={{
                textTransform: "capitalize",
                fontSize: 13,
                color: isWeekend ? "text.secondary" : "text.primary",
              }}
            >
              {fmtDayHeader(d)}
            </Typography>

            {isToday ? (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "999px",
                  bgcolor: "primary.main",
                  boxShadow: "0 0 0 3px rgba(25,118,210,0.15)",
                }}
                aria-label="today"
              />
            ) : null}
          </Box>
        );
      })}
    </>
  );
}
