"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("register");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Registration error:", data.error);
        setError("errorGeneric");
        return;
      }

      // ✅ Tras registrarse, pedimos verificación de email
      setOk("successVerifyRedirect");
      setTimeout(() => {
        router.push(
          `/${locale}/verify-email?email=${encodeURIComponent(form.email)}`,
        );
      }, 700);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(1200px circle at 20% 10%, rgba(255,0,128,0.10), transparent 55%), radial-gradient(900px circle at 80% 30%, rgba(0,120,255,0.10), transparent 50%)",
      }}
    >
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
              {ok && <Alert severity="success">{t(ok)}</Alert>}

              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label={t("nameOptional")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineRoundedIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label={t("email")}
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
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
                    label={t("passwordMin")}
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
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

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Acepto la{" "}
                        <Link href="/legal/privacy">
                          Política de Privacidad,
                        </Link>{" "}
                        <Link href="/legal/use-terms">Términos de uso,</Link>{" "}
                        <Link href="/legal/terms-and-conditions">
                          Términos y condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link href="/legal/cookies">Política de Cookies</Link>
                      </Typography>
                    }
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !accepted}
                    endIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <ArrowForwardRoundedIcon />
                      )
                    }
                  >
                    {loading ? t("submitting") : t("submit")}
                  </Button>

                  <Divider />

                  <Button
                    component={Link as any}
                    href={`/login`}
                    variant="text"
                  >
                    {t("toLogin")}
                  </Button>
                </Stack>
              </Box>

              <Typography variant="caption" color="text.secondary">
                {t("footnote")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
