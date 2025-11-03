import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Falta email" }, { status: 400 });
  await User.updateOne({ email }, { $set: { isAdmin: true } });
  return NextResponse.json({ ok: true });
}
