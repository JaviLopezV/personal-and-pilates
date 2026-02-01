"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();
  const locale = (params?.locale as string) || "es";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fromQuery = search?.get("email");
    if (fromQuery) setEmail(fromQuery);
  }, [search]);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "errorGeneric");
        return;
      }

      setDone(true);
      setTimeout(() => {
        router.push(`/${locale}/login`);
        router.refresh();
      }, 800);
    } catch {
      setError("errorGeneric");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "errorGeneric");
        return;
      }
    } catch {
      setError("errorGeneric");
    } finally {
      setLoading(false);
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
              {done && <Alert severity="success">{t("successRedirect")}</Alert>}

              <Box component="form" onSubmit={verify}>
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

                  <TextField
                    label={t("code")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    inputProps={{ inputMode: "numeric" }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyRoundedIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <ArrowForwardRoundedIcon />
                      )
                    }
                  >
                    {loading ? t("verifying") : t("verify")}
                  </Button>

                  <Divider />

                  <Button
                    type="button"
                    onClick={resend}
                    variant="text"
                    disabled={loading || !email}
                  >
                    {t("resend")}
                  </Button>

                  <Button component={Link as any} href="/login" variant="text">
                    {t("backToLogin")}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
