import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";
import  Hour  from "@/lib/models/Hour"; 

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ ok: false, error: "EMAIL_REQUIRED" }, { status: 400 });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ ok: false, error: "USER_NOT_FOUND" }, { status: 404 });
    }

    // Horas acumuladas (si ya guardas 'minutes' o similar en Hour)
    const agg = await Hour.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: "$userId", minutes: { $sum: "$minutes" } } },
    ]);

    const minutes = agg[0]?.minutes || 0;
    const serviceHours = Math.round((minutes / 60) * 10) / 10;

    const data = {
      id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      memberType: user.memberType || "servicio-social",
      isAdmin: !!user.isAdmin,
      serviceHours,
    };

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("[auth/me] GET", e);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
