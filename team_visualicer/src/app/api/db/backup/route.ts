import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Ruta al SQLite que usa Prisma
function getSqlitePath() {
  const dbUrl = process.env.DATABASE_URL ?? "file:./data/dev.db";

  // DATABASE_URL viene como "file:./data/dev.db" → nos quedamos solo con la parte del archivo
  const match = dbUrl.match(/^file:(.+)$/);
  const relative = match ? match[1] : "./data/dev.db";

  return path.resolve(process.cwd(), relative);
}

// ============== DESCARGAR BACKUP (GET) ==============
export async function GET() {
  try {
    const dbPath = getSqlitePath();
    const fileBuffer = await fs.readFile(dbPath);

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${stamp}.db`;

    // Cast a any para que TS no se queje de Buffer vs BodyInit
    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[/api/db/backup][GET] error:", err);
    return NextResponse.json(
      { ok: false, error: "No se pudo generar el backup de la base de datos." },
      { status: 500 }
    );
  }
}

// ============== RESTAURAR BACKUP (POST) ==============
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // IMPORTANTE: la key debe ser "backup"
    const backup = formData.get("backup");

    if (!backup || !(backup instanceof File)) {
      console.error(
        "[/api/db/backup][POST] keys recibidas:",
        Array.from(formData.keys())
      );
      return NextResponse.json(
        { ok: false, error: "No se recibió ningún archivo 'backup'." },
        { status: 400 }
      );
    }

    const arrayBuffer = await backup.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const dbPath = getSqlitePath();
    await fs.writeFile(dbPath, buffer);

    return NextResponse.json({
      ok: true,
      message: "Base de datos restaurada correctamente.",
    });
  } catch (err) {
    console.error("[/api/db/backup][POST] error:", err);
    return NextResponse.json(
      { ok: false, error: "Error al restaurar la base de datos." },
      { status: 500 }
    );
  }
}
