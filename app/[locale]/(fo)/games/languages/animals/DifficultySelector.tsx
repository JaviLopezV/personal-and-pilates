// DifficultySelector.tsx
"use client";

import * as React from "react";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Difficulty } from "./animalGame.utils";

type Props = {
  label: string;
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  easyLabel: string;
  normalLabel: string;
  hardLabel: string;
};

export function DifficultySelector({
  label,
  value,
  onChange,
  easyLabel,
  normalLabel,
  hardLabel,
}: Props) {
  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(_, next) => {
          if (!next) return;
          onChange(next as Difficulty);
        }}
        size="small"
      >
        <ToggleButton value="easy">{easyLabel}</ToggleButton>
        <ToggleButton value="normal">{normalLabel}</ToggleButton>
        <ToggleButton value="hard">{hardLabel}</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
