import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Users, Clock, TrendingUp, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// ...imports iguales
export function AdminDashboard() {
  const [hours, setHours] = useState("");
  const [userId, setUserId] = useState(""); // email
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRegisterHours = async () => {
    if (!userId || !hours) return;
    setBusy(true);
    try {
      const res = await fetch("/api/hours/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userId, hours: Number(hours) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al registrar horas");
      // feedback no intrusivo
      // puedes agregar un toast si ya tienes uno
    } catch (e:any) { console.error(e); }
    finally {
      setBusy(false);
      setHours("");
      setUserId("");
    }
  };

  const handlePostAnnouncement = async () => {
    if (!announcementTitle || !announcementText) return;
    setBusy(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: announcementTitle, message: announcementText, priority: "medium", author: "Admin" }),
      });
      if (!res.ok) throw new Error("Error al publicar anuncio");
    } catch (e) { console.error(e); }
    finally {
      setBusy(false);
      setAnnouncementTitle("");
      setAnnouncementText("");
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admins/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail }),
      });
      if (!res.ok) throw new Error("Error al otorgar permisos");
      setShowAddAdmin(false);
      setNewAdminEmail("");
    } catch (e) { console.error(e); }
    finally { setBusy(false); }
  };



  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#1E1E1E]">
              <Clock className="w-5 h-5 text-[#C41C1C]" />
              <span style={{ fontSize: '1rem' }}>Horas Totales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[#C41C1C]" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              2,847
            </div>
            <p className="text-[#5A5A5A] mt-1" style={{ fontSize: '0.875rem' }}>
              Entre todos los miembros
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#1E1E1E]">
              <TrendingUp className="w-5 h-5 text-[#C41C1C]" />
              <span style={{ fontSize: '1rem' }}>Promedio Horas/Usuario</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[#C41C1C]" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              237
            </div>
            <p className="text-[#5A5A5A] mt-1" style={{ fontSize: '0.875rem' }}>
              Por miembro del equipo
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#1E1E1E]">
              <Users className="w-5 h-5 text-[#C41C1C]" />
              <span style={{ fontSize: '1rem' }}>Miembros Activos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[#C41C1C]" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              12
            </div>
            <p className="text-[#5A5A5A] mt-1" style={{ fontSize: '0.875rem' }}>
              Actualmente activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Register Service Hours */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
            Registrar Horas de Servicio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userId">Correo del Usuario</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="usuario@lab.com"
                className="mt-2 bg-[#F5EFE6] border-none"
              />
            </div>
            <div>
              <Label htmlFor="hours">Horas</Label>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="8"
                className="mt-2 bg-[#F5EFE6] border-none"
              />
            </div>
          </div>
          <Button
            onClick={handleRegisterHours}
            className="bg-[#C41C1C] hover:bg-[#A01515] text-white"
            style={{ borderRadius: '12px' }}
          >
            Registrar Horas
          </Button>
        </CardContent>
      </Card>

      {/* Post Announcement */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
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
            className="bg-[#C41C1C] hover:bg-[#A01515] text-white"
            style={{ borderRadius: '12px' }}
          >
            Publicar Anuncio
          </Button>
        </CardContent>
      </Card>

      {/* Manage Administrators */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
            Gestionar Administradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#5A5A5A] mb-4" style={{ fontSize: '0.9rem' }}>
            Otorga permisos de administrador a miembros existentes del laboratorio
          </p>
          <Button
            onClick={() => setShowAddAdmin(true)}
            className="bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white"
            style={{ borderRadius: '12px' }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Añadir Administrador
          </Button>
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent style={{ borderRadius: '16px' }}>
          <DialogHeader>
            <DialogTitle className="text-[#1E1E1E]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
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
            <p className="text-[#5A5A5A]" style={{ fontSize: '0.875rem' }}>
              El miembro podrá registrar horas de servicio y publicar anuncios, pero mantendrá su tipo de miembro actual.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleAddAdmin}
                className="flex-1 bg-[#C41C1C] hover:bg-[#A01515] text-white"
                style={{ borderRadius: '12px' }}
              >
                Otorgar Permisos
              </Button>
              <Button
                onClick={() => setShowAddAdmin(false)}
                className="flex-1 bg-[#E5DDD4] hover:bg-[#D5CCC4] text-[#1E1E1E]"
                style={{ borderRadius: '12px' }}
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
