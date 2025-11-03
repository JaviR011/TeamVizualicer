import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Bell, Calendar, User } from "lucide-react";

type Ann = { id:string; title:string; message:string; author:string; date:string; priority:"low"|"medium"|"high" };

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/announcements");
        const json = await res.json();
        if (json.ok) setAnnouncements(json.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#C41C1C";
      case "medium": return "#F59E0B";
      default: return "#10B981";
    }
  };

  if (loading) return <div className="text-center">Cargando…</div>;

  // ...render igual que el tuyo, pero usando 'announcements' del estado
  // (pego tu mismo JSX y reemplazo el map)
  return (
    <div className="space-y-6">
      <div className="text-center px-4">
        <h2 className="text-[#C41C1C]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '-0.01em' }}>
          Anuncios del Laboratorio
        </h2>
        <p className="text-[#5A5A5A] mt-2" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          Mantente actualizado con las últimas noticias y actualizaciones
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderRadius: '16px' }}>
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: getPriorityColor(announcement.priority) }} />
            <CardContent className="pt-6 pl-6 sm:pl-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: getPriorityColor(announcement.priority) }}>
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                    <h3 className="text-[#1E1E1E] break-words" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 700 }}>{announcement.title}</h3>
                    <span className="px-3 py-1 rounded-full text-white flex-shrink-0 self-start" style={{ backgroundColor: getPriorityColor(announcement.priority), fontSize: '0.7rem', fontWeight: 600 }}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[#5A5A5A] mb-4 break-words" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', lineHeight: '1.6' }}>{announcement.message}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-[#5A5A5A]">
                    <div className="flex items-center gap-2"><User className="w-4 h-4 flex-shrink-0" /><span className="truncate" style={{ fontSize: '0.875rem' }}>{announcement.author}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 flex-shrink-0" /><span style={{ fontSize: '0.875rem' }}>{announcement.date}</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && <div className="text-center text-[#5A5A5A]">Aún no hay anuncios.</div>}
      </div>
    </div>
  );
}
