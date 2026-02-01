import { Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import ClassesClient from "./ClassesClient";

export default async function ClassesPage() {
  const t = await getTranslations("fo.classes");

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>
        <Typography color="text.secondary">{t("subtitle")}</Typography>
      </Stack>

      <ClassesClient />
    </Stack>
  );
}
