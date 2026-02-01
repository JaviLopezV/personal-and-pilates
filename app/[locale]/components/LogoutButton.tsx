"use client";

import { signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const params = useParams();
  const locale = (params?.locale as string) || "es";
  const t = useTranslations("common");

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<LogoutRoundedIcon />}
      onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
    >
      {t("logout")}
    </Button>
  );
}
