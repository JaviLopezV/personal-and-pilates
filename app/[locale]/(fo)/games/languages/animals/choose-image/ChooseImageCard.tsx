// ChooseImageCard.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import type { Animal } from "../animalGame.data";

type Props = {
  promptTitle: string; // ej: "Selecciona:"
  promptWord: string; // ej: "dog"
  options: Animal[];
  onPick: (id: string) => void;
  locked: boolean;
  status: "idle" | "correct" | "wrong";
  correctId: string; // para marcar visualmente tras click
  footerText: string;
};

export function ChooseImageCard({
  promptTitle,
  promptWord,
  options,
  onPick,
  locked,
  status,
  correctId,
  footerText,
}: Props) {
  const helper =
    status === "correct"
      ? { severity: "success" as const, text: "✅ Correcto" }
      : status === "wrong"
        ? { severity: "warning" as const, text: "❌ Incorrecto" }
        : null;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {promptTitle}
            </Typography>
            <Typography variant="h5" fontWeight={900}>
              {promptWord.charAt(0).toUpperCase() + promptWord.slice(1)}
            </Typography>
          </Box>

          {helper && <Alert severity={helper.severity}>{helper.text}</Alert>}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                sm: "repeat(2, 1fr)",
              },
              gap: 1.5,
            }}
          >
            {options.map((a) => {
              const isCorrect = a.id === correctId;
              const showMark = locked && status !== "idle";

              const borderColor =
                showMark && status === "correct" && isCorrect
                  ? "success.main"
                  : showMark && status === "wrong" && isCorrect
                    ? "success.main"
                    : showMark && status === "wrong" && !isCorrect
                      ? "divider"
                      : "divider";

              const opacity =
                showMark && status === "wrong" && !isCorrect ? 0.75 : 1;

              return (
                <Box
                  key={a.id}
                  onClick={() => onPick(a.id)}
                  role="button"
                  aria-label={a.id}
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: 3,
                    border: 2,
                    borderColor,
                    bgcolor: "common.white",
                    overflow: "hidden",
                    cursor: locked ? "default" : "pointer",
                    opacity,
                    pointerEvents: locked ? "none" : "auto",
                    transition: "transform 120ms ease",
                    "&:hover": { transform: locked ? "none" : "scale(1.01)" },
                  }}
                >
                  <Image
                    src={a.img}
                    alt={a.id}
                    fill
                    sizes="(max-width: 600px) 50vw, 200px"
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              );
            })}
          </Box>

          <Typography variant="caption" color="text.secondary">
            {footerText}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
