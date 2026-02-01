import { Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import BookingsClient from "./BookingsClient";

export default async function MyBookingsPage() {
  const t = await getTranslations("fo.bookings");

  return (
    <Stack spacing={2.5}>
      <Typography variant="h4" fontWeight={800}>
        {t("title")}
      </Typography>

      <BookingsClient />
    </Stack>
  );
}
