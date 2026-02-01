"use server";

import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export type PostActionState =
  | {
      ok: true;
      fieldErrors?: undefined;
      formError?: undefined;
      postId?: string;
    }
  | {
      ok: false;
      fieldErrors?: Record<string, string[]>;
      formError?: string;
      postId?: undefined;
    };

const PostUpsertSchema = z.object({
  title: z.string().min(1, "Título obligatorio"),
  slug: z.string().min(1, "Slug obligatorio"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Contenido obligatorio"),
  coverImage: z.string().url("URL inválida").optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

type Status = "DRAFT" | "PUBLISHED";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function requireBoUser(locale: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session) redirect(`/${locale}/login`);
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect(`/${locale}`);

  return { userId };
}

export async function createPost(
  locale: string,
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const { userId } = await requireBoUser(locale);

  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "");
  const slug = slugify(rawSlug || title);

  const parsed = PostUpsertSchema.safeParse({
    title,
    slug,
    excerpt: (formData.get("excerpt") as string) || null,
    content: String(formData.get("content") ?? ""),
    coverImage: (formData.get("coverImage") as string) || null,
    status: String(formData.get("status") ?? "DRAFT"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: flat.fieldErrors,
      formError: flat.formErrors?.[0],
    };
  }

  const status = parsed.data.status as Status;
  const publishedAt = status === "PUBLISHED" ? new Date() : null;

  try {
    const created = await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt ?? null,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage ?? null,
        status,
        publishedAt,
        authorId: userId,
      },
      select: { id: true },
    });

    return { ok: true, postId: created.id };
  } catch {
    return {
      ok: false,
      formError: "No se pudo crear el post (¿slug duplicado?).",
    };
  }
}

export async function updatePost(
  locale: string,
  postId: string,
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  await requireBoUser(locale);

  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "");
  const slug = slugify(rawSlug || title);

  const parsed = PostUpsertSchema.safeParse({
    title,
    slug,
    excerpt: (formData.get("excerpt") as string) || null,
    content: String(formData.get("content") ?? ""),
    coverImage: (formData.get("coverImage") as string) || null,
    status: String(formData.get("status") ?? "DRAFT"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: flat.fieldErrors,
      formError: flat.formErrors?.[0],
    };
  }

  const status = parsed.data.status as Status;
  const publishedAt = status === "PUBLISHED" ? new Date() : null;

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt ?? null,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage ?? null,
        status,
        publishedAt,
      },
      select: { id: true },
    });

    return { ok: true, postId };
  } catch {
    return { ok: false, formError: "No se pudo actualizar el post." };
  }
}

export async function deletePost(locale: string, postId: string) {
  await requireBoUser(locale);

  await prisma.post.delete({
    where: { id: postId },
    select: { id: true },
  });
}
