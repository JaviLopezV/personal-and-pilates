import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!session || !userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      session: {
        select: {
          id: true,
          title: true,
          type: true,
          instructor: true,
          startsAt: true,
          endsAt: true,
        },
      },
    },
  });

  return NextResponse.json({ bookings });
}
