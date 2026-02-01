"use client";

import * as React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { fmtWeekRange } from "../utils/date";

type Props = {
  title: string;
  weekStart: Date;
  weekEnd: Date;
  loading: boolean;
  weekOffset: number;
  onPrev: () => void;
  onThisWeek: () => void;
  onNext: () => void;
  tPrev: string;
  tThis: string;
  tNext: string;
};

export function WeekHeader(props: Props) {
  const {
    title,
    weekStart,
    weekEnd,
    loading,
    weekOffset,
    onPrev,
    onThisWeek,
    onNext,
    tPrev,
    tThis,
    tNext,
  } = props;

  return (
    <Paper variant="outlined">
      <Box
        px={3}
        py={2}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography fontWeight={900}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {fmtWeekRange(weekStart, weekEnd)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="outlined" onClick={onPrev} disabled={loading}>
            {tPrev}
          </Button>
          <Button
            variant="text"
            onClick={onThisWeek}
            disabled={loading || weekOffset === 0}
          >
            {tThis}
          </Button>
          <Button variant="outlined" onClick={onNext} disabled={loading}>
            {tNext}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
