"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "errorGeneric");
        return;
      }

      setVerified(true);
    } catch {
      setError("errorGeneric");
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("passwordsDontMatch");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
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

              {!verified ? (
                <Box component="form" onSubmit={verifyCode}>
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
                      component={Link as any}
                      href="/forgot-password"
                      variant="text"
                    >
                      {t("needCode")}
                    </Button>

                    <Button
                      component={Link as any}
                      href="/login"
                      variant="text"
                    >
                      {t("backToLogin")}
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box component="form" onSubmit={changePassword}>
                  <Stack spacing={2}>
                    <Alert severity="info">{t("codeOk")}</Alert>

                    <TextField
                      label={t("newPassword")}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      helperText={t("passwordHelp")}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <TextField
                      label={t("repeatPassword")}
                      type="password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                      autoComplete="new-password"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon />
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
                      {loading ? t("saving") : t("save")}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
