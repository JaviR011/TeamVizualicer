
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/schedule?from=2025-10-01&to=2025-10-31 (opcional)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let where: any = {};
  if (from || to) {
    where.start = {};
    if (from) where.start.gte = new Date(from);
    if (to) where.start.lte = new Date(to);
  }

  const events = await prisma.scheduleItem.findMany({
    where,
    orderBy: { start: "asc" },
  });

  return NextResponse.json({ ok: true, data: events });
}

// POST /api/schedule
export async function POST(req: Request) {
  const body = await req.json();
  const { title, start, end, audience, createdBy } = body || {};

  if (!title || !start || !end) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const ev = await prisma.scheduleItem.create({
    data: {
      title,
      start: new Date(start),
      end: new Date(end),
      audience: audience || "Todos",
      createdBy,
    },
  });

  return NextResponse.json({ ok: true, id: ev.id });
}

// DELETE /api/schedule?id=<id>
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }
  await prisma.scheduleItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
