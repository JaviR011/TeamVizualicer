import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

/**
 * Ajusta horas de servicio de un usuario.
 * Body: { email: string, delta: number, reason?: string }
 */
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json() as { email?: string; delta?: number; reason?: string };

    // Validación de parámetros
    if (!body?.email || typeof body.delta !== "number" || !Number.isFinite(body.delta)) {
      return NextResponse.json({ ok: false, error: "Parámetros inválidos" }, { status: 400 });
    }

    // Buscar usuario
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    // Calcular nuevo total (mínimo 0)
    const current = Number(user.serviceHours ?? 0);
    const nextTotal = Math.max(0, current + Number(body.delta));

    user.serviceHours = nextTotal;
    await user.save(); // evita problemas de $inc / tipos

    return NextResponse.json({
      ok: true,
      user: {
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        isAdmin: user.isAdmin,
        serviceHours: user.serviceHours ?? 0,
      },
    });
  } catch (err: any) {
    console.error("[admin/hours] ERROR:", err);
    // Devuelve el mensaje si existe, para depurar desde el front
    return NextResponse.json({ ok: false, error: err?.message || "INTERNAL" }, { status: 500 });
  }
}
