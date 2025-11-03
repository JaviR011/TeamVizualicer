import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ScheduleEntry {
  id: string;
  memberName: string;
  memberId: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface ScheduleProps {
  isAdmin: boolean;
  memberType: "investigador" | "posgrado" | "practicante" | "servicio-social" | null;
  userEmail: string;
  userName: string;
}

export function Schedule({ isAdmin, memberType, userEmail, userName }: ScheduleProps) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sáb/Dom"];
  
  // Mock data para miembros de servicio social
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([
    { id: "1", memberName: "Alex Martínez", memberId: "alex@lab.com", day: "Lunes", startTime: "09:00", endTime: "13:00" },
    { id: "2", memberName: "Alex Martínez", memberId: "alex@lab.com", day: "Miércoles", startTime: "09:00", endTime: "13:00" },
    { id: "3", memberName: "Carlos Ramírez", memberId: "carlos@lab.com", day: "Lunes", startTime: "14:00", endTime: "18:00" },
    { id: "4", memberName: "Carlos Ramírez", memberId: "carlos@lab.com", day: "Jueves", startTime: "14:00", endTime: "18:00" },
    { id: "5", memberName: "María González", memberId: "maria@lab.com", day: "Martes", startTime: "10:00", endTime: "14:00" },
    { id: "6", memberName: "María González", memberId: "maria@lab.com", day: "Viernes", startTime: "10:00", endTime: "14:00" },
    { id: "7", memberName: "Juan López", memberId: "juan@lab.com", day: "Miércoles", startTime: "15:00", endTime: "19:00" },
    { id: "8", memberName: "Juan López", memberId: "juan@lab.com", day: "Sáb/Dom", startTime: "09:00", endTime: "13:00" },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    memberName: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  // Mock data de miembros de servicio social
  const serviceSocialMembers = [
    { id: "alex@lab.com", name: "Alex Martínez" },
    { id: "carlos@lab.com", name: "Carlos Ramírez" },
    { id: "maria@lab.com", name: "María González" },
    { id: "juan@lab.com", name: "Juan López" },
    { id: "ana@lab.com", name: "Ana Torres" },
  ];

  // Check if user can edit/delete an entry
  const canModifyEntry = (entry: ScheduleEntry) => {
    return isAdmin || entry.memberId === userEmail;
  };

  // Check if user can add schedules
  const canAddSchedule = isAdmin || memberType === "servicio-social";

  const timeSlots = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00", "21:00"
  ];

  const getEntriesForDay = (day: string) => {
    return scheduleEntries.filter(entry => entry.day === day);
  };

  const handleAddEntry = () => {
    if (!newEntry.day || !newEntry.startTime || !newEntry.endTime) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Si no es admin, usar el nombre y email del usuario actual
    let entryMemberName = newEntry.memberName;
    let entryMemberId = "";

    if (!isAdmin) {
      entryMemberName = userName;
      entryMemberId = userEmail;
    } else {
      if (!newEntry.memberName) {
        alert("Por favor selecciona un miembro");
        return;
      }
      const selectedMember = serviceSocialMembers.find(m => m.name === newEntry.memberName);
      if (!selectedMember) return;
      entryMemberId = selectedMember.id;
    }

    const entry: ScheduleEntry = {
      id: Date.now().toString(),
      memberName: entryMemberName,
      memberId: entryMemberId,
      day: newEntry.day,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
    };

    setScheduleEntries([...scheduleEntries, entry]);
    setNewEntry({ memberName: "", day: "", startTime: "", endTime: "" });
    setShowAddDialog(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este horario?")) {
      setScheduleEntries(scheduleEntries.filter(entry => entry.id !== id));
    }
  };

  const handleEditEntry = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = () => {
    if (!editingEntry) return;
    
    setScheduleEntries(scheduleEntries.map(entry => 
      entry.id === editingEntry.id ? editingEntry : entry
    ));
    setEditingEntry(null);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[#1E1E1E]" style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Horario Semanal
          </h2>
          <p className="text-[#5A5A5A] mt-1" style={{ fontSize: '0.95rem' }}>
            {isAdmin 
              ? "Horarios de los miembros de servicio social en el laboratorio"
              : memberType === "servicio-social"
              ? "Administra tus horarios en el laboratorio"
              : "Horarios de los miembros de servicio social en el laboratorio"
            }
          </p>
        </div>
        
        {canAddSchedule && (
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#C41C1C] hover:bg-[#A01515] text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            style={{ borderRadius: '12px', padding: '0.625rem 1.25rem' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAdmin ? "Agregar Horario" : "Agregar Mi Horario"}
          </Button>
        )}
      </div>

      {/* Weekly Schedule Table */}
      <Card className="border-none shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {days.map(day => (
                    <th 
                      key={day} 
                      className="border border-[#1E1E1E]/10 bg-white p-4 text-[#1E1E1E] text-center"
                      style={{ fontSize: '1rem', fontWeight: 500, minWidth: '150px' }}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map(day => {
                    const dayEntries = getEntriesForDay(day);
                    
                    return (
                      <td 
                        key={day} 
                        className="border border-[#1E1E1E]/10 p-4 bg-white align-top"
                        style={{ minHeight: '400px', verticalAlign: 'top' }}
                      >
                        <div className="space-y-3">
                          {dayEntries.length === 0 ? (
                            <div className="flex items-start justify-center text-[#5A5A5A]/50 pt-8" style={{ fontSize: '0.875rem' }}>
                              <p>-</p>
                            </div>
                          ) : (
                            dayEntries.map(entry => (
                              <div
                                key={entry.id}
                                className="bg-[#F5EFE6] p-3 rounded-lg border border-[#C41C1C]/20"
                              >
                                {editingEntry?.id === entry.id ? (
                                  <div className="space-y-2">
                                    {isAdmin && (
                                      <Input
                                        value={editingEntry.memberName}
                                        onChange={(e) => setEditingEntry({ ...editingEntry, memberName: e.target.value })}
                                        className="text-sm"
                                        placeholder="Nombre"
                                      />
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
                                      <Button
                                        onClick={handleSaveEdit}
                                        className="flex-1 bg-[#C41C1C] hover:bg-[#A01515] text-white"
                                        size="sm"
                                      >
                                        <Save className="w-3 h-3 mr-1" />
                                        Guardar
                                      </Button>
                                      <Button
                                        onClick={handleCancelEdit}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                      >
                                        <X className="w-3 h-3 mr-1" />
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[#1E1E1E]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                          {entry.memberName}
                                        </p>
                                        <p className="text-[#C41C1C] mt-1" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
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
        <DialogContent className="sm:max-w-md" style={{ borderRadius: '16px' }}>
          <DialogHeader>
            <DialogTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
              Agregar Horario
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="member" className="text-[#1E1E1E]">Miembro</Label>
                <Select
                  value={newEntry.memberName}
                  onValueChange={(value) => setNewEntry({ ...newEntry, memberName: value })}
                >
                  <SelectTrigger id="member">
                    <SelectValue placeholder="Selecciona un miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceSocialMembers.map(member => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="day" className="text-[#1E1E1E]">Día</Label>
              <Select
                value={newEntry.day}
                onValueChange={(value) => setNewEntry({ ...newEntry, day: value })}
              >
                <SelectTrigger id="day">
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-[#1E1E1E]">Hora inicio</Label>
                <Select
                  value={newEntry.startTime}
                  onValueChange={(value) => setNewEntry({ ...newEntry, startTime: value })}
                >
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-[#1E1E1E]">Hora fin</Label>
                <Select
                  value={newEntry.endTime}
                  onValueChange={(value) => setNewEntry({ ...newEntry, endTime: value })}
                >
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="Fin" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowAddDialog(false)}
              variant="outline"
              className="flex-1"
              style={{ borderRadius: '12px' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddEntry}
              className="flex-1 bg-[#C41C1C] hover:bg-[#A01515] text-white"
              style={{ borderRadius: '12px' }}
            >
              Agregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legend */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Clock className="w-5 h-5 text-[#C41C1C] flex-shrink-0" />
            <div>
              <p className="text-[#1E1E1E]" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Nota importante
              </p>
              <p className="text-[#5A5A5A] mt-1" style={{ fontSize: '0.85rem' }}>
                {isAdmin 
                  ? "Los horarios mostrados corresponden a los miembros de servicio social del laboratorio. Como administrador, puedes agregar, editar o eliminar cualquier horario."
                  : memberType === "servicio-social"
                  ? "Puedes agregar, editar y eliminar tus propios horarios de asistencia al laboratorio. Los administradores podrán ver tu disponibilidad."
                  : "Los horarios mostrados corresponden a los miembros de servicio social del laboratorio."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
