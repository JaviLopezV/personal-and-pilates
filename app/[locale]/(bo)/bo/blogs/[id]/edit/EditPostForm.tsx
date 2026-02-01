"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { deletePost, updatePost, type PostActionState } from "../../actions";
import { useTranslations } from "next-intl";

type PostDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | null;
  updatedAt: Date;
};

const initialState: PostActionState = { ok: true };

export default function EditPostForm({
  locale,
  post,
}: {
  locale: string;
  post: PostDTO;
}) {
  const t = useTranslations("bo.editPost");
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updatePost.bind(null, locale, post.id),
    initialState,
  );

  useEffect(() => {
    if (state.ok && state.postId) {
      router.refresh();
    }
  }, [state, router]);

  const statusLabel = t(`status.${post.status}` as any);

  // Acción delete usando useActionState (opcional pero limpio)
  const [, deleteAction, isDeleting] = useActionState(async () => {
    await deletePost(locale, post.id);
    router.push(`/${locale}/bo/blogs`);
    router.refresh();
  }, undefined);

  return (
    <Stack spacing={3} maxWidth={900}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>

        <Typography color="text.secondary">
          {t("meta.status", { status: statusLabel })}
          {post.publishedAt
            ? t("meta.publishedAt", {
                date: new Date(post.publishedAt).toISOString(),
              })
            : ""}
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box component="form" action={formAction}>
          <Stack spacing={2}>
            {state.ok === false && (state.formError || state.fieldErrors) && (
              <Alert severity="error">
                {state.formError ?? t("errors.reviewFields")}
              </Alert>
            )}

            <TextField
              name="title"
              label={t("fields.title")}
              required
              defaultValue={post.title}
              error={state.ok === false && !!state.fieldErrors?.title}
              helperText={
                state.ok === false ? state.fieldErrors?.title?.[0] : ""
              }
            />

            <TextField
              name="slug"
              label={t("fields.slug")}
              defaultValue={post.slug}
              error={state.ok === false && !!state.fieldErrors?.slug}
              helperText={
                state.ok === false ? state.fieldErrors?.slug?.[0] : ""
              }
            />

            <TextField
              name="excerpt"
              label={t("fields.excerpt")}
              multiline
              minRows={2}
              defaultValue={post.excerpt ?? ""}
            />

            <TextField
              name="content"
              label={t("fields.content")}
              required
              multiline
              minRows={10}
              defaultValue={post.content}
              error={state.ok === false && !!state.fieldErrors?.content}
              helperText={
                state.ok === false ? state.fieldErrors?.content?.[0] : ""
              }
            />

            <TextField
              name="coverImage"
              label={t("fields.coverImage")}
              defaultValue={post.coverImage ?? ""}
              error={state.ok === false && !!state.fieldErrors?.coverImage}
              helperText={
                state.ok === false ? state.fieldErrors?.coverImage?.[0] : ""
              }
            />

            <TextField
              name="status"
              label={t("fields.status")}
              select
              defaultValue={post.status}
            >
              <MenuItem value="DRAFT">{t("status.DRAFT")}</MenuItem>
              <MenuItem value="PUBLISHED">{t("status.PUBLISHED")}</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={isPending || isDeleting}
              >
                {isPending ? t("actions.saving") : t("actions.save")}
              </Button>

              {/* DELETE sin formAction (evita error TS + build) */}
              <form action={deleteAction} style={{ display: "inline-flex" }}>
                <Button
                  type="submit"
                  variant="outlined"
                  color="error"
                  disabled={isPending || isDeleting}
                >
                  {isDeleting ? t("actions.deleting") : t("actions.delete")}
                </Button>
              </form>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
