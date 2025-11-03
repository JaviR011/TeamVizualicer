import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import LabSchedule from "@/lib/models/LabSchedule";

// GET /api/lab-schedule?email=opcional
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || undefined;

    const query: any = {};
    if (email) query.userEmail = email;

    const items = await LabSchedule.find(query).lean();
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error("[lab-schedule][GET]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

// POST /api/lab-schedule
// body: { userEmail, userName, day, start, end, createdBy? }
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (
      !body?.userEmail || !body?.userName ||
      typeof body?.day !== "number" ||
      !body?.start || !body?.end
    ) {
      return NextResponse.json({ ok: false, error: "BAD_REQUEST" }, { status: 400 });
    }

    const item = await LabSchedule.create(body);
    return NextResponse.json({ ok: true, id: item._id.toString() });
  } catch (err) {
    console.error("[lab-schedule][POST]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
