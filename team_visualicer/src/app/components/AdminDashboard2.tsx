"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Clock, Megaphone, ShieldPlus } from "lucide-react";

type AnnPrio = "low" | "medium" | "high";

export default function AdminDashboard() {
  // ---- Estado para horas ----
  const [targetEmail, setTargetEmail] = useState("");
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [hoursResult, setHoursResult] = useState<string>("");

  // ---- Estado para anuncio ----
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<AnnPrio>("low");
  const [postResult, setPostResult] = useState<string>("");
  // ----- Nuevo: agregar administrador -----
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminResult, setAdminResult] = useState<string | null>(null);
  const [busyAdmin, setBusyAdmin] = useState(false);

const handleAdjustHours = async () => {
  setHoursResult("");
  if (!targetEmail || !Number.isFinite(delta)) {
    setHoursResult("Completa email y horas.");
    return;
  }
  try {
    const res = await fetch("/api/admin/hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail.trim(), delta: Number(delta), reason: reason.trim() || undefined }),
    });
    const json = await res.json();
    if (!res.ok || !json?.ok) {
      setHoursResult(json?.error || "Error al ajustar horas.");
      return;
    }
    setHoursResult(`OK: ${json.user.name} ahora tiene ${json.user.serviceHours} horas.`);
    setDelta(0);
    setReason("");
  } catch (e: any) {
    setHoursResult(e?.message || "INTERNAL.");
  }
};



  const handlePublish = async () => {
    setPostResult("");
    if (!title.trim() || !message.trim()) {
      setPostResult("Escribe título y mensaje.");
      return;
    }
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), message: message.trim(), priority }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setPostResult(json?.error || "Error al publicar el anuncio.");
        return;
      }
      setPostResult("Anuncio publicado.");
      setTitle("");
      setMessage("");
      setPriority("low");
    } catch {
      setPostResult("INTERNAL.");
    }
  };
  const handleGrantAdmin = async () => {
    if (!newAdminEmail.trim()) {
      setAdminResult("Escribe el correo del miembro.");
      return;
    }

    setBusyAdmin(true);
    setAdminResult(null);

    try {
      const res = await fetch("/api/admins/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setAdminResult(json.error || "No se pudo otorgar permisos.");
      } else {
        const name =
          json.user?.name || json.user?.email || newAdminEmail.trim();
        setAdminResult(`Ahora ${name} es administrador.`);
        setNewAdminEmail("");
      }
    } catch (err) {
      console.error(err);
      setAdminResult("Error de conexión al agregar administrador.");
    } finally {
      setBusyAdmin(false);
    }
  };


  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* BLOQUE: Ajustar horas */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: "1.25rem" }}>
            Ajustar horas de Servicio Social
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Correo del miembro</Label>
            <Input
              id="email"
              type="email"
              placeholder="miembro@lab.com"
              className="mt-2 bg-[#F5EFE6] border-none"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="delta">Horas a ajustar (usa negativo para restar)</Label>
            <Input
              id="delta"
              type="number"
              className="mt-2 bg-[#F5EFE6] border-none"
              value={String(delta)}
              onChange={(e) => setDelta(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Input
              id="reason"
              className="mt-2 bg-[#F5EFE6] border-none"
              placeholder="p.ej. guardia extra del sábado"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button
            onClick={handleAdjustHours}
            className="h-12 bg-[#C41C1C] hover:bg-[#A01515] text-white transition-all duration-300"
            style={{ borderRadius: "12px" }}
          >
            Guardar ajuste
          </Button>

          {hoursResult && (
            <p className="text-sm" style={{ color: hoursResult.startsWith("OK") ? "#166534" : "#7f1d1d" }}>
              {hoursResult}
            </p>
          )}
        </CardContent>
      </Card>

      {/* BLOQUE: Publicar anuncio */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: "1.25rem" }}>
            Publicar anuncio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              className="mt-2 bg-[#F5EFE6] border-none"
              placeholder="Mantenimiento del laboratorio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              className="mt-2 bg-[#F5EFE6] border-none min-h-[120px]"
              placeholder="Detalle del anuncio para todo el equipo…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div>
            <Label>Prioridad</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as AnnPrio)}>
              <SelectTrigger className="mt-2 bg-[#F5EFE6] border-none">
                <SelectValue placeholder="Selecciona prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handlePublish}
            className="h-12 bg-[#C41C1C] hover:bg-[#A01515] text-white transition-all duration-300"
            style={{ borderRadius: "12px" }}
          >
            Publicar
          </Button>

          {postResult && (
            <p className="text-sm" style={{ color: postResult.startsWith("Anuncio") ? "#166534" : "#7f1d1d" }}>
              {postResult}
            </p>
          )}
        </CardContent>
      </Card>
{/* NUEVA tarjeta: Agregar administrador */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle
            className="text-[#1E1E1E]"
            style={{ fontSize: "1.25rem" }}
          >
            Agregar nuevo administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#5A5A5A]" style={{ fontSize: "0.9rem" }}>
            Escribe el correo de un miembro ya registrado para otorgarle
            permisos de administrador.
          </p>

          <div>
            <Label htmlFor="newAdminEmail">Correo del miembro</Label>
            <Input
              id="newAdminEmail"
              type="email"
              placeholder="usuario@lab.com"
              className="mt-2 bg-[#F5EFE6] border-none"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGrantAdmin}
            disabled={busyAdmin}
            className="bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white"
            style={{ borderRadius: "12px" }}
          >
            <ShieldPlus className="w-4 h-4 mr-2" />
            {busyAdmin ? "Procesando..." : "Agregar administrador"}
          </Button>

          {adminResult && (
            <p
              className="text-sm"
              style={{
                color: adminResult.startsWith("Ahora") ? "#166534" : "#7f1d1d",
              }}
            >
              {adminResult}
            </p>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
