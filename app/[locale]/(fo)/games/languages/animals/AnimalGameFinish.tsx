// AnimalGameFinish.tsx
"use client";

import * as React from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

type Props = {
  title: string;
  backLabel: string;
  onBack: () => void;
  backToAnimals: () => void;

  finishTitle: string;
  languageChosenText: string;

  correctLabel: string;
  wrongLabel: string;
  accuracyLabel: string;

  correctCount: number;
  wrongCount: number;
  accuracy: number;

  feedbackText: string;
  feedbackSeverity: "success" | "info" | "warning";

  playAgainLabel: string;
  onPlayAgain: () => void;
};

export function AnimalGameFinish({
  title,
  backLabel,
  backToAnimals,
  onBack,
  finishTitle,
  languageChosenText,
  correctLabel,
  wrongLabel,
  accuracyLabel,
  correctCount,
  wrongCount,
  accuracy,
  feedbackText,
  feedbackSeverity,
  playAgainLabel,
  onPlayAgain,
}: Props) {
  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={backToAnimals} aria-label={backLabel}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={800}>
          {title}
        </Typography>
      </Stack>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={900} gutterBottom>
            {finishTitle}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {languageChosenText}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            <Typography>
              ✅ {correctLabel}: <b>{correctCount}</b>
            </Typography>
            <Typography>
              ❌ {wrongLabel}: <b>{wrongCount}</b>
            </Typography>
            <Typography>
              🎯 {accuracyLabel}: <b>{accuracy}%</b>
            </Typography>
          </Stack>

          <Alert severity={feedbackSeverity} sx={{ mt: 2 }}>
            {feedbackText}
          </Alert>

          <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onPlayAgain}
            >
              {playAgainLabel}
            </Button>
            <Button variant="outlined" onClick={onBack}>
              {backLabel}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
