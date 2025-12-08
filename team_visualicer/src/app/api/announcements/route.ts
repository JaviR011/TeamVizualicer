
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const anns = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

  const data = anns.map((a) => {
  const rawDate = (a as any).date ?? (a as any).createdAt ?? new Date();
  const date =
  rawDate instanceof Date ? rawDate.toISOString() : new Date(rawDate).toISOString();

  return {
    id: a.id,
    title: a.title,
    message: a.message,
    author: a.author || "Administrador",
    priority: (a.priority as "low" | "medium" | "high") ?? "low",
    date,
  };
  });

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[announcements][GET]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { title, message, author?, priority? }

    if (!body?.title || !body?.message) {
      return NextResponse.json(
        { ok: false, error: "TITLE_AND_MESSAGE_REQUIRED" },
        { status: 400 },
      );
    }

    const priorityRaw = String(body.priority || "low");
    const priority =
      ["low", "medium", "high"].includes(priorityRaw) ? priorityRaw : "low";

    const created = await prisma.announcement.create({
      data: {
        title: body.title,
        message: body.message,
        author: body.author || "Administrador",
        priority,
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[announcements][POST]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "id requerido" },
        { status: 400 }
      );
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[announcements][DELETE]", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL" },
      { status: 500 }
    );
  }
}
