import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const { email, hours } = await req.json();
  if (!email || typeof hours !== "number") return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  const u = await User.findOneAndUpdate({ email }, { $inc: { serviceHours: hours } }, { new: true });
  if (!u) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, serviceHours: u.serviceHours });
}
