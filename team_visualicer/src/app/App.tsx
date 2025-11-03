import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { AdminDashboard } from "./components/AdminDashboard";
import { UserProfile } from "./components/UserProfile";
import { ProgressRanking } from "./components/ProgressRanking";
import { Achievements } from "./components/Achievements";
import { Team } from "./components/Team";
import { MemberOfTheMonth } from "./components/MemberOfTheMonth";
import { Gallery } from "./components/Gallery";
import { Announcements } from "./components/Announcements";
import { CalendarView } from "./components/CalendarView";
import { Schedule } from "./components/Schedule";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyCode } from "./components/VerifyCode";
import { ChangePassword } from "./components/ChangePassword";


export type MemberType = "investigador" | "posgrado" | "practicante" | "servicio-social" | null;
type PageType = "profile" | "progress" | "team" | "calendar" | "schedule" | "member-of-month" | "gallery" | "achievements" | "announcements";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberType, setMemberType] = useState<MemberType>(null);
  const [userEmail, setUserEmail] = useState("");
  const [currentPage, setCurrentPage] = useState<PageType>("profile");

  const handleLogin = (admin: boolean, member: MemberType, email: string) => {
    setIsAdmin(admin);
    setMemberType(member);
    setUserEmail(email);
    setCurrentPage("profile");
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setMemberType(null);
    setUserEmail("");
    setCurrentPage("profile");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const getUserName = () => {
    // Mock - en producción vendría del backend
    if (isAdmin && memberType === "investigador") {
      return "Dra. Sarah Johnson";
    }
    return "Alex Martínez";
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
    
    if (isAdmin) {
      label += " (Administrador)";
    }
    
    return label;
  };

  // Not logged in - show login page
  if (!memberType) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Logged in - show dashboard
  const renderPageContent = () => {
    switch (currentPage) {
      case "profile":
        return isAdmin ? (
          <AdminDashboard />
        ) : (
          <UserProfile isAdmin={false} memberType={memberType} />
        );
      case "progress":
        return <ProgressRanking isAdmin={isAdmin} />;
      case "achievements":
        return <Achievements isAdmin={isAdmin} />;
      case "team":
        return <Team />;
      case "schedule":
        return <Schedule isAdmin={isAdmin} memberType={memberType} userEmail={userEmail} userName={getUserName()} />;
      case "member-of-month":
        return <MemberOfTheMonth onNavigate={handleNavigate} />;
      case "gallery":
        return <Gallery />;
      case "announcements":
        return <Announcements />;
      case "calendar":
        return <CalendarView />;
      default:
        return <UserProfile isAdmin={false} memberType={memberType} />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      userName={getUserName()}
      userEmail={userEmail}
      isAdmin={isAdmin}
      memberType={memberType}
      memberTypeLabel={getMemberTypeLabel()}
    >
      {renderPageContent()}
    </DashboardLayout>
  );
}
