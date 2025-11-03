import { Card, CardContent } from "./ui/card";
import { 
  Zap, Clock, Upload, Users, Award, Target, 
  Brain, TrendingUp, CheckCircle, Lock 
} from "lucide-react";

interface AchievementsProps {
  isAdmin: boolean;
}

export function Achievements({ isAdmin }: AchievementsProps) {
  const userHours = isAdmin ? 450 : 287;
  
  const achievements = [
    {
      id: 1,
      title: "Primer Día",
      description: "Completa tu primer día en el laboratorio",
      icon: CheckCircle,
      unlocked: true,
      color: "#10B981",
    },
    {
      id: 2,
      title: "Electrodo Activado",
      description: "Activa exitosamente un electrodo neural",
      icon: Zap,
      unlocked: true,
      color: "#F59E0B",
    },
    {
      id: 3,
      title: "100 Horas",
      description: "Alcanza 100 horas de servicio",
      icon: Clock,
      unlocked: userHours >= 100,
      color: "#3B82F6",
    },
    {
      id: 4,
      title: "Analista de Datos",
      description: "Sube tu primer análisis",
      icon: Upload,
      unlocked: true,
      color: "#8B5CF6",
    },
    {
      id: 5,
      title: "Jugador de Equipo",
      description: "Colabora con 5 miembros del equipo",
      icon: Users,
      unlocked: true,
      color: "#EC4899",
    },
    {
      id: 6,
      title: "200 Horas",
      description: "Alcanza 200 horas de servicio",
      icon: Target,
      unlocked: userHours >= 200,
      color: "#14B8A6",
    },
    {
      id: 7,
      title: "Experto Neural",
      description: "Completa el entrenamiento neural avanzado",
      icon: Brain,
      unlocked: userHours >= 300,
      color: "#C41C1C",
    },
    {
      id: 8,
      title: "300 Horas",
      description: "Alcanza 300 horas de servicio",
      icon: TrendingUp,
      unlocked: userHours >= 300,
      color: "#0891B2",
    },
    {
      id: 9,
      title: "400 Horas",
      description: "Alcanza 400 horas de servicio",
      icon: Award,
      unlocked: userHours >= 400,
      color: "#FFD700",
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-[#C41C1C] to-[#A01515]" style={{ borderRadius: '16px' }}>
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-white" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              {unlockedCount}/{achievements.length}
            </h2>
            <p className="text-white/90 mt-2" style={{ fontSize: '1.1rem' }}>
              Logros Desbloqueados
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          
          return (
            <Card
              key={achievement.id}
              className={`border-none shadow-lg transition-all duration-300 hover:scale-105 ${
                achievement.unlocked 
                  ? 'bg-white cursor-pointer' 
                  : 'bg-[#E5DDD4] opacity-60'
              }`}
              style={{ borderRadius: '16px' }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      achievement.unlocked ? 'shadow-lg' : ''
                    }`}
                    style={{ 
                      backgroundColor: achievement.unlocked ? achievement.color : '#A8A8A8',
                    }}
                  >
                    {achievement.unlocked ? (
                      <Icon className="w-8 h-8 text-white" />
                    ) : (
                      <Lock className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <h3 
                      className="text-[#1E1E1E]" 
                      style={{ fontSize: '1.1rem', fontWeight: 700 }}
                    >
                      {achievement.title}
                    </h3>
                    <p 
                      className="text-[#5A5A5A] mt-2" 
                      style={{ fontSize: '0.875rem' }}
                    >
                      {achievement.description}
                    </p>
                  </div>
                  
                  {achievement.unlocked && (
                    <div className="pt-2">
                      <span 
                        className="px-4 py-1 rounded-full text-white"
                        style={{ 
                          backgroundColor: achievement.color,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        Desbloqueado
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
