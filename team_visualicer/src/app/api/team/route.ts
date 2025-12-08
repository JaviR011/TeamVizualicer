import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { MemberType } from "@/app/App";

// Etiqueta bonita para el tipo de miembro
function getMemberTypeLabel(memberType: MemberType): string {
  switch (memberType) {
    case "investigador":
      return "Investigador Contratado";
    case "posgrado":
      return "Estudiante de Posgrado";
    case "practicante":
      return "Practicante";
    case "servicio-social":
      return "Miembro de Servicio Social";
    default:
      return "Miembro del Laboratorio";
  }
}

export async function GET() {
  try {
    // Traemos todos los usuarios del laboratorio
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });

    const data = users.map((u) => {
      const memberType = (u.memberType as MemberType) ?? null;

      // Iniciales: del nombre si hay, si no del correo
      const base = u.name && u.name.trim().length > 0 ? u.name : u.email;
      const initials = base
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();

      // Descripción opcional: intenta description, bio, about...
      const anyUser = u as any;
      const description =
        anyUser.description ?? anyUser.bio ?? anyUser.about ?? "";

      return {
        id: u.id,
        email: u.email,                          // 👈 AQUÍ VA EL CORREO
        name: u.name || u.email,
        role: getMemberTypeLabel(memberType),    // texto bonito para el tipo
        type: memberType ?? "otro",
        description,
        initials,
        serviceHours: u.serviceHours ?? undefined,
      };
    });

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[team][GET]", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL" },
      { status: 500 }
    );
  }
}
