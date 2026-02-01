"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { fmtTime } from "../../utils/date";

export function NowIndicator({
  top,
  height,
  now,
}: {
  top: number;
  height: number;
  now: Date;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 4,
        right: 4,
        top: Math.max(0, Math.min(height - 1, top)),
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          height: 2,
          bgcolor: "primary.main",
          borderRadius: 999,
          boxShadow: "0 0 0 3px rgba(25,118,210,0.10)",
        }}
      />
      <Typography
        variant="caption"
        sx={{
          mt: 0.25,
          display: "inline-block",
          fontWeight: 900,
          color: "primary.main",
          bgcolor: "background.paper",
          px: 0.75,
          py: 0.25,
          borderRadius: 999,
          boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
        }}
      >
        {fmtTime(now)}
      </Typography>
    </Box>
  );
}
