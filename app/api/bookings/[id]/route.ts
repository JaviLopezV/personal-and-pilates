import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role;

  if (!session || !userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking)
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const isOwner = booking.userId === userId;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELED", canceledAt: new Date() },
  });

  return NextResponse.json({ booking: updated });
}
