import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Trophy } from "lucide-react";

interface ProgressRankingProps {
  isAdmin: boolean;
}

export function ProgressRanking({ isAdmin }: { isAdmin: boolean; }) {
  const [currentHours, setCurrentHours] = useState<number>(0);

  useEffect(() => {
    // Si ya tienes el email en contexto/prop, úsalo aquí.
    const email = (typeof window !== "undefined") ? localStorage.getItem("userEmail") : "";
    (async () => {
      try {
        const res = await fetch("/api/progress/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const json = await res.json();
        if (json.ok) setCurrentHours(json.serviceHours ?? 0);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const levels = [
    { name: "Cuarzo", min: 0, max: 99, color: "#94A3B8" },
    { name: "Platino", min: 100, max: 199, color: "#E5E7EB" },
    { name: "Plata", min: 200, max: 299, color: "#C0C0C0" },
    { name: "Oro", min: 300, max: 399, color: "#FFD700" },
    { name: "Tungsteno", min: 400, max: 999, color: "#3F3F46" },
  ];
  const getCurrentLevel = (hours:number)=> levels.find(l=>hours>=l.min && hours<=l.max) || levels[levels.length-1];
  const getNextLevel = (hours:number)=> { const i=levels.findIndex(l=>hours>=l.min && hours<=l.max); return i<levels.length-1?levels[i+1]:null; };

  const currentLevel = getCurrentLevel(currentHours);
  const nextLevel = getNextLevel(currentHours);
  const progressPercent = nextLevel ? ((currentHours - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;


  return (
    <div className="space-y-6">
      {/* Current Progress */}
      <Card className="border-none shadow-lg relative overflow-hidden" style={{ borderRadius: '16px' }}>
        <div 
          className="absolute top-0 left-0 w-2 h-full"
          style={{ backgroundColor: currentLevel.color }}
        />
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
            Tu Progreso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6" style={{ color: currentLevel.color }} />
                <span className="text-[#1E1E1E]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {currentLevel.name}
                </span>
              </div>
              <span className="text-[#C41C1C]" style={{ fontSize: '2rem', fontWeight: 700 }}>
                {currentHours}
              </span>
            </div>
            <p className="text-[#5A5A5A]" style={{ fontSize: '0.9rem' }}>
              Horas totales completadas
            </p>
          </div>

          {nextLevel && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#1E1E1E]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  Progreso a {nextLevel.name}
                </span>
                <span className="text-[#5A5A5A]" style={{ fontSize: '0.9rem' }}>
                  {nextLevel.min - currentHours} horas restantes
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Levels */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
            Niveles de Logro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {levels.map((level, index) => {
              const isUnlocked = currentHours >= level.min;
              const isCurrent = currentLevel.name === level.name;
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-[#C41C1C] text-white shadow-xl scale-105' 
                      : isUnlocked 
                        ? 'bg-white shadow-md' 
                        : 'bg-[#F5EFE6] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCurrent ? 'bg-white' : 'bg-[#F5EFE6]'
                        }`}
                      >
                        <Trophy 
                          className="w-6 h-6" 
                          style={{ color: isCurrent ? '#C41C1C' : level.color }} 
                        />
                      </div>
                      <div>
                        <h4 
                          className={isCurrent ? 'text-white' : 'text-[#1E1E1E]'}
                          style={{ fontSize: '1.1rem', fontWeight: 700 }}
                        >
                          {level.name}
                        </h4>
                        <p 
                          className={isCurrent ? 'text-white/80' : 'text-[#5A5A5A]'}
                          style={{ fontSize: '0.85rem' }}
                        >
                          {level.min}–{level.max} hours
                        </p>
                      </div>
                    </div>
                    {isUnlocked && (
                      <span 
                        className={isCurrent ? 'text-white' : 'text-[#C41C1C]'}
                        style={{ fontSize: '0.9rem', fontWeight: 600 }}
                      >
                        {isCurrent ? 'Nivel Actual' : 'Desbloqueado'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
