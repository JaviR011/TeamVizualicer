
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, hours } = await req.json();
  if (!email || typeof hours !== "number") {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }
  const emailNorm = String(email).trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: emailNorm } });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { email: emailNorm },
    data: { serviceHours: (user.serviceHours ?? 0) + hours },
  });

  return NextResponse.json({ ok: true, serviceHours: updated.serviceHours });
}
