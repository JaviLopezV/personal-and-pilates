"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

export function TimeGutter({
  hours,
  hourPx,
}: {
  hours: number[];
  hourPx: number;
}) {
  return (
    <Box
      sx={{
        position: "sticky",
        left: 0,
        zIndex: 4,
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {hours.map((h, idx) => (
        <Box
          key={`h-${h}`}
          sx={{
            height: hourPx,
            borderBottom: idx === hours.length - 1 ? "none" : "1px solid",
            borderColor: "divider",
            px: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            pt: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 900, color: "text.secondary" }}
          >
            {String(h).padStart(2, "0")}:00
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
