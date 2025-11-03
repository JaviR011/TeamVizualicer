import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import  Event from "@/lib/models/Event";

export async function GET() {
  try {
    await dbConnect();
    const data = await Event.find().sort({ date: 1 }).lean();
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok:false, error:"INTERNAL" }, { status: 500 });
  }
}
