import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Trophy, ChevronRight } from "lucide-react";

interface MemberOfTheMonthProps {
  onNavigate: (page: string) => void;
}

export function MemberOfTheMonth({ onNavigate }: MemberOfTheMonthProps) {
  const featuredMember = {
    name: "Chris Park",
    role: "Miembro de Servicio Social",
    quote: "Cada hora invertida en el laboratorio es una oportunidad para aprender y contribuir al avance de la neurociencia.",
    achievements: [
      "Completó 342 horas de servicio",
      "Mantuvo el equipo en perfecto estado",
      "Asistió en 15 experimentos exitosos",
    ],
    hours: 342,
    initials: "CP",
  };

  return (
    <div className="space-y-6">
      {/* Main Feature Card */}
      <Card 
        className="border-none shadow-2xl overflow-hidden"
        style={{ borderRadius: '16px' }}
      >
        <div className="bg-gradient-to-br from-[#C41C1C] to-[#8B1515] p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            <h2 className="text-white text-center sm:text-left" style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', fontWeight: 700 }}>
              Miembro de Servicio Social del Mes
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 shadow-2xl border-4 border-white flex-shrink-0">
              <AvatarImage src="" />
              <AvatarFallback 
                className="bg-white text-[#C41C1C]"
                style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700 }}
              >
                {featuredMember.initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center lg:text-left w-full">
              <h3 className="text-white" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '-0.01em' }}>
                {featuredMember.name}
              </h3>
              <p className="text-white/90 mt-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 600 }}>
                {featuredMember.role}
              </p>
              
              <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-white italic" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  "{featuredMember.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Achievements */}
            <div>
              <h4 className="text-[#1E1E1E] mb-4" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Destacados del Mes
              </h4>
              <ul className="space-y-3">
                {featuredMember.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C41C1C] mt-2" />
                    <span className="text-[#5A5A5A]" style={{ fontSize: '1rem' }}>
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Stats */}
            <div>
              <h4 className="text-[#1E1E1E] mb-4" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Estadísticas de Contribución
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-[#F5EFE6] rounded-xl">
                  <p className="text-[#5A5A5A]" style={{ fontSize: '0.875rem' }}>
                    Horas Totales
                  </p>
                  <p className="text-[#C41C1C]" style={{ fontSize: '2rem', fontWeight: 700 }}>
                    {featuredMember.hours}
                  </p>
                </div>
                
                <div className="p-4 bg-[#F5EFE6] rounded-xl">
                  <p className="text-[#5A5A5A]" style={{ fontSize: '0.875rem' }}>
                    Nivel de Reconocimiento
                  </p>
                  <p className="text-[#C41C1C]" style={{ fontSize: '2rem', fontWeight: 700 }}>
                    Oro
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button
              onClick={() => onNavigate("profile")}
              className="bg-[#C41C1C] hover:bg-[#A01515] text-white px-8 py-6"
              style={{ borderRadius: '12px', fontSize: '1rem', fontWeight: 600 }}
            >
              Ver Perfil Completo
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Winners */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardContent className="pt-6">
          <h3 className="text-[#1E1E1E] mb-6" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Ganadores Anteriores
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Alex Martínez", month: "Diciembre", initials: "AM" },
              { name: "Sofía López", month: "Noviembre", initials: "SL" },
              { name: "María Hernández", month: "Octubre", initials: "MH" },
              { name: "Carlos Ruiz", month: "Septiembre", initials: "CR" },
            ].map((winner, index) => (
              <div key={index} className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2 shadow-md">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-[#F5EFE6] text-[#C41C1C]">
                    {winner.initials}
                  </AvatarFallback>
                </Avatar>
                <p className="text-[#1E1E1E]" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {winner.name}
                </p>
                <p className="text-[#5A5A5A]" style={{ fontSize: '0.75rem' }}>
                  {winner.month}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
