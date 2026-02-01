"use client";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useStore } from "@nanostores/react";
import { $legalFooter } from "@/app/stores/sharedStore";
const drawerWidth = 260;
export default function LegalFooter({
  hasSidebar = false,
}: {
  hasSidebar?: boolean;
}) {
  const t = useTranslations("legal.footer");
  const legalFooter = useStore($legalFooter);
  const year = new Date().getFullYear();

  if (!legalFooter.active) return;

  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: { xs: 2, sm: 3 },
        mt: { xs: 4, sm: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
        color: "text.secondary",
        backgroundColor: "background.paper",
        ml: hasSidebar ? { md: `${drawerWidth}px`, xs: 0 } : 0,
        width: hasSidebar
          ? { md: `calc(100% - ${drawerWidth}px)`, xs: "100%" }
          : "100%",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        sx={{
          "& a": {
            color: "inherit",
            textDecoration: "none",
            fontSize: 14,
          },
          "& a:hover": { textDecoration: "underline" },
        }}
      >
        <Link href="/legal/legal-notice">{t("legalNotice")}</Link>
        <Link href="/legal/privacy">{t("privacy")}</Link>
        <Link href="/legal/cookies">{t("cookies")}</Link>
        <Link href="/legal/use-terms">{t("useTerms")}</Link>
        <Link href="/legal/terms-and-conditions">
          {t("termsAndConditions")}
        </Link>
      </Stack>

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        {t("copyright", { year })}
      </Typography>
    </Box>
  );
}
