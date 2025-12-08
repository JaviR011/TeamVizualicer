
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const emailNorm = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        isAdmin: !!user.isAdmin,
        serviceHours: user.serviceHours ?? 0,
      },
    });
  } catch (err) {
    console.error("[auth/login] INTERNAL", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
