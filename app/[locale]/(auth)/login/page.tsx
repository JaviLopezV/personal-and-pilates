"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
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
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useTranslations } from "next-intl";
import { hideLegalFooter, showLegalFooter } from "@/app/stores/sharedStore";

export default function LoginPage() {
  const t = useTranslations("login");

  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";
  useEffect(() => {
    showLegalFooter();
  }, []);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setError(
          res.error === "ACCOUNT_DISABLED"
            ? "accountDisabled"
            : "invalidCredentials",
        );
        return;
      }

      // Leer sesión ya actualizada y redirigir por role
      const session = await getSession();
      const role = (session?.user as any)?.role;

      hideLegalFooter();
      router.push(role === "ADMIN" ? `/${locale}/bo/blogs` : `/${locale}`);
      router.refresh();
    } catch {
      setError("errorGeneric");
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

              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2}>
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
                    label={t("password")}
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    autoComplete="current-password"
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
                    {loading ? t("submitting") : t("submit")}
                  </Button>

                  <Divider />

                  {/* Link locale-aware: no concatenes locale */}
                  <Button
                    component={Link as any}
                    href="/register"
                    variant="text"
                  >
                    {t("toRegister")}
                  </Button>

                  <Button
                    component={Link as any}
                    href="/forgot-password"
                    variant="text"
                  >
                    {t("forgotPassword")}
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
