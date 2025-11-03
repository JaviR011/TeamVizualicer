import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 13)); // January 13, 2025

  const events = [
    {
      id: 1,
      title: "Mantenimiento del Laboratorio",
      date: "2025-01-13",
      time: "Todo el día",
      type: "maintenance",
    },
    {
      id: 2,
      title: "Reunión de Equipo",
      date: "2025-01-16",
      time: "2:00 PM - 3:30 PM",
      type: "meeting",
    },
    {
      id: 3,
      title: "Capacitación de Equipo",
      date: "2025-01-17",
      time: "10:00 AM - 12:00 PM",
      type: "training",
    },
    {
      id: 4,
      title: "Sesión de Análisis de Datos",
      date: "2025-01-18",
      time: "9:00 AM - 11:00 AM",
      type: "work",
    },
    {
      id: 5,
      title: "Presentación de Investigación",
      date: "2025-01-20",
      time: "3:00 PM - 5:00 PM",
      type: "presentation",
    },
    {
      id: 6,
      title: "Reunión de Equipo",
      date: "2025-01-23",
      time: "2:00 PM - 3:30 PM",
      type: "meeting",
    },
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "#C41C1C";
      case "meeting":
        return "#3B82F6";
      case "training":
        return "#10B981";
      case "presentation":
        return "#F59E0B";
      default:
        return "#8B5CF6";
    }
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={goToPreviousMonth}
                variant="outline"
                size="icon"
                className="rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={goToNextMonth}
                variant="outline"
                size="icon"
                className="rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div
                key={day}
                className="text-center text-[#5A5A5A] py-2"
                style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)', fontWeight: 600 }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const today = isToday(day);

              return (
                <div
                  key={day}
                  className={`aspect-square p-1 sm:p-2 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    today
                      ? "bg-[#C41C1C] text-white border-[#C41C1C]"
                      : "bg-white border-gray-200 hover:border-[#C41C1C]"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`${today ? "text-white" : "text-[#1E1E1E]"}`}
                      style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)', fontWeight: 600 }}
                    >
                      {day}
                    </span>
                    <div className="flex-1 mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="w-full h-0.5 sm:h-1 rounded"
                          style={{ backgroundColor: getEventTypeColor(event.type) }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-none shadow-lg" style={{ borderRadius: '16px' }}>
        <CardHeader>
          <CardTitle className="text-[#1E1E1E]" style={{ fontSize: '1.25rem' }}>
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F5EFE6] rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: getEventTypeColor(event.type) }}
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[#1E1E1E] break-words" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', fontWeight: 600 }}>
                    {event.title}
                  </h4>
                  <p className="text-[#5A5A5A] mt-1 break-words" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-[#5A5A5A]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                    {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
