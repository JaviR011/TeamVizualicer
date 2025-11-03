import { NextResponse } from "next/server";
import {dbConnect } from "@/lib/db";
import Announcement from "@/lib/models/Announcement";

import { Types } from "mongoose";

interface AnnouncementDocument {
  _id: Types.ObjectId;
  title: string;
  message: string;
  author: string;
  priority: string;
  createdAt: Date;
}


export async function GET() {
  try {
    await dbConnect();
    const rows = await Announcement.find<AnnouncementDocument>({}, { title: 1, message: 1, author: 1, priority: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean();

    const data = rows.map(a => ({
      id: a._id.toString(),
      title: a.title,
      message: a.message,
      author: a.author || "Administrador",
      priority: a.priority || "low",
      date: new Date(a.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
    }));

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[announcements][GET]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}

/**
 * POST: crear anuncio
 * Body: { title: string; message: string; author?: string; priority?: "low" | "medium" | "high" }
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json() as { title?: string; message?: string; author?: string; priority?: string };

    if (!body?.title || !body?.message) {
      return NextResponse.json({ ok: false, error: "Faltan title o message" }, { status: 400 });
    }

    const doc = await Announcement.create({
      title: body.title,
      message: body.message,
      author: body.author || "Administrador",
      priority: ["low", "medium", "high"].includes(String(body.priority)) ? body.priority : "low",
    });

    return NextResponse.json({ ok: true, id: doc._id.toString() });
  } catch (err) {
    console.error("[announcements][POST]", err);
    return NextResponse.json({ ok: false, error: "INTERNAL" }, { status: 500 });
  }
}
