"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Box,
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Lang = "es" | "en";

export default function LanguagesPage() {
  const t = useTranslations("games.languages");
  const router = useRouter();
  const [learnLang, setLearnLang] = React.useState<Lang | null>(null);

  const goBack = () => router.push("/games");

  const handleLangChange = (
    _: React.MouseEvent<HTMLElement>,
    value: Lang | null,
  ) => {
    setLearnLang(value);
  };

  const canPickGame = Boolean(learnLang);
  const selectedLangLabel = learnLang ? t(learnLang) : "";

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={goBack} aria-label={"back to games"}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight={800}>
              {t("title")}
            </Typography>
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {t("description")}
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t("languageStep")}
            </Typography>

            <ToggleButtonGroup
              value={learnLang}
              exclusive
              onChange={handleLangChange}
              fullWidth
              sx={{ mt: 1 }}
            >
              <ToggleButton value="en" sx={{ py: 1.5 }}>
                {t("en")}
              </ToggleButton>
              <ToggleButton value="es" sx={{ py: 1.5 }}>
                {t("es")}
              </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ mt: 2 }}>
              <Chip
                label={
                  learnLang
                    ? t("languageSelected") + " " + selectedLangLabel
                    : t("selectLanguage")
                }
                color={learnLang ? "primary" : "default"}
                variant={learnLang ? "filled" : "outlined"}
              />
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            opacity: canPickGame ? 1 : 0.5,
            pointerEvents: canPickGame ? "auto" : "none",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t("gameStep")}
            </Typography>

            <Card
              variant="outlined"
              sx={{ borderRadius: 3, overflow: "hidden", my: 3 }}
            >
              <CardActionArea
                onClick={() =>
                  router.push(`/games/languages/animals?lang=${learnLang!}`)
                }
              >
                <CardContent>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {t("animals.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("animals.description")}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
