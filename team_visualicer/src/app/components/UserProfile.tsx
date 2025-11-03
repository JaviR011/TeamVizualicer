import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Mail, Phone, Briefcase, Calendar, Award } from "lucide-react";
import type { MemberType } from "../App";

interface UserProfileProps {
  isAdmin: boolean;
  memberType: MemberType;
}

export function UserProfile({ isAdmin, memberType }: UserProfileProps) {
  const getMemberTypeLabel = () => {
    switch (memberType) {
      case "investigador": return "Investigador Contratado";
      case "posgrado": return "Estudiante de Posgrado";
      case "practicante": return "Practicante";
      case "servicio-social": return "Miembro de Servicio Social";
      default: return "Miembro del Laboratorio";
    }
  };

  const mockUser = {
    name: isAdmin ? "Dra. Sarah Johnson" : "Alex Martínez",
    career: isAdmin ? "Investigadora Principal" : getMemberTypeLabel(),
    email: isAdmin ? "sarah.johnson@lab.com" : "alex.martinez@lab.com",
    phone: "+1 (555) 123-4567",
    joinDate: "Enero 2024",
    supervisor: isAdmin ? null : "Dra. Sarah Johnson",
    serviceHours: memberType === "servicio-social" ? 287 : undefined,
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
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 shadow-lg flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#C41C1C] text-white" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                {mockUser.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left w-full">
              <h2 className="text-[#1E1E1E]" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                {mockUser.name}
              </h2>
              <p className="text-[#C41C1C] mt-1" style={{ fontSize: '1rem', fontWeight: 600 }}>
                {mockUser.career}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#C41C1C]" />
                  <div>
                    <p className="text-[#5A5A5A]" style={{ fontSize: '0.75rem' }}>Correo</p>
                    <p className="text-[#1E1E1E]" style={{ fontSize: '0.9rem' }}>{mockUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#C41C1C]" />
                  <div>
                    <p className="text-[#5A5A5A]" style={{ fontSize: '0.75rem' }}>Teléfono</p>
                    <p className="text-[#1E1E1E]" style={{ fontSize: '0.9rem' }}>{mockUser.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#C41C1C]" />
                  <div>
                    <p className="text-[#5A5A5A]" style={{ fontSize: '0.75rem' }}>Se unió</p>
                    <p className="text-[#1E1E1E]" style={{ fontSize: '0.9rem' }}>{mockUser.joinDate}</p>
                  </div>
                </div>
                
                {mockUser.supervisor && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-[#C41C1C]" />
                    <div>
                      <p className="text-[#5A5A5A]" style={{ fontSize: '0.75rem' }}>Supervisor</p>
                      <p className="text-[#1E1E1E]" style={{ fontSize: '0.9rem' }}>{mockUser.supervisor}</p>
                    </div>
                  </div>
                )}
                
                {mockUser.serviceHours !== undefined && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#C41C1C]" />
                    <div>
                      <p className="text-[#5A5A5A]" style={{ fontSize: '0.75rem' }}>Horas de Servicio</p>
                      <p className="text-[#1E1E1E]" style={{ fontSize: '0.9rem' }}>{mockUser.serviceHours} horas</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule & Comments */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
            Actividad Reciente {!isAdmin && mockUser.supervisor ? "y Comentarios del Supervisor" : ""}
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
                  <h4 className="text-[#1E1E1E]" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {schedule.week}
                  </h4>
                  {memberType === "servicio-social" && (
                    <span className="text-[#C41C1C]" style={{ fontSize: '1rem', fontWeight: 600 }}>
                      {schedule.hours} horas
                    </span>
                  )}
                </div>
                <p className="text-[#5A5A5A]" style={{ fontSize: '0.9rem' }}>
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
