import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email requerido" }, { status: 400 });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const data = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      memberType: user.memberType,
      isAdmin: !!user.isAdmin,
      career: user.career || "",
      serviceHours: user.serviceHours || 0,
    };

    return NextResponse.json({ ok: true, user: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "INTERNAL" }, { status: 500 });
  }
}
