import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import { Box, Chip, Stack, Typography } from "@mui/material";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      publishedAt: true,
      status: true,
      author: { select: { name: true, email: true } },
    },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <Stack spacing={2.5} maxWidth={900}>
      <Stack spacing={1}>
        <Typography variant="h3" fontWeight={900}>
          {post.title}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" label="Publicado" />
          <Typography variant="caption" color="text.secondary">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleString()
              : ""}
            {" · "}
            {post.author?.name ?? post.author?.email ?? ""}
          </Typography>
        </Stack>

        {post.excerpt ? (
          <Typography color="text.secondary">{post.excerpt}</Typography>
        ) : null}
      </Stack>

      {post.coverImage ? (
        <Box
          component="img"
          alt={post.title}
          src={post.coverImage}
          sx={{
            width: "100%",
            maxHeight: 360,
            objectFit: "cover",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      ) : null}

      {/* Por ahora render plano (con saltos de línea) */}
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.75,
          fontSize: 16,
        }}
      >
        {post.content}
      </Box>
    </Stack>
  );
}
