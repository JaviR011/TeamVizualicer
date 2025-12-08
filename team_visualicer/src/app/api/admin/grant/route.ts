
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Falta email" }, { status: 400 });
  }
  const emailNorm = String(email).trim().toLowerCase();
  await prisma.user.update({
    where: { email: emailNorm },
    data: { isAdmin: true },
  });
  return NextResponse.json({ ok: true });
}
