"use client";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CookieBanner() {
  const t = useTranslations("cookies.banner");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookiesAccepted")) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        color: "white",
        bgcolor: "black",
        borderTop: "1px solid",
        borderColor: "divider",
        p: 2,
        zIndex: 2000,
      }}
    >
      <Typography variant="body2" sx={{ color: "white" }}>
        {t.rich("text", {
          link: (chunks) => (
            <Link
              href="/legal/cookies"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {chunks}
            </Link>
          ),
        })}
      </Typography>

      <Button
        size="small"
        sx={{ mt: 1 }}
        variant="contained"
        onClick={() => {
          localStorage.setItem("cookiesAccepted", "true");
          setOpen(false);
        }}
      >
        {t("accept")}
      </Button>
    </Box>
  );
}
