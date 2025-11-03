import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import GalleryItem from "@/lib/models/GalleryItem";

export async function GET() {
  await dbConnect();
  const items = await GalleryItem.find().sort({ createdAt: -1 }).lean();
  const data = items.map((g: any) => ({
    id: g._id.toString(),
    caption: g.caption,
    date: new Date(g.date ?? g.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
    url: g.url,
  }));
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  await dbConnect();
  const { url, caption, createdBy } = await req.json();
  if (!url) return NextResponse.json({ error: "Falta url" }, { status: 400 });
  const g = await GalleryItem.create({ url, caption, createdBy });
  return NextResponse.json({ ok: true, id: g._id.toString() });
}
