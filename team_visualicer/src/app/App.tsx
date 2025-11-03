import { useEffect, useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import AdminDashboard from "./components/AdminDashboard";
import { UserProfile } from "./components/UserProfile";
import { ProgressRanking } from "./components/ProgressRanking";
import Team from "./components/Team";
import CalendarView from "./components/CalendarView";
import Schedule from "./components/Schedule";
import { Announcements } from "./components/Announcements";

export type MemberType =
  | "investigador"
  | "posgrado"
  | "practicante"
  | "servicio-social"
  | null;

type PageType =
  | "profile"
  | "progress"
  | "team"
  | "calendar"
  | "schedule"
  | "announcements";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberType, setMemberType] = useState<MemberType>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState<PageType>("profile");

  const handleLogin = (admin: boolean, member: MemberType, email: string) => {
    setIsAdmin(admin);
    setMemberType(member);
    setUserEmail(email);
    setCurrentPage("profile");
  };

  // Al conocer el email, traemos nombre/flags reales desde la DB
  useEffect(() => {
    if (!userEmail) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/me?email=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (res.ok && json.ok) {
          setUserName(json.user?.name || "");
          setMemberType(json.user?.memberType ?? null);
          setIsAdmin(!!json.user?.isAdmin);
        }
      } catch {
        /* ignore */
      }
    })();
  }, [userEmail]);

  // Guard: si no es servicio social y está en "progress", lo mandamos a "profile"
  useEffect(() => {
    if (currentPage === "progress" && memberType !== "servicio-social") {
      setCurrentPage("profile");
    }
  }, [currentPage, memberType]);

  const handleLogout = () => {
    setIsAdmin(false);
    setMemberType(null);
    setUserEmail("");
    setUserName("");
    setCurrentPage("profile");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const getMemberTypeLabel = () => {
    let label = "";
    switch (memberType) {
      case "investigador":
        label = "Investigador Contratado";
        break;
      case "posgrado":
        label = "Estudiante de Posgrado";
        break;
      case "practicante":
        label = "Practicante";
        break;
      case "servicio-social":
        label = "Miembro de Servicio Social";
        break;
      default:
        label = "Miembro";
    }
    if (isAdmin) label += " (Administrador)";
    return label;
  };

  // --- Pantalla de login si no hay sesión ---
  if (!memberType) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // --- Contenido de páginas ---
  const renderPageContent = () => {
    switch (currentPage) {
      case "profile":
        // Si es admin, su "perfil" es el dashboard de administración
        return isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserProfile
            userEmail={userEmail}
            isAdmin={isAdmin}
            memberType={memberType}
          />
        );

      case "progress":
        // Esta ruta solo se alcanza si memberType === "servicio-social" (por el guard)
        return <ProgressRanking isAdmin={false} />;

      case "team":
        return <Team />;

      case "schedule":
        return (
          <Schedule
            isAdmin={isAdmin}
            memberType={memberType}
            userEmail={userEmail}
            userName={userName || userEmail}
          />
        );

      case "announcements":
        return <Announcements />;

      case "calendar":
        return <CalendarView />;

      default:
        return isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserProfile
            userEmail={userEmail}
            isAdmin={isAdmin}
            memberType={memberType}
          />
        );
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      userName={userName || userEmail}
      userEmail={userEmail}
      isAdmin={isAdmin}
      memberType={memberType}
      memberTypeLabel={getMemberTypeLabel()}
    >
      {renderPageContent()}
    </DashboardLayout>
  );
}
