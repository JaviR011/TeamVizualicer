import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, career, memberType, email, password, confirmPassword } = body || {};

    // Validación básica
    if (!name || !career || !memberType || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
    }

    await dbConnect();

    // ¿Correo ya registrado?
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      career,
      memberType,
      email,
      passwordHash,
      isAdmin: false,
      serviceHours: 0,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        isAdmin: user.isAdmin,
        serviceHours: user.serviceHours,
      },
    });
  } catch (err: any) {
    // E11000 = email duplicado (por si la carrera de validaciones cambia)
    if (err?.code === 11000) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });
    }
    console.error("[register] INTERNAL:", err);
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
