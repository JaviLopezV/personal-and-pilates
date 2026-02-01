"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("common");
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/auth");
          }
        }}
        startIcon={<ArrowBackRoundedIcon />}
        size="large"
        variant="text"
        sx={{
          mb: 3,
          px: 0,
          fontWeight: 600,
          color: "text.secondary",
          alignSelf: "flex-start",
          "&:hover": {
            backgroundColor: "transparent",
            color: "primary.main",
            transform: "translateX(-2px)",
          },
          transition: "all .15s ease",
        }}
      >
        {t("back")}
      </Button>

      <Typography variant="h4" fontWeight={800} gutterBottom>
        {title}
      </Typography>

      <Box sx={{ color: "text.secondary", lineHeight: 1.7 }}>{children}</Box>
    </Container>
  );
}
