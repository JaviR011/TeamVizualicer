import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ScheduleItem from "@/lib/models/ScheduleItem";

// GET /api/schedule?from=2025-10-01&to=2025-10-31 (opcional)
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const q: any = {};
  if (from || to) {
    q.start = {};
    if (from) q.start.$gte = new Date(from);
    if (to)   q.start.$lte = new Date(to);
  }

  const items = await ScheduleItem.find(q).sort({ start: 1 }).lean();
  const data = items.map((e: any) => ({
    id: e._id.toString(),
    title: e.title,
    start: new Date(e.start).toISOString(),
    end:   new Date(e.end).toISOString(),
    audience: e.audience || "Todos",
    createdBy: e.createdBy || "",
  }));
  return NextResponse.json({ ok: true, data });
}

// POST /api/schedule  body: {title, start, end, audience?, createdBy?}
export async function POST(req: Request) {
  await dbConnect();
  const { title, start, end, audience = "Todos", createdBy = "" } = await req.json();
  if (!title || !start || !end)
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  const ev = await ScheduleItem.create({ title, start, end, audience, createdBy });
  return NextResponse.json({ ok: true, id: ev._id.toString() });
}

// DELETE /api/schedule?id=<id>
export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  await ScheduleItem.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}
