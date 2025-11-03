import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import LabSchedule from "@/lib/models/LabSchedule";

// PUT /api/lab-schedule/:id   body: { day?, start?, end? }
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();

    const update: any = {};
    if (typeof body.day === "number") update.day = body.day;
    if (typeof body.start === "string") update.start = body.start;
    if (typeof body.end === "string") update.end = body.end;

    const updated = await LabSchedule.findByIdAndUpdate(params.id, update, { new: true });
    if (!updated) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lab-schedule][PUT]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

// DELETE /api/lab-schedule/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const r = await LabSchedule.findByIdAndDelete(params.id);
    if (!r) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lab-schedule][DELETE]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
