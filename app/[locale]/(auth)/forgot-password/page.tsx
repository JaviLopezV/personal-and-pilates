"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      // aunque falle, mostramos mensaje genérico
      if (!res.ok) {
        setError("errorGeneric");
      }

      setStatus("done");
    } catch {
      setError("errorGeneric");
      setStatus("done");
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2.5}>
              <Stack spacing={0.5}>
                <Typography variant="h5" fontWeight={800}>
                  {t("title")}
                </Typography>
                <Typography color="text.secondary">{t("subtitle")}</Typography>
              </Stack>

              {error && <Alert severity="error">{t(error)}</Alert>}

              {status === "done" ? (
                <Alert severity="success">{t("success")}</Alert>
              ) : (
                <Box component="form" onSubmit={onSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label={t("email")}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlineRoundedIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={status === "loading"}
                      endIcon={
                        status === "loading" ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <ArrowForwardRoundedIcon />
                        )
                      }
                    >
                      {status === "loading" ? t("submitting") : t("submit")}
                    </Button>
                  </Stack>
                </Box>
              )}

              <Divider />

              <Button component={Link as any} href="/login" variant="text">
                {t("backToLogin")}
              </Button>

              <Button
                component={Link as any}
                href="/reset-password"
                variant="text"
              >
                {t("haveCode")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
