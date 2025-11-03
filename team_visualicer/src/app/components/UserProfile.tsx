"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Mail, Calendar, Award } from "lucide-react";
import type { MemberType } from "../App";

interface UserProfileProps {
  isAdmin: boolean;
  memberType: MemberType;
  userEmail?: string;
}

interface UserData {
  name: string;
  career: string;
  email: string;
  joinDate?: string;
  serviceHours?: number;
}

export function UserProfile({ isAdmin, memberType, userEmail }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null);

  // Cargar datos desde la BD
  useEffect(() => {
    if (!userEmail) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/me?email=${encodeURIComponent(userEmail)}`, { cache: "no-store" });
        const json = await res.json();
        if (res.ok && json.ok) {
          const user = json.user;
          setUserData({
            name: user.name,
            career: user.career || getMemberTypeLabel(),
            email: user.email,
            joinDate: user.joinedAt
              ? new Date(user.joinedAt).toLocaleDateString("es-MX", {
                  month: "short",
                  year: "numeric",
                })
              : "No especificado",
            serviceHours: user.serviceHours ?? undefined,
          });
        } else {
          console.error("Error al obtener usuario:", json.error);
        }
      } catch (err) {
        console.error("Error de conexión:", err);
      }
    };

    fetchUser();
  }, [userEmail]);

  const getMemberTypeLabel = () => {
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
  };

  // Datos temporales mientras carga
  const mockUser = userData || {
    name: "Cargando...",
    career: getMemberTypeLabel(),
    email: userEmail || "cargando@lab.com",
    joinDate: "Cargando...",
    serviceHours: undefined,
  };

  const schedules = [
    { week: "Semana del 8 de Ene", hours: 32, notes: "Excelente colocación de electrodos" },
    { week: "Semana del 15 de Ene", hours: 28, notes: "Buen progreso en análisis de datos" },
    { week: "Semana del 22 de Ene", hours: 35, notes: "Trabajo excepcional con procesamiento de señales" },
    { week: "Semana del 29 de Ene", hours: 30, notes: "Módulo de entrenamiento completado exitosamente" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 shadow-lg flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback
                className="bg-[#C41C1C] text-white"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
              >
                {mockUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left w-full">
              <h2
                className="text-[#1E1E1E]"
                style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                {mockUser.name}
              </h2>
              <p
                className="text-[#C41C1C] mt-1"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              >
                {mockUser.career}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#C41C1C]" />
                  <div>
                    <p className="text-[#5A5A5A]" style={{ fontSize: "0.75rem" }}>
                      Correo
                    </p>
                    <p className="text-[#1E1E1E]" style={{ fontSize: "0.9rem" }}>
                      {mockUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#C41C1C]" />
                  <div>
                    <p className="text-[#5A5A5A]" style={{ fontSize: "0.75rem" }}>
                      Se unió
                    </p>
                    <p className="text-[#1E1E1E]" style={{ fontSize: "0.9rem" }}>
                      {mockUser.joinDate}
                    </p>
                  </div>
                </div>

                {mockUser.serviceHours !== undefined && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#C41C1C]" />
                    <div>
                      <p className="text-[#5A5A5A]" style={{ fontSize: "0.75rem" }}>
                        Horas de Servicio
                      </p>
                      <p className="text-[#1E1E1E]" style={{ fontSize: "0.9rem" }}>
                        {mockUser.serviceHours} horas
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule & Comments */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle
            className="text-[#1E1E1E]"
            style={{ fontSize: "1.25rem" }}
          >
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className="p-4 bg-[#F5EFE6] rounded-xl border-l-4 border-[#C41C1C]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4
                    className="text-[#1E1E1E]"
                    style={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    {schedule.week}
                  </h4>
                  {memberType === "servicio-social" && (
                    <span
                      className="text-[#C41C1C]"
                      style={{ fontSize: "1rem", fontWeight: 600 }}
                    >
                      {schedule.hours} horas
                    </span>
                  )}
                </div>
                <p
                  className="text-[#5A5A5A]"
                  style={{ fontSize: "0.9rem" }}
                >
                  {schedule.notes}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
