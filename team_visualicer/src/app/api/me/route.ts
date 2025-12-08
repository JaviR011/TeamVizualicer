
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email requerido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      memberType: user.memberType,
      isAdmin: !!user.isAdmin,
      career: user.career || "",
      serviceHours: user.serviceHours || 0,
    };

    return NextResponse.json({ ok: true, user: data });
  } catch (e: any) {
    console.error("[me] ERROR", e);
    return NextResponse.json({ ok: false, error: e.message || "INTERNAL" }, { status: 500 });
  }
}
