
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const data = items.map((g) => ({
    id: g.id,
    caption: g.caption,
    date: (g.date ?? g.createdAt).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    url: g.url,
  }));

  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  const { url, caption, createdBy } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "Falta url" }, { status: 400 });
  }

  const g = await prisma.galleryItem.create({
    data: { url, caption, createdBy },
  });

  return NextResponse.json({ ok: true, id: g.id });
}
