import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "email requerido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const serviceHours = user?.serviceHours ?? 0;

    return NextResponse.json({
      ok: true,
      serviceHours,
    });
  } catch (err) {
    console.error("[progress/me][POST]", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL" },
      { status: 500 }
    );
  }
}
