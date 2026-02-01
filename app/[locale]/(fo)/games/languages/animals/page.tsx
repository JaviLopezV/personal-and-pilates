"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Lang = "es" | "en";

export default function AnimalsPage() {
  const t = useTranslations("games.languages.animals");
  const router = useRouter();
  const sp = useSearchParams();
  const goBack = () => router.push("/games");

  const learnLang = (sp.get("lang") as Lang) ?? "en";

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={goBack} aria-label={"back to games"}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={800}>
              {t("title")}
            </Typography>
          </Stack>
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          {t("description")}
        </Typography>

        <Card
          variant="outlined"
          sx={{ borderRadius: 3, overflow: "hidden", my: 3 }}
        >
          <CardActionArea
            onClick={() =>
              router.push(
                `/games/languages/animals/write?lang=${learnLang.toString()}`,
              )
            }
          >
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {t("write.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("write.description")}
                  </Typography>
                </Box>
                <Chip
                  label={t("write.available")}
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card
          variant="outlined"
          sx={{ borderRadius: 3, overflow: "hidden", my: 3 }}
        >
          <CardActionArea
            onClick={() =>
              router.push(
                `/games/languages/animals/choose-image?lang=${learnLang.toString()}`,
              )
            }
          >
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {t("chooseImage.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("chooseImage.description")}
                  </Typography>
                </Box>
                <Chip
                  label={t("chooseImage.available")}
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Container>
  );
}
