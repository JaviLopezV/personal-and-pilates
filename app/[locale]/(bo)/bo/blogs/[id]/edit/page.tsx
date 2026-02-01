import { prisma } from "../../../../../../lib/prisma";
import { Typography } from "@mui/material";
import EditPostForm from "./EditPostForm";
import { getTranslations } from "next-intl/server";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("bo.editPost");

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  if (!post) return <Typography>{t("notFound")}</Typography>;

  return <EditPostForm locale={locale} post={post} />;
}
