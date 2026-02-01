import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { rateLimitOr429 } from "@/app/lib/rateLimit";

const MODE: "anonymize" | "delete" = "anonymize";

export async function DELETE(req: NextRequest) {
  // ✅ 3 deletes / hora / IP
  const limited = await rateLimitOr429(req, {
    key: "account:delete",
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    if (MODE === "delete") {
      await prisma.$transaction([
        prisma.post.deleteMany({ where: { authorId: userId } }),
        prisma.user.delete({ where: { id: userId } }),
      ]);
    } else {
      const deletedEmail = "deleted@arrow-blog.local";

      const deletedUser = await prisma.user.upsert({
        where: { email: deletedEmail },
        update: {},
        create: {
          email: deletedEmail,
          name: "Deleted user",
          password: null,
          role: "CLIENT",
        },
        select: { id: true },
      });

      await prisma.$transaction([
        prisma.post.updateMany({
          where: { authorId: userId },
          data: { authorId: deletedUser.id },
        }),
        prisma.user.delete({ where: { id: userId } }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}
