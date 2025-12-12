"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Users, Clock, TrendingUp, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Helper para POST JSON que NUNCA truene por HTML
async function postJson<T = any>(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: T | null = null;

  try {
    // Si no es JSON válido (por ejemplo HTML de error), esto lanza
    data = (await res.json()) as T;
  } catch {
    const text = await res.text().catch(() => "");
    console.error(`Respuesta no JSON de ${url}:`, text);
  }

  return { res, data };
}

function AdminDashboard() {
  const [hours, setHours] = useState("");
  const [userId, setUserId] = useState(""); // correo
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const [busy, setBusy] = useState(false);
  const [hoursResult, setHoursResult] = useState<string>("");
  // ---- Estado para horas ----
  const [targetEmail, setTargetEmail] = useState("");
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState("");


  // -------- Registrar horas de servicio --------
  const handleRegisterHours = async () => {
    if (!userId || !hours) {
      alert("Escribe el correo del usuario y las horas.");
      return;
    }

    const value = Number(hours);
    if (Number.isNaN(value)) {
      alert("Las horas deben ser un número.");
      return;
    }

    setBusy(true);
    try {
      const { res, data } = await postJson<{
        ok?: boolean;
        error?: string;
        message?: string;
      }>("/api/hours/register", {
        email: userId,
        hours: value,
      });

      if (!res.ok || !data?.ok) {
        alert(data?.error || "Error al registrar horas.");
        return;
      }

      alert(data.message || "Horas registradas correctamente.");
      setHours("");
      setUserId("");
    } catch (e) {
      console.error(e);
      alert("Error de conexión al registrar horas.");
    } finally {
      setBusy(false);
    }
  };
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
  // -------- Publicar anuncio --------
  const handlePostAnnouncement = async () => {
    if (!announcementTitle || !announcementText) {
      alert("Escribe título y mensaje del anuncio.");
      return;
    }

    setBusy(true);
    try {
      const { res, data } = await postJson<{
        ok?: boolean;
        error?: string;
      }>("/api/announcements", {
        title: announcementTitle,
        message: announcementText,
        priority: "medium",
        author: "Administrador",
      });

      if (!res.ok || !data?.ok) {
        alert(data?.error || "Error al publicar anuncio.");
        return;
      }

      alert("Anuncio publicado correctamente.");
      setAnnouncementTitle("");
      setAnnouncementText("");
    } catch (e) {
      console.error(e);
      alert("Error de conexión al publicar anuncio.");
    } finally {
      setBusy(false);
    }
  };

  // -------- Otorgar permisos de administrador --------
  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      alert("Escribe el correo del nuevo administrador.");
      return;
    }

    setBusy(true);
    try {
      const { res, data } = await postJson<{
        ok?: boolean;
        error?: string;
        user?: { name?: string | null; email: string; isAdmin: boolean };
      }>("/api/admin/grant", {
        email: newAdminEmail,
      });

      if (!data) {
        alert(
          "La respuesta del servidor no fue JSON. Revisa la consola para más detalles."
        );
        return;
      }

      if (!res.ok || !data.ok) {
        alert(data.error || "Error al otorgar permisos.");
        return;
      }

      alert(
        `Ahora ${
          data.user?.name || data.user?.email || newAdminEmail
        } es administrador.`
      );
      setNewAdminEmail("");
      setShowAddAdmin(false);
    } catch (e) {
      console.error(e);
      alert("Error de conexión al otorgar permisos.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      

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

          <button>pruebaaasss</button>
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

      {/* Publicar Anuncio */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle
            className="text-[#1E1E1E]"
            style={{ fontSize: "1.25rem" }}
          >
            Publicar Anuncio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Actualización Importante"
              className="mt-2 bg-[#F5EFE6] border-none"
            />
          </div>
          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Escribe tu anuncio aquí..."
              className="mt-2 bg-[#F5EFE6] border-none min-h-[120px]"
            />
          </div>
          <Button
            onClick={handlePostAnnouncement}
            disabled={busy}
            className="bg-[#C41C1C] hover:bg-[#A01515] text-white"
            style={{ borderRadius: "12px" }}
          >
            Publicar Anuncio
          </Button>
        </CardContent>
      </Card>

      {/* Gestionar Administradores */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle
            className="text-[#1E1E1E]"
            style={{ fontSize: "1.25rem" }}
          >
            Gestionar Administradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className="text-[#5A5A5A] mb-4"
            style={{ fontSize: "0.9rem" }}
          >
            Otorga permisos de administrador a miembros existentes del
            laboratorio.
          </p>
          <Button
            onClick={() => setShowAddAdmin(true)}
            className="bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white"
            style={{ borderRadius: "12px" }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Añadir Administrador
          </Button>
        </CardContent>
      </Card>

      {/* Diálogo para añadir admin */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent style={{ borderRadius: "16px" }}>
          <DialogHeader>
            <DialogTitle
              className="text-[#1E1E1E]"
              style={{ fontSize: "1.5rem", fontWeight: 700 }}
            >
              Otorgar Permisos de Administrador
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Correo del Miembro</Label>
              <Input
                id="adminEmail"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="usuario@lab.com"
                className="mt-2 bg-[#F5EFE6] border-none"
              />
            </div>
            <p
              className="text-[#5A5A5A]"
              style={{ fontSize: "0.875rem" }}
            >
              El miembro podrá registrar horas de servicio y publicar anuncios,
              pero mantendrá su tipo de miembro actual.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleAddAdmin}
                disabled={busy}
                className="flex-1 bg-[#C41C1C] hover:bg-[#A01515] text-white"
                style={{ borderRadius: "12px" }}
              >
                Otorgar Permisos
              </Button>
              <Button
                onClick={() => setShowAddAdmin(false)}
                className="flex-1 bg-[#E5DDD4] hover:bg-[#D5CCC4] text-[#1E1E1E]"
                style={{ borderRadius: "12px" }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
