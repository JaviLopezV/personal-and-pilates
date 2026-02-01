import { prisma } from "../../../lib/prisma";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { getTranslations } from "next-intl/server";
import { enforceFoPageStatus } from "@/app/lib/pages";

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("fo.blog");

  await enforceFoPageStatus({ locale, path: "/blog" });

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 20,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
    },
  });

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>
        <Typography color="text.secondary">{t("subtitle")}</Typography>
      </Stack>

      {posts.length === 0 ? (
        <Typography color="text.secondary">{t("empty")}</Typography>
      ) : (
        <Stack spacing={1.5}>
          {posts.map((p: any) => (
            <Card key={p.id} variant="outlined">
              <CardActionArea component={Link as any} href={`/blog/${p.slug}`}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={800}>
                        {p.title}
                      </Typography>
                      <Chip size="small" label={t("published")} />
                    </Stack>

                    {p.excerpt ? (
                      <Typography color="text.secondary">
                        {p.excerpt}
                      </Typography>
                    ) : null}

                    <Typography variant="caption" color="text.secondary">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleString()
                        : ""}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
