import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Hour from "@/lib/models/Hour";  // crea el modelo si no existe
import { User } from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const me = searchParams.get("me");
    const rank = searchParams.get("rank");

    if (rank === "month") {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const next  = new Date(now.getFullYear(), now.getMonth()+1, 1);

      const agg = await Hour.aggregate([
        { $match: { date: { $gte: first, $lt: next } } },
        { $group: { _id: "$userId", minutes: { $sum: "$minutes" } } },
        { $sort: { minutes: -1 } },
        { $limit: 10 },
      ]);

      // enriquece con nombre
      const ids = agg.map(a => a._id);
      const users = await User.find({ _id: { $in: ids } }, { name: 1 }).lean();
      const nameMap = new Map(users.map(u => [u._id.toString(), u.name]));

      const data = agg.map(a => ({
        userId: a._id.toString(),
        name: nameMap.get(a._id.toString()) || "Usuario",
        minutes: a.minutes,
        hours: Math.round((a.minutes/60)*10)/10
      }));

      return NextResponse.json({ ok: true, data });
    }

    if (me) {
      // aquí podrías identificar al usuario desde la cookie/jwt;
      // por simplicidad, permitimos ?email=...
      const email = searchParams.get("email") || "";
      const user = await User.findOne({ email }).lean();
      if (!user) return NextResponse.json({ ok:false, error:"No existe el usuario" }, { status: 404 });

      const data = await Hour.find({ userId: user._id }, { userId:1, userName:1, day:1, start:1, end:1 }).lean();
      return NextResponse.json({ ok: true, data });
    }

    // default: todo (sólo admin en real)
    const data = await Hour.find().lean();
    return NextResponse.json({ ok: true, data });
  } catch (e:any) {
    console.error("[hours] GET", e);
    return NextResponse.json({ ok:false, error:"INTERNAL" }, { status: 500 });
  }
}
