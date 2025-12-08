
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const anns = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  const data = anns.map((a) => ({
    id: a.id,
    title: a.title,
    message: a.message,
    author: a.author || "Administrador",
    date: a.date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    priority: (a.priority as "low" | "medium" | "high") ?? "low",
  }));

  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  const body = await req.json(); // { title, message, author?, priority? }

  if (!body?.title || !body?.message) {
    return NextResponse.json(
      { ok: false, error: "TITLE_AND_MESSAGE_REQUIRED" },
      { status: 400 },
    );
  }

  const created = await prisma.announcement.create({
    data: {
      title: body.title,
      message: body.message,
      author: body.author,
      priority: body.priority || "low",
    },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
