// AnimalGameHeader.tsx
"use client";

import * as React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

type Props = {
  title: string;
  subtitle: string;
  onBack: () => void;
  onReset: () => void;
  backAriaLabel: string;
  resetAriaLabel: string;
};

export function AnimalGameHeader({
  title,
  subtitle,
  onBack,
  onReset,
  backAriaLabel,
  resetAriaLabel,
}: Props) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={onBack} aria-label={backAriaLabel}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      <IconButton onClick={onReset} aria-label={resetAriaLabel}>
        <RefreshIcon />
      </IconButton>
    </Stack>
  );
}
