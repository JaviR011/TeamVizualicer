import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TeamMember {
  id: string|number;
  name: string;
  role: string;
  type: string;
  description: string;
  initials: string;
  serviceHours?: number;
}

export function Team() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/team");
        const json = await res.json();
        if (json.ok) setTeamMembers(json.data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-[#C41C1C]" style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Conoce al Equipo</h2>
        <p className="text-[#5A5A5A] mt-2" style={{ fontSize: '1.1rem' }}>Mentes brillantes trabajando juntas para avanzar la neurociencia</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {teamMembers.map((member, idx) => {
          const isHovered = hoveredMember === idx;
          return (
            <Card key={String(member.id)} onMouseEnter={() => setHoveredMember(idx)} onMouseLeave={() => setHoveredMember(null)} className="border-none shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden" style={{ borderRadius: '16px' }}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-24 h-24 shadow-lg transition-all duration-300" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}>
                    <AvatarImage src="" />
                    <AvatarFallback className="text-white" style={{ backgroundColor: '#C41C1C', fontSize: '1.5rem', fontWeight: 700 }}>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-[#1E1E1E]" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{member.name}</h3>
                    <p className="text-[#C41C1C] mt-1" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{member.role}</p>
                    <p className="text-[#5A5A5A] mt-1" style={{ fontSize: '0.8rem' }}>{member.type}</p>
                  </div>
                  <div className="transition-all duration-300 overflow-hidden" style={{ maxHeight: isHovered ? '200px' : '0', opacity: isHovered ? 1 : 0 }}>
                    {member.description && <p className="text-[#5A5A5A] px-2 mb-3" style={{ fontSize: '0.875rem' }}>{member.description}</p>}
                    {member.serviceHours !== undefined && (
                      <div className="px-2">
                        <div className="inline-block bg-[#C41C1C] text-white px-3 py-1 rounded-full">
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{member.serviceHours} horas de servicio</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {teamMembers.length === 0 && <div className="text-center text-[#5A5A5A] col-span-full">Aún no hay miembros registrados.</div>}
      </div>
    </div>
  );
}

export default Team;
