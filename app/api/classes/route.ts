import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

function parseDate(v: string | null): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const fromParam = parseDate(url.searchParams.get("from"));
  const toParam = parseDate(url.searchParams.get("to"));

  const from = fromParam ?? new Date();
  const to = toParam ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // +14 días

  // sesión opcional (para saber si el usuario ya reservó)
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  const sessions = await prisma.classSession.findMany({
    where: {
      startsAt: { gte: from, lte: to },
    },
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      title: true,
      type: true,
      instructor: true,
      notes: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
      bookings: {
        where: { status: "ACTIVE" },
        select: { id: true, userId: true },
      },
    },
  });

  const result = sessions.map((s) => {
    const bookedCount = s.bookings.length;
    const myBooking = userId
      ? s.bookings.find((b) => b.userId === userId)
      : undefined;

    return {
      id: s.id,
      title: s.title,
      type: s.type,
      instructor: s.instructor,
      notes: s.notes,
      startsAt: s.startsAt,
      endsAt: s.endsAt,
      capacity: s.capacity,
      bookedCount,
      remaining: Math.max(0, s.capacity - bookedCount),
      isFull: bookedCount >= s.capacity,
      myBookingId: myBooking?.id ?? null,
    };
  });

  return NextResponse.json({ sessions: result });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const {
    title,
    type,
    instructor,
    notes,
    startsAt,
    endsAt,
    capacity = 10,
  } = body;

  if (!title || !type || !startsAt || !endsAt) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const starts = new Date(startsAt);
  const ends = new Date(endsAt);

  if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime())) {
    return NextResponse.json({ error: "INVALID_DATES" }, { status: 400 });
  }
  if (ends <= starts) {
    return NextResponse.json({ error: "END_BEFORE_START" }, { status: 400 });
  }
  if (typeof capacity !== "number" || capacity < 1) {
    return NextResponse.json({ error: "INVALID_CAPACITY" }, { status: 400 });
  }

  const created = await prisma.classSession.create({
    data: {
      title,
      type,
      instructor: instructor || null,
      notes: notes || null,
      startsAt: starts,
      endsAt: ends,
      capacity,
    },
  });

  return NextResponse.json({ session: created }, { status: 201 });
}
