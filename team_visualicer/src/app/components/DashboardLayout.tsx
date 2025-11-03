"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  User, TrendingUp, Users, Calendar, Award, Image,
  Trophy, Bell, LogOut, Menu, Clock
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent } from "./ui/sheet";
import type { MemberType } from "../App";

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  memberType: MemberType;
  memberTypeLabel: string;
}

type TvUser = {
  name: string;
  email: string;
  memberType?: MemberType | string;
  isAdmin?: boolean;
  serviceHours?: number;
};

export function DashboardLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  userName: userNameProp,
  userEmail: userEmailProp,
  isAdmin: isAdminProp,
  memberType: memberTypeProp,
  memberTypeLabel,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [me, setMe] = useState<TvUser | null>(null);

  // Cargar sesión desde localStorage si existe
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tv_user");
      if (raw) setMe(JSON.parse(raw));
    } catch {}
  }, []);

  // Efectivos: primero sesión, luego props
  const effectiveName = me?.name?.trim() || userNameProp || "Invitado";
  const effectiveEmail = me?.email || userEmailProp || "";
  const effectiveIsAdmin = typeof me?.isAdmin === "boolean" ? !!me?.isAdmin : isAdminProp;
  const effectiveMemberType =
    (me?.memberType as MemberType) || memberTypeProp;

  const initials = useMemo(() => {
    const parts = effectiveName.split(" ").filter(Boolean);
    const ini = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
    return ini.toUpperCase() || "US";
  }, [effectiveName]);

  // Mostrar Progreso/Logros solo para servicio social o admin
  const showServiceHours =
    effectiveIsAdmin || effectiveMemberType === "servicio-social";

  const allMenuItems = [
    { id: "profile", label: "Perfil", icon: User, show: true },
    { id: "progress", label: "Progreso", icon: TrendingUp, show: showServiceHours },
    { id: "team", label: "Equipo", icon: Users, show: true },
    { id: "schedule", label: "Horario", icon: Clock, show: true },
    { id: "calendar", label: "Calendario", icon: Calendar, show: true },
    { id: "member-of-month", label: "Miembro del Mes", icon: Trophy, show: true },
    { id: "gallery", label: "Galería", icon: Image, show: true },
    { id: "achievements", label: "Logros", icon: Award, show: showServiceHours },
    { id: "announcements", label: "Anuncios", icon: Bell, show: true },
  ];

  const menuItems = allMenuItems.filter((item) => item.show);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#A01515]">
        <h2
          className="text-white"
          style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Team Visualizer
        </h2>
        <p className="text-white/70 mt-1" style={{ fontSize: "0.875rem" }}>
          {memberTypeLabel}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#C41C1C] shadow-lg"
                  : "text-white hover:bg-[#A01515]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span
                style={{ fontSize: "0.9rem", fontWeight: isActive ? 600 : 400 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#A01515]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[#A01515] transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span style={{ fontSize: "0.9rem" }}>Cerrar sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5EFE6] lg:flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-[#C41C1C] shadow-2xl flex-col z-20">
        <SidebarContent />
      </div>

      {/* Sidebar Mobile */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-64 bg-[#C41C1C] p-0 border-none flex flex-col"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Botón menú móvil */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-[#F5EFE6] rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-[#1E1E1E]" />
              </button>

              <h1
                className="text-[#1E1E1E] truncate"
                style={{
                  fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {menuItems.find((item) => item.id === currentPage)?.label || "Panel"}
              </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden sm:block text-right">
                <p
                  className="text-[#1E1E1E] truncate max-w-[180px]"
                  style={{ fontSize: "0.9rem", fontWeight: 600 }}
                >
                  {effectiveName}
                </p>
                <p
                  className="text-[#5A5A5A] truncate max-w-[180px]"
                  style={{ fontSize: "0.8rem" }}
                >
                  {effectiveEmail}
                </p>
              </div>
              <Avatar className="w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback
                  className="bg-[#C41C1C] text-white"
                  style={{ fontSize: "0.875rem" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Contenido de página */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
