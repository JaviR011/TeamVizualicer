"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Bell, CalendarDays, User as UserIcon } from "lucide-react";

type Priority = "low" | "medium" | "high";

interface Announcement {
  id: string;
  title: string;
  message: string;
  author: string;
  priority: Priority;
  date: string; // ISO
}

interface AnnouncementsProps {
  isAdmin: boolean;
}

export function Announcements({ isAdmin }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/announcements", { cache: "no-store" });
        const json = await res.json();
        if (res.ok && json.ok) {
          setAnnouncements(json.data ?? []);
        } else {
          console.error("Error al cargar anuncios:", json.error);
        }
      } catch (e) {
        console.error("Error de red al cargar anuncios:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar este anuncio?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        alert("No se pudo eliminar el anuncio.");
        console.error("Error al eliminar anuncio:", json.error);
        return;
      }

      // Quitar de la lista local
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Error de red al eliminar anuncio:", e);
      alert("Ocurrió un error al eliminar el anuncio.");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityLabel = (p: Priority) => {
    switch (p) {
      case "low":
        return "LOW";
      case "high":
        return "HIGH";
      default:
        return "MEDIUM";
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#C41C1C";
      case "medium": return "#F59E0B";
      default: return "#10B981";
    }
  };
  
  const getPriorityClasses = (p: Priority) => {
    switch (p) {
      case "low":
        return "bg-[#E5F9E7] text-[#15803D]";
      case "high":
        return "bg-[#FEE2E2] text-[#B91C1C]";
      default:
        return "bg-[#FFEFD5] text-[#D97706]";
    }
  };

  return (
    <div className="space-y-6">
      <Card
        className="border-none shadow-none bg-transparent"
        style={{ boxShadow: "none" }}
      >
        <CardHeader className="text-center">
          <CardTitle
            className="text-[#C41C1C]"
            style={{ fontSize: "1.8rem", fontWeight: 700 }}
          >
            Anuncios del Laboratorio
          </CardTitle>
          <p className="text-[#5A5A5A]" style={{ fontSize: "0.95rem" }}>
            Mantente actualizado con las últimas noticias y actualizaciones
          </p>
        </CardHeader>
      </Card>

      {loading ? (
        <p className="text-[#5A5A5A]" style={{ fontSize: "0.9rem" }}>
          Cargando anuncios...
        </p>
      ) : announcements.length === 0 ? (
        <p className="text-[#5A5A5A]" style={{ fontSize: "0.9rem" }}>
          No hay anuncios publicados por el momento.
        </p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card
              key={a.id}
              className="border-none shadow-lg mb-2"
              style={{ borderRadius: "16px" }}
            >
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[#C41C1C]" />
                    </div>
                    <h3
                      className="text-[#1E1E1E]"
                      style={{ fontSize: "1.1rem", fontWeight: 700 }}
                    >
                      {a.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getPriorityClasses(
                        a.priority
                      )}`}
                      style={{ background: getPriorityColor(a.priority) ,color: "white"}}
                    >
                      {getPriorityLabel(a.priority)}
                      
                    </span>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-xs px-3 py-1 rounded-full border border-[#C41C1C] text-[#C41C1C] hover:bg-[#C41C1C] hover:text-white transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>

                <p
                  className="text-[#5A5A5A]"
                  style={{ fontSize: "0.9rem" }}
                >
                  {a.message}
                </p>

                <div
                  className="flex flex-wrap items-center gap-4 text-[#5A5A5A]"
                  style={{ fontSize: "0.8rem" }}
                >
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {a.author || "Administrador"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {formatDate(a.date)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
