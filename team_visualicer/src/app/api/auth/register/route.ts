
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, career, memberType, email, password, confirmPassword } = body || {};

    if (!name || !career || !memberType || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
    }

    const emailNorm = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existing) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        career,
        memberType,
        email: emailNorm,
        passwordHash,
        isAdmin: false,
        serviceHours: 0,
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
  } catch (err: any) {
    console.error("[register] INTERNAL:", err);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
