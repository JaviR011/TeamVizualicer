import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, hours, delta, amount, reason } = body;

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "email requerido" },
        { status: 400 }
      );
    }

    // aceptamos varios nombres posibles por si el front manda uno u otro
    const changeRaw = hours ?? delta ?? amount;
    const change = Number(changeRaw);

    if (!Number.isFinite(change) || change === 0) {
      return NextResponse.json(
        { ok: false, error: "cantidad inválida" },
        { status: 400 }
      );
    }

    // actualizar horas acumuladas del usuario
    const user = await prisma.user.update({
      where: { email },
      data: {
        serviceHours: { increment: change },
      },
    });

    // registrar el movimiento en HourRecord
    await prisma.hourRecord.create({
      data: {
        userId: user.id,
        userName: user.name,
        minutes: change,       // guardamos el ajuste (+/- horas)
        date: new Date(),
        // si en tu schema agregas un campo "reason", aquí lo puedes guardar:
        // reason: reason ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        isAdmin: user.isAdmin,
        serviceHours: user.serviceHours,
      },
    });
  } catch (err) {
    console.error("[admin/hours][POST]", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL" },
      { status: 500 }
    );
  }
}
