import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const s = await prisma.classSession.findUnique({
    where: { id },
  });

  if (!s) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ session: s });
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (role !== "ADMIN" && role !== "SUPERADMIN")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });

  const data: any = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.type === "string") data.type = body.type;
  if (typeof body.instructor === "string" || body.instructor === null)
    data.instructor = body.instructor;
  if (typeof body.notes === "string" || body.notes === null)
    data.notes = body.notes;

  if (body.startsAt) {
    const d = new Date(body.startsAt);
    if (Number.isNaN(d.getTime()))
      return NextResponse.json({ error: "INVALID_STARTS_AT" }, { status: 400 });
    data.startsAt = d;
  }
  if (body.endsAt) {
    const d = new Date(body.endsAt);
    if (Number.isNaN(d.getTime()))
      return NextResponse.json({ error: "INVALID_ENDS_AT" }, { status: 400 });
    data.endsAt = d;
  }
  if (body.capacity !== undefined) {
    if (typeof body.capacity !== "number" || body.capacity < 1)
      return NextResponse.json({ error: "INVALID_CAPACITY" }, { status: 400 });
    data.capacity = body.capacity;
  }

  const updated = await prisma.classSession.update({
    where: { id },
    data,
  });

  return NextResponse.json({ session: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (role !== "ADMIN" && role !== "SUPERADMIN")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  await prisma.classSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
