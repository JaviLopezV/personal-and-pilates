// AnimalGameProgress.tsx
"use client";

import * as React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

export function AnimalGameProgress({
  value,
  indexLabel,
}: {
  value: number;
  indexLabel: string;
}) {
  return (
    <Box sx={{ mt: 1 }}>
      <LinearProgress variant="determinate" value={value} />
      <Typography variant="caption" color="text.secondary">
        {indexLabel}
      </Typography>
    </Box>
  );
}
