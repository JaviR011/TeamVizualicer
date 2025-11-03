import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET() {
  await dbConnect();
  const users = await User.find({}, { name: 1, email: 1, memberType: 1, serviceHours: 1 }).sort({ createdAt: -1 }).lean();
  const data = users.map((u: any, i: number) => ({
    id: i + 1,
    name: u.name,
    role: u.memberType === "Investigador" ? "Investigador" : (u.memberType || "Miembro"),
    type: u.memberType || "Miembro",
    description: "",
    initials: (u.name || "M")[0].toUpperCase() + (u.name?.split(" ")[1]?.[0]?.toUpperCase() || ""),
    serviceHours: u.serviceHours ?? 0,
  }));
  return NextResponse.json({ ok: true, data });
}
