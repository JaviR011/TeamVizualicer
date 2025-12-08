
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, newPassword } = await req.json();
  if (!email || !newPassword) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const emailNorm = String(email).trim().toLowerCase();
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: emailNorm },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
}
