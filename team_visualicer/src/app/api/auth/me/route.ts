
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: false, error: "EMAIL_REQUIRED" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const data = {
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      memberType: (user.memberType as string) || "servicio-social",
      isAdmin: !!user.isAdmin,
      serviceHours: user.serviceHours ?? 0,
    };

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    console.error("[auth/me] GET", e);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
