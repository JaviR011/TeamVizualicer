import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Falta email" }, { status: 400 });
  const u = await User.findOne({ email }, { serviceHours: 1 }).lean();
  return NextResponse.json({ ok: true, serviceHours: u?.serviceHours ?? 0 });
}
