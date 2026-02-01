"use client";
import { useEffect } from "react";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocaleSwitcher from "../../components/LocaleSwitcher";
import { showLegalFooter } from "@/app/stores/sharedStore";

export default function AuthLanding() {
  const t = useTranslations("auth");
  useEffect(() => {
    showLegalFooter();
  }, []);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background:
          "radial-gradient(1200px circle at 15% 10%, rgba(255,0,128,0.16), transparent 55%)," +
          "radial-gradient(1000px circle at 85% 20%, rgba(0,120,255,0.14), transparent 52%)," +
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative" }}>
        {/* Glow sutil detrás */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: -24,
            zIndex: 0,
            filter: "blur(22px)",
            opacity: 0.6,
            background:
              "radial-gradient(600px circle at 20% 20%, rgba(255,0,128,0.22), transparent 60%)," +
              "radial-gradient(600px circle at 80% 40%, rgba(0,120,255,0.18), transparent 60%)",
          }}
        />

        <Card
          elevation={0}
          sx={{
            position: "relative",
            zIndex: 1,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(10px)",
            // Borde con degradado “fino”
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              padding: "1px",
              borderRadius: "inherit",
              background:
                "linear-gradient(135deg, rgba(255,0,128,0.35), rgba(0,120,255,0.25), rgba(0,0,0,0))",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2.5}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      background:
                        "linear-gradient(135deg, rgba(255,0,128,0.10), rgba(0,120,255,0.10))",
                    }}
                  >
                    <FavoriteRoundedIcon fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={900}
                      sx={{ letterSpacing: -0.5, lineHeight: 1.1 }}
                    >
                      {t("title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("subtitle")}
                    </Typography>
                  </Box>
                </Stack>

                {/* Idioma arriba, más discreto */}
                <LocaleSwitcher />
              </Stack>

              <Divider sx={{ opacity: 0.6 }} />

              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  component={Link as any}
                  href="/register"
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 800,
                    py: 1.25,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "translateY(0px)" },
                    transition: "transform 140ms ease",
                  }}
                >
                  {t("register")}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  component={Link as any}
                  href="/login"
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 800,
                    py: 1.25,
                    "&:hover": { transform: "translateY(-1px)" },
                    "&:active": { transform: "translateY(0px)" },
                    transition: "transform 140ms ease",
                  }}
                >
                  {t("login")}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
