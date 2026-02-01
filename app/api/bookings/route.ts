import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!session || !userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const sessionId = body?.sessionId as string | undefined;

  if (!sessionId) {
    return NextResponse.json({ error: "MISSING_SESSION_ID" }, { status: 400 });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const cs = await tx.classSession.findUnique({
        where: { id: sessionId },
        select: { id: true, capacity: true },
      });
      if (!cs) throw new Error("NOT_FOUND");

      const bookedCount = await tx.booking.count({
        where: { sessionId, status: "ACTIVE" },
      });

      if (bookedCount >= cs.capacity) {
        throw new Error("FULL");
      }

      // si ya existe booking cancelado, lo reactivamos
      const existing = await tx.booking.findUnique({
        where: { sessionId_userId: { sessionId, userId } },
      });

      if (existing) {
        if (existing.status === "ACTIVE") throw new Error("ALREADY_BOOKED");

        return tx.booking.update({
          where: { id: existing.id },
          data: { status: "ACTIVE", canceledAt: null },
        });
      }

      return tx.booking.create({
        data: { sessionId, userId },
      });
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "BOOKING_FAILED";

    const status =
      msg === "NOT_FOUND"
        ? 404
        : msg === "FULL"
          ? 409
          : msg === "ALREADY_BOOKED"
            ? 409
            : 400;

    return NextResponse.json({ error: msg }, { status });
  }
}
