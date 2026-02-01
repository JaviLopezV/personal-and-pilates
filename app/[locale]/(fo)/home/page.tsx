import { Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("fo.home");

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>
      </Stack>
    </Stack>
  );
}
