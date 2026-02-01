"use client";

import { usePathname, useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button, ButtonGroup } from "@mui/material";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  // pathname ya incluye /es o /en, así que lo limpiamos
  const pathWithoutLocale = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";

  return (
    <ButtonGroup size="small" variant="contained" aria-label="Idioma">
      <Button
        component={Link as any}
        href={pathWithoutLocale}
        locale="es"
        disabled={locale === "es"}
      >
        ES
      </Button>

      <Button
        component={Link as any}
        href={pathWithoutLocale}
        locale="en"
        disabled={locale === "en"}
      >
        EN
      </Button>
    </ButtonGroup>
  );
}
