import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ajusta `galleryItem` al nombre real de tu modelo en schema.prisma:
    //  - si tu modelo se llama `Gallery`, usa prisma.gallery.findMany()
    //  - si se llama `GalleryItem`, usa prisma.galleryItem.findMany(), etc.
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        url: true,
        caption: true,
        createdAt: true,
      },
    });

    const data = items.map((g) => ({
      id: g.id,
      title: g.title,
      url: g.url,
      caption: g.caption,
      // 👇 usamos createdAt y lo exponemos como `date` en la API:
      date: g.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[gallery][GET]", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL" },
      { status: 500 }
    );
  }
}
