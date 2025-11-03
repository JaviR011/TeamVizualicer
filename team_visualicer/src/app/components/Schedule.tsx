import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";

type MemberType = "investigador" | "posgrado" | "practicante" | "servicio-social" | null;

interface ScheduleEntry {
  id: string;
  memberName: string;
  memberEmail: string;
  day: string;       // "Lunes" | ...
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

interface ScheduleProps {
  isAdmin: boolean;
  memberType: MemberType;
  userEmail: string;
  userName: string;
}

function Schedule({ isAdmin, memberType, userEmail, userName }: ScheduleProps) {
  const days = useMemo(() => ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sáb/Dom"], []);
  const timeSlots = useMemo(
    () => ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"],
    []
  );

  // ---- Estado UI (idéntico al original) ----
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [newEntry, setNewEntry] = useState({ memberName: "", day: "", startTime: "", endTime: "" });

  // ---- Miembros de servicio social para el combo del admin ----
  const [serviceSocialMembers, setServiceSocialMembers] = useState<{ id: string; name: string }[]>([]);

  // ---------------------------------------------
  // Cargar miembros (para admins) y horarios (todos)
  // ---------------------------------------------
  useEffect(() => {
    (async () => {
      // miembros de servicio social (si existe endpoint; si falla, fallback al usuario actual)
      if (isAdmin) {
        try {
          const r = await fetch("/api/users?role=servicio-social", { cache: "no-store" });
          const j = await r.json();
          if (r.ok && j?.users?.length) {
            setServiceSocialMembers(
              j.users.map((u: any) => ({ id: u.email as string, name: (u.name || u.email) as string }))
            );
          } else {
            setServiceSocialMembers([{ id: userEmail, name: userName || userEmail }]);
          }
        } catch {
          setServiceSocialMembers([{ id: userEmail, name: userName || userEmail }]);
        }
      }
    })();
  }, [isAdmin, userEmail, userName]);

  useEffect(() => {
    void loadEntries();
  }, []); // cargar una vez

  const loadEntries = async () => {
    try {
      const r = await fetch("/api/lab-schedule", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error("No se pudieron obtener horarios");

      const mapped: ScheduleEntry[] = (j.data || []).map((e: any) => ({
        id: e.id,
        memberName: e.memberName || e.userName || e.member || "",
        memberEmail: e.memberEmail || e.userEmail || "",
        day: e.day,
        startTime: e.start,
        endTime: e.end,
      }));
      setScheduleEntries(mapped);
    } catch (err) {
      console.error("[schedule] GET error", err);
      // si falla, dejamos vacío (UI igual)
      setScheduleEntries([]);
    }
  };

  // ---------------------------------------------
  // Helpers UI (idénticos a tu versión)
  // ---------------------------------------------
  const canModifyEntry = (entry: ScheduleEntry) => isAdmin || entry.memberEmail === userEmail;
  const canAddSchedule = isAdmin || memberType === "servicio-social";
  const getEntriesForDay = (day: string) => scheduleEntries.filter((e) => e.day === day);

  // ---------------------------------------------
  // CRUD -> API /api/lab-schedule
  // ---------------------------------------------
  const handleAddEntry = async () => {
    if (!newEntry.day || !newEntry.startTime || !newEntry.endTime) {
      alert("Por favor completa todos los campos");
      return;
    }

    let payload: any = {
      day: newEntry.day,
      start: newEntry.startTime,
      end: newEntry.endTime,
      createdBy: userEmail,
    };

    if (isAdmin) {
      if (!newEntry.memberName) {
        alert("Por favor selecciona un miembro");
        return;
      }
      const sel = serviceSocialMembers.find((m) => m.name === newEntry.memberName);
      if (!sel) {
        alert("Miembro inválido");
        return;
      }
      payload.userEmail = sel.id;
      payload.userName = sel.name;
    } else {
      payload.userEmail = userEmail;
      payload.userName = userName || userEmail;
    }

    try {
      const r = await fetch("/api/lab-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "No se pudo guardar");
      await loadEntries();
      setNewEntry({ memberName: "", day: "", startTime: "", endTime: "" });
      setShowAddDialog(false);
    } catch (err: any) {
      console.error("[schedule] POST error", err);
      alert("No se pudo guardar el horario.");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este horario?")) return;
    try {
      const r = await fetch(`/api/lab-schedule?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "No se pudo eliminar");
      await loadEntries();
    } catch (err) {
      console.error("[schedule] DELETE error", err);
      alert("No se pudo eliminar el horario.");
    }
  };

  const handleEditEntry = (entry: ScheduleEntry) => setEditingEntry(entry);

  const handleSaveEdit = async () => {
    if (!editingEntry) return;
    try {
      const r = await fetch("/api/lab-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingEntry.id,
          start: editingEntry.startTime,
          end: editingEntry.endTime,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "No se pudo actualizar");
      setEditingEntry(null);
      await loadEntries();
    } catch (err) {
      console.error("[schedule] PUT error", err);
      alert("No se pudo actualizar el horario.");
    }
  };

  const handleCancelEdit = () => setEditingEntry(null);

  // ---------------------------------------------
  // UI (el mismo que tenías)
  // ---------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[#1E1E1E]" style={{ fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Horario Semanal
          </h2>
          <p className="text-[#5A5A5A] mt-1" style={{ fontSize: "0.95rem" }}>
            {isAdmin
              ? "Horarios de los miembros de servicio social en el laboratorio"
              : memberType === "servicio-social"
              ? "Administra tus horarios en el laboratorio"
              : "Horarios de los miembros de servicio social en el laboratorio"}
          </p>
        </div>

        {canAddSchedule && (
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#C41C1C] hover:bg-[#A01515] text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            style={{ borderRadius: "12px", padding: "0.625rem 1.25rem" }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAdmin ? "Agregar Horario" : "Agregar Mi Horario"}
          </Button>
        )}
      </div>

      {/* Weekly Schedule Table */}
      <Card className="border-none shadow-lg overflow-hidden" style={{ borderRadius: "16px" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border border-[#1E1E1E]/10 bg-white p-4 text-[#1E1E1E] text-center"
                      style={{ fontSize: "1rem", fontWeight: 500, minWidth: "150px" }}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map((day) => {
                    const dayEntries = getEntriesForDay(day);

                    return (
                      <td
                        key={day}
                        className="border border-[#1E1E1E]/10 p-4 bg-white align-top"
                        style={{ minHeight: "400px", verticalAlign: "top" }}
                      >
                        <div className="space-y-3">
                          {dayEntries.length === 0 ? (
                            <div className="flex items-start justify-center text-[#5A5A5A]/50 pt-8" style={{ fontSize: "0.875rem" }}>
                              <p>-</p>
                            </div>
                          ) : (
                            dayEntries.map((entry) => (
                              <div key={entry.id} className="bg-[#F5EFE6] p-3 rounded-lg border border-[#C41C1C]/20">
                                {editingEntry?.id === entry.id ? (
                                  <div className="space-y-2">
                                    {isAdmin && (
                                      <p className="text-[#1E1E1E] text-sm" style={{ fontWeight: 600 }}>
                                        {editingEntry.memberName}
                                      </p>
                                    )}
                                    {!isAdmin && (
                                      <p className="text-[#1E1E1E] text-sm" style={{ fontWeight: 600 }}>
                                        {editingEntry.memberName}
                                      </p>
                                    )}

                                    <div className="flex gap-2">
                                      <Input
                                        type="time"
                                        value={editingEntry.startTime}
                                        onChange={(e) => setEditingEntry({ ...editingEntry, startTime: e.target.value })}
                                        className="text-sm"
                                      />
                                      <Input
                                        type="time"
                                        value={editingEntry.endTime}
                                        onChange={(e) => setEditingEntry({ ...editingEntry, endTime: e.target.value })}
                                        className="text-sm"
                                      />
                                    </div>

                                    <div className="flex gap-2">
                                      <Button onClick={handleSaveEdit} className="flex-1 bg-[#C41C1C] hover:bg-[#A01515] text-white" size="sm">
                                        <Save className="w-3 h-3 mr-1" />
                                        Guardar
                                      </Button>
                                      <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                                        <X className="w-3 h-3 mr-1" />
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[#1E1E1E]" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                                          {entry.memberName}
                                        </p>
                                        <p className="text-[#C41C1C] mt-1" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                                          {entry.startTime} - {entry.endTime}
                                        </p>
                                      </div>

                                      {canModifyEntry(entry) && (
                                        <div className="flex gap-1">
                                          <button
                                            onClick={() => handleEditEntry(entry)}
                                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                                            title="Editar"
                                          >
                                            <Edit2 className="w-3.5 h-3.5 text-[#C41C1C]" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteEntry(entry.id)}
                                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                                            title="Eliminar"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-[#C41C1C]" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Entry Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md" style={{ borderRadius: "16px" }}>
          <DialogHeader>
            <DialogTitle className="text-[#1E1E1E]" style={{ fontSize: "1.25rem" }}>
              Agregar Horario
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="member" className="text-[#1E1E1E]">
                  Miembro
                </Label>
                <Select value={newEntry.memberName} onValueChange={(value) => setNewEntry({ ...newEntry, memberName: value })}>
                  <SelectTrigger id="member">
                    <SelectValue placeholder="Selecciona un miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceSocialMembers.map((m) => (
                      <SelectItem key={m.id} value={m.name}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="day" className="text-[#1E1E1E]">
                Día
              </Label>
              <Select value={newEntry.day} onValueChange={(value) => setNewEntry({ ...newEntry, day: value })}>
                <SelectTrigger id="day">
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-[#1E1E1E]">
                  Hora inicio
                </Label>
                <Select value={newEntry.startTime} onValueChange={(value) => setNewEntry({ ...newEntry, startTime: value })}>
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-[#1E1E1E]">
                  Hora fin
                </Label>
                <Select value={newEntry.endTime} onValueChange={(value) => setNewEntry({ ...newEntry, endTime: value })}>
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="Fin" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowAddDialog(false)} variant="outline" className="flex-1" style={{ borderRadius: "12px" }}>
              Cancelar
            </Button>
            <Button onClick={handleAddEntry} className="flex-1 bg-[#C41C1C] hover:bg-[#A01515] text-white" style={{ borderRadius: "12px" }}>
              Agregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legend */}
      <Card className="border-none shadow-lg" style={{ borderRadius: "16px" }}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Clock className="w-5 h-5 text-[#C41C1C] flex-shrink-0" />
            <div>
              <p className="text-[#1E1E1E]" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                Nota importante
              </p>
              <p className="text-[#5A5A5A] mt-1" style={{ fontSize: "0.85rem" }}>
                {isAdmin
                  ? "Los horarios mostrados corresponden a los miembros de servicio social del laboratorio. Como administrador, puedes agregar, editar o eliminar cualquier horario."
                  : memberType === "servicio-social"
                  ? "Puedes agregar, editar y eliminar tus propios horarios de asistencia al laboratorio. Los administradores podrán ver tu disponibilidad."
                  : "Los horarios mostrados corresponden a los miembros de servicio social del laboratorio."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Schedule;
export { Schedule };
