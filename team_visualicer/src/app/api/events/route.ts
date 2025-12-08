
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });

    // Mantener compatibilidad con front que espera _id
    const mapped = data.map((e) => ({
      _id: e.id,
      title: e.title,
      date: e.date.toISOString(),
      allDay: e.allDay,
    }));

    return NextResponse.json({ ok: true, data: mapped });
  } catch (e) {
    console.error("[events][GET]", e);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
