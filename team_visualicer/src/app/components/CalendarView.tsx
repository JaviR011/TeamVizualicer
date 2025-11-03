"use client";
import { useEffect, useState } from "react";

type EventDoc = {
  _id: string;
  title: string;
  date: string;   // ISO
  allDay?: boolean;
};

export default function CalendarView() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/events", { cache: "no-store" });
        const j = await r.json();
        if (!r.ok || !j.ok) throw new Error(j.error || "Error");
        setEvents(j.data || []);
      } catch (e:any) {
        setErr(e.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-sm text-gray-600">Cargando calendario…</p>;
  if (err) return <p className="text-sm text-red-600">Error: {err}</p>;

  return (
    <div className="space-y-3">
      {events.length === 0 && <p className="text-sm text-gray-600">No hay eventos próximos.</p>}
      {events.map(ev => (
        <div key={ev._id} className="bg-white rounded-xl p-4 shadow border">
          <div className="font-semibold">{ev.title}</div>
          <div className="text-sm text-gray-600">
            {new Date(ev.date).toLocaleString("es-MX", {
              day: "2-digit", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit"
            })}
            {ev.allDay ? " (todo el día)" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
