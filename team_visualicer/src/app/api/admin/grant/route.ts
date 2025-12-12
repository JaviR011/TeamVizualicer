import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const rawEmail = body?.email;
    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { ok: false, error: "Falta el correo del miembro." },
        { status: 400 }
      );
    }

    const emailNorm = rawEmail.trim().toLowerCase();
    if (!emailNorm) {
      return NextResponse.json(
        { ok: false, error: "Correo inválido." },
        { status: 400 }
      );
    }

    // Verificar que exista
    const existing = await prisma.user.findUnique({
      where: { email: emailNorm },
      select: { id: true, name: true, email: true, isAdmin: true },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "No se encontró un usuario con ese correo." },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { email: emailNorm },
      data: { isAdmin: true },
      select: { id: true, name: true, email: true, isAdmin: true },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[admins/grant] error:", err);
    return NextResponse.json(
      { ok: false, error: "Error al otorgar permisos de administrador." },
      { status: 500 }
    );
  }
}
