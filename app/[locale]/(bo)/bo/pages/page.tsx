import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import { prisma } from "@/app/lib/prisma";
import { ensureFoPagesExist, FO_PAGES } from "@/app/lib/pages";
import { updatePageStatus } from "./actions";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function BoPagesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("bo.pages");

  // crea/actualiza registros para reflejar las páginas FO actuales
  await ensureFoPagesExist();

  const pages = await prisma.page.findMany({
    orderBy: { path: "asc" },
    select: { path: true, name: true, status: true, updatedAt: true },
  });

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>
        {t("title")}
      </Typography>

      <Paper variant="outlined">
        <Box>
          {pages.map((p) => (
            <Box
              key={p.path}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 220px 140px",
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box>
                <Typography fontWeight={700}>{p.name ?? p.path}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.path}
                </Typography>
              </Box>

              <form action={updatePageStatus.bind(null, locale, p.path)}>
                <Select
                  size="small"
                  name="status"
                  defaultValue={p.status}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="ACTIVE">{t("status.ACTIVE")}</MenuItem>
                  <MenuItem value="UNDER_CONSTRUCTION">
                    {t("status.UNDER_CONSTRUCTION")}
                  </MenuItem>
                  <MenuItem value="INACTIVE">{t("status.INACTIVE")}</MenuItem>
                </Select>

                <Button type="submit" size="small" sx={{ ml: 1 }}>
                  {t("save")}
                </Button>
              </form>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ justifySelf: "end" }}
              >
                {new Date(p.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Stack>
  );
}
