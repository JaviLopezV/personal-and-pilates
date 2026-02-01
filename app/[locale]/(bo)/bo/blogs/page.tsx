import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { prisma } from "../../../../lib/prisma";
import { getTranslations } from "next-intl/server";

export default async function BlogsAdminPage() {
  const t = await getTranslations("bo.blogs");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true, createdAt: true },
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>

        <Link href="/bo/blogs/new" style={{ textDecoration: "none" }}>
          <Button variant="contained">{t("new")}</Button>
        </Link>
      </Stack>

      <Paper variant="outlined">
        {posts.length === 0 ? (
          <Box p={3}>
            <Typography color="text.secondary">{t("empty")}</Typography>
          </Box>
        ) : (
          <Box>
            {posts.map((p) => (
              <Box
                key={p.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 160px",
                  px: 3,
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={600}>{p.title}</Typography>

                <Typography
                  color={
                    p.status === "PUBLISHED" ? "success.main" : "text.secondary"
                  }
                >
                  {t(`status.${p.status}` as any)}
                </Typography>

                <Link
                  href={`/bo/blogs/${p.id}/edit`}
                  style={{ textDecoration: "none", justifySelf: "end" }}
                >
                  <Button size="small">{t("edit")}</Button>
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
