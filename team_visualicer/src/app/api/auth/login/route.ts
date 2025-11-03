import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // usuario no existe
      return NextResponse.json({ error: "Credenciales" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      // contraseña incorrecta
      return NextResponse.json({ error: "Credenciales" }, { status: 401 });
    }

    // solo lo necesario para el front
    return NextResponse.json({
      ok: true,
      user: {
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        isAdmin: !!user.isAdmin,
        serviceHours: user.serviceHours ?? 0,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
