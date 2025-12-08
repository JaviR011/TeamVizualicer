import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const daysMap = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sáb/Dom"];

const dayToIndex = (label: string): number => {
  const idx = daysMap.indexOf(label);
  return idx >= 0 ? idx : 0;
};

const indexToLabel = (idx: number): string => daysMap[idx] ?? "Lunes";

// GET /api/lab-schedule?email=opcional
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || undefined;

    const where = email ? { userEmail: email } : {};

    const rows = await prisma.labSchedule.findMany({
      where,
      orderBy: [{ day: "asc" }, { start: "asc" }],
    });

    const data = rows.map((e) => ({
      id: e.id,
      memberName: e.userName,
      memberEmail: e.userEmail,
      day: indexToLabel(e.day),
      start: e.start,
      end: e.end,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[lab-schedule][GET]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

// POST /api/lab-schedule
// body: { day: "Lunes", start: "09:00", end: "13:00", userEmail, userName, createdBy }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, userName, day, start, end, createdBy } = body;

    if (
      !userEmail ||
      !userName ||
      typeof day !== "string" ||
      typeof start !== "string" ||
      typeof end !== "string"
    ) {
      return NextResponse.json({ ok: false, error: "BAD_REQUEST" }, { status: 400 });
    }

    const row = await prisma.labSchedule.create({
      data: {
        userEmail,
        userName,
        day: dayToIndex(day),
        start,
        end,
        createdBy,
      },
    });

    return NextResponse.json({
      ok: true,
      data: { id: row.id },
    });
  } catch (err) {
    console.error("[lab-schedule][POST]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

// PUT /api/lab-schedule
// body: { id, start, end }  ← justo lo que manda Schedule.tsx
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, start, end } = body;

    if (!id || typeof start !== "string" || typeof end !== "string") {
      return NextResponse.json({ ok: false, error: "BAD_REQUEST" }, { status: 400 });
    }

    const updated = await prisma.labSchedule.update({
      where: { id },
      data: { start, end },
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: updated.id,
        memberName: updated.userName,
        memberEmail: updated.userEmail,
        day: indexToLabel(updated.day),
        start: updated.start,
        end: updated.end,
      },
    });
  } catch (err) {
    console.error("[lab-schedule][PUT]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

// DELETE /api/lab-schedule?id=...
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID_REQUIRED" }, { status: 400 });
    }

    await prisma.labSchedule.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lab-schedule][DELETE]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
