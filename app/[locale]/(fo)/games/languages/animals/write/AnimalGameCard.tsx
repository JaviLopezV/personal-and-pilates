// AnimalGameCard.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import type { Animal } from "../animalGame.data";

type Props = {
  animal: Animal;
  learnLabel: string;

  answerLabel: string;
  writePrompt: string;
  checkLabel: string;
  skipLabel: string;

  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;

  helperText: string;
  showCorrectAnswer: boolean;
  correctAnswerText: string;

  onCheck: () => void;
  onSkip: () => void;

  footerText: string;

  // NUEVO
  onSpeak: () => void;
  speakDisabled?: boolean;
  speakAriaLabel: string;
  speakTooltip?: string;
};

export function AnimalGameCard({
  animal,
  learnLabel,
  answerLabel,
  writePrompt,
  checkLabel,
  skipLabel,
  value,
  onChange,
  onEnter,
  helperText,
  showCorrectAnswer,
  correctAnswerText,
  onCheck,
  onSkip,
  footerText,
  onSpeak,
  speakDisabled = false,
  speakAriaLabel,
  speakTooltip,
}: Props) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 220, sm: 280, md: 320 },
          bgcolor: "grey.50",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            bgcolor: "common.white",
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Image
            src={animal.img}
            alt={animal.id}
            fill
            sizes="(max-width: 600px) 100vw, 600px"
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        {/* Botón de altavoz (overlay arriba a la derecha) */}
        <Box sx={{ position: "absolute", top: 12, right: 12 }}>
          <Tooltip
            title={speakTooltip ?? ""}
            disableHoverListener={!speakTooltip}
          >
            <span>
              <IconButton
                onClick={onSpeak}
                disabled={speakDisabled}
                aria-label={speakAriaLabel}
                sx={{
                  bgcolor: "common.white",
                  border: 1,
                  borderColor: "divider",
                  "&:hover": { bgcolor: "grey.50" },
                }}
              >
                <VolumeUpIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <CardContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            {writePrompt + " " + learnLabel}
          </Typography>

          <TextField
            label={answerLabel + " " + learnLabel}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEnter();
            }}
            fullWidth
            autoFocus
            helperText={helperText}
          />

          {showCorrectAnswer && (
            <Alert severity="info">{correctAnswerText}</Alert>
          )}

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={onCheck}
              disabled={!value.trim()}
            >
              {checkLabel}
            </Button>
            <Button variant="outlined" onClick={onSkip}>
              {skipLabel}
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {footerText}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
