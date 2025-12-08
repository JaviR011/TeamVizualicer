import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Priority = "low" | "medium" | "high";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        title: true,
        message: true,
        author: true,
        priority: true,
      },
    });

    const data = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      author: a.author || "Administrador",
      priority: (a.priority as Priority) ?? "low",
      // 👇 aquí usamos createdAt en lugar de "date"
      date: a.createdAt.toISOString(),
    }));

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[auth/announcements][GET]", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL" },
      { status: 500 }
    );
  }
}
