"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Clock, UserPlus, Database } from "lucide-react";

// Helper genérico para POST JSON (reutilizado)
async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    console.error(`Respuesta no JSON de ${url}:`, text);
  }

  if (!res.ok || data?.ok === false) {
    throw new Error(
      data?.error || `Error en petición a ${url} (status ${res.status})`
    );
  }

  return { res, data };
}

export default function AdminDashboard() {
  // --- Ajuste de horas ---
  const [memberEmail, setMemberEmail] = useState("");
  const [adjustHours, setAdjustHours] = useState("0");
  const [hoursReason, setHoursReason] = useState("");
  const [hoursResult, setHoursResult] = useState<string | null>(null);

  // --- Anuncios ---
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementResult, setAnnouncementResult] = useState<string | null>(
    null
  );

  // --- Nuevos admins ---
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminResult, setAdminResult] = useState<string | null>(null);

  // --- Backups ---
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [backupResult, setBackupResult] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);

  // ----- Handlers -----

  // Registrar / ajustar horas de servicio
  const handleAdjustHours = async () => {
    setHoursResult(null);
    if (!memberEmail || !adjustHours) {
      setHoursResult("Falta correo o cantidad de horas.");
      return;
    }

    setBusy(true);
    try {
      const { data } = await postJson("/api/hours/register", {
        email: memberEmail,
        hours: Number(adjustHours),
        motive: hoursReason || undefined,
      });

      const newTotal = data?.newTotal ?? data?.serviceHours;
      setHoursResult(
        `OK: ${memberEmail} ahora tiene ${newTotal ?? "?"} horas.`
      );
      setMemberEmail("");
      setAdjustHours("0");
      setHoursReason("");
    } catch (err: any) {
      console.error(err);
      setHoursResult(err.message || "Error al ajustar horas.");
    } finally {
      setBusy(false);
    }
  };

  // Publicar anuncio
  const handlePostAnnouncement = async () => {
    setAnnouncementResult(null);
    if (!announcementTitle || !announcementText) {
      setAnnouncementResult("Título y mensaje son obligatorios.");
      return;
    }

    setBusy(true);
    try {
      await postJson("/api/announcements", {
        title: announcementTitle,
        message: announcementText,
        priority: "medium",
        author: "Administrador",
      });
      setAnnouncementResult("Anuncio publicado correctamente.");
      setAnnouncementTitle("");
      setAnnouncementText("");
    } catch (err: any) {
      console.error(err);
      setAnnouncementResult(err.message || "Error al publicar anuncio.");
    } finally {
      setBusy(false);
    }
  };

  // Otorgar permisos de administrador
  const handleAddAdmin = async () => {
    setAdminResult(null);
    if (!newAdminEmail) {
      setAdminResult("Ingresa un correo válido.");
      return;
    }

    setBusy(true);
    try {
      const { data } = await postJson("/api/admin/grant", {
        email: newAdminEmail,
      });

      setAdminResult(
        `OK: ${data?.user?.email ?? newAdminEmail} ahora es administrador.`
      );
      setShowAddAdmin(false);
      setNewAdminEmail("");
    } catch (err: any) {
      console.error(err);
      setAdminResult(err.message || "Error al otorgar permisos.");
    } finally {
      setBusy(false);
    }
  };

  // Descargar backup (.db)
  const handleDownloadBackup = () => {
    // Abrimos directamente el endpoint que devuelve el archivo
    window.open("/api/db/backup", "_blank");
  };

  // Restaurar backup desde archivo seleccionado
  const handleRestoreBackup = async () => {
    setBackupResult(null);

    if (!backupFile) {
      setBackupResult("Selecciona primero un archivo .db.");
      return;
    }

    setBusy(true);
    try{
      const formData = new FormData();
// Debe coincidir con la key que lee el backend: "backup"
formData.append("backup", backupFile);


      const res = await fetch("/api/db/backup", {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Error al restaurar la base de datos.");
      }

      setBackupResult(
        "Base de datos restaurada correctamente. Recarga la página para usarla."
      );
    } catch (err: any) {
      console.error(err);
      setBackupResult(
        err.message || "Error al restaurar la base de datos desde el archivo."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ajustar horas de Servicio Social */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: "1.25rem" }}>
            Ajustar horas de Servicio Social
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="memberEmail">Correo del miembro</Label>
              <Input
                id="memberEmail"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="miembro@lab.com"
                className="mt-2 bg-[#F5EFE6] border-none"
              />
            </div>
            <div>
              <Label htmlFor="hoursAdjust">
                Horas a ajustar (usa negativo para restar)
              </Label>
              <Input
                id="hoursAdjust"
                type="number"
                value={adjustHours}
                onChange={(e) => setAdjustHours(e.target.value)}
                placeholder="1"
                className="mt-2 bg-[#F5EFE6] border-none"
              />
            </div>
            <div>
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Input
                id="reason"
                value={hoursReason}
                onChange={(e) => setHoursReason(e.target.value)}
                placeholder="p.ej. guardia extra del sábado"
                className="mt-2 bg-[#F5EFE6] border-none"
              />
            </div>
          </div>

          <Button
            onClick={handleAdjustHours}
            disabled={busy}
            className="bg-[#C41C1C] hover:bg-[#A01515] text-white"
            style={{ borderRadius: "12px" }}
          >
            <Clock className="w-4 h-4 mr-2" />
            Guardar ajuste
          </Button>

          {hoursResult && (
            <p
              className="text-sm"
              style={{
                color: hoursResult.startsWith("OK") ? "#166534" : "#7f1d1d",
              }}
            >
              {hoursResult}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Publicar anuncio */}
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
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Mantenimiento del laboratorio"
              className="mt-2 bg-[#F5EFE6] border-none"
            />
          </div>
          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Detalle del anuncio para todo el equipo..."
              className="mt-2 bg-[#F5EFE6] border-none min-h-[120px]"
            />
          </div>
          <Button
            onClick={handlePostAnnouncement}
            disabled={busy}
            className="bg-[#C41C1C] hover:bg-[#A01515] text-white"
            style={{ borderRadius: "12px" }}
          >
            Publicar anuncio
          </Button>

          {announcementResult && (
            <p
              className="text-sm"
              style={{
                color: announcementResult.startsWith("Anuncio")
                  ? "#166534"
                  : "#7f1d1d",
              }}
            >
              {announcementResult}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Gestionar Administradores */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: "1.25rem" }}>
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
            disabled={busy}
            className="bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white"
            style={{ borderRadius: "12px" }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Añadir administrador
          </Button>

          {adminResult && (
            <p
              className="text-sm mt-3"
              style={{
                color: adminResult.startsWith("OK") ? "#166534" : "#7f1d1d",
              }}
            >
              {adminResult}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog para añadir admin */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent style={{ borderRadius: "16px" }}>
          <DialogHeader>
            <DialogTitle
              className="text-[#1E1E1E]"
              style={{ fontSize: "1.5rem", fontWeight: 700 }}
            >
              Otorgar permisos de administrador
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Correo del miembro</Label>
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
                Otorgar permisos
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

      {/* Backups de Base de Datos */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: "1.25rem" }}>
            Respaldos de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#5A5A5A]" style={{ fontSize: "0.9rem" }}>
            Descarga una copia de la base actual o restaura desde un archivo
            .db que hayas guardado antes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              type="button"
              onClick={handleDownloadBackup}
              disabled={busy}
              className="bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white"
              style={{ borderRadius: "12px" }}
            >
              <Database className="w-4 h-4 mr-2" />
              Descargar copia (.db)
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupFile">Restaurar desde archivo .db</Label>
            <Input
              id="backupFile"
              type="file"
              accept=".db"
              onChange={(e) =>
                setBackupFile(e.target.files?.[0] ?? null)
              }
              className="bg-[#F5EFE6] border-none"
            />
            <Button
              type="button"
              onClick={handleRestoreBackup}
              disabled={busy || !backupFile}
              className="mt-2 bg-[#C41C1C] hover:bg-[#A01515] text-white"
              style={{ borderRadius: "12px" }}
            >
              Restaurar copia
            </Button>
          </div>

          {backupResult && (
            <p
              className="text-sm mt-2"
              style={{
                color: backupResult.startsWith("Base de datos restaurada")
                  ? "#166534"
                  : "#7f1d1d",
              }}
            >
              {backupResult}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
