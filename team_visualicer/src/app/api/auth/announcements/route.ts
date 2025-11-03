import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Announcement  from "@/lib/models/Announcement";

export async function GET() {
  await dbConnect();
  const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();

  const data = announcements.map((a: any) => ({
    id: a._id?.toString(),
    title: a.title,
    message: a.message,
    author: a.author || "Administrador",
    date: new Date(a.createdAt).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    priority: a.priority || "low",
  }));

  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json(); // { title, message, author?, priority? }

  const created = await Announcement.create(body);
  // 👇 Forzamos el tipo a any para evitar el warning de TS
  const id = (created as any)._id?.toString();

  return NextResponse.json({ ok: true, id });
}
