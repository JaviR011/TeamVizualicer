import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const limitParam = searchParams.get("limit");

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "email requerido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "usuario no encontrado" },
        { status: 404 }
      );
    }

    const take = Math.max(1, Math.min(5, Number(limitParam) || 5));

    const records = await prisma.hourRecord.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take,
    });

    const data = records.map((r) => ({
      id: r.id,
      date: r.date.toISOString(),
      hours: r.minutes, // usamos "minutes" como cantidad de horas ajustadas
      notes:
        r.minutes >= 0
          ? `Se agregaron ${r.minutes} horas de servicio`
          : `Se restaron ${Math.abs(r.minutes)} horas de servicio`,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[hours/history][GET]", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL" },
      { status: 500 }
    );
  }
}
