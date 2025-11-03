import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { email, newPassword } = await req.json();
  if (!email || !newPassword) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ email }, { $set: { passwordHash } });
  return NextResponse.json({ ok: true });
}
