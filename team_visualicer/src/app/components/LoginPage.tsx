"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RegisterPage } from "./RegisterPage";
import { ForgotPassword } from "./ForgotPassword";
import { VerifyCode } from "./VerifyCode";
import { ChangePassword } from "./ChangePassword";
import type { MemberType } from "../App";

interface LoginPageProps {
  onLogin: (
    isAdmin: boolean,
    memberType: MemberType,
    email: string,
    name?: string
  ) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPage, setCurrentPage] = useState<"login" | "forgot-password" | "verify-code" | "change-password">("login");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Credenciales inválidas");
      }

      // data.user viene de la ruta /api/auth/login
      onLogin(
        Boolean(data.user?.isAdmin),
        data.user?.memberType as MemberType,
        data.user?.email,
        data.user?.name
      );
    } catch (err: any) {
      alert(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    alert("¡Registro completado! Ya puedes iniciar sesión.");
  };

  if (showRegister) {
    return (
      <RegisterPage
        onBack={() => setShowRegister(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  // Navegación del flujo de recuperación (opcional)
  if (currentPage === "forgot-password") {
    return (
      <ForgotPassword
        onBack={() => setCurrentPage("login")}
        onNext={() => setCurrentPage("verify-code")}
      />
    );
  }
  if (currentPage === "verify-code") {
    return (
      <VerifyCode
        onBack={() => setCurrentPage("login")}
        onNext={() => setCurrentPage("change-password")}
      />
    );
  }
  if (currentPage === "change-password") {
    return <ChangePassword onBack={() => setCurrentPage("login")} />;
  }

  // Pantalla de Login
  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1
            className="text-[#1E1E1E] mb-3"
            style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            Lab BL-205
          </h1>
          <p className="text-[#5A5A5A]">Accede con tu cuenta del laboratorio</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="space-y-6">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-[#F5EFE6] border-none"
                placeholder="tu.correo@lab.com"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-[#F5EFE6] border-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 bg-[#C41C1C] hover:bg-[#A01515] text-white transition-all duration-300 disabled:opacity-70"
              style={{ borderRadius: "12px" }}
            >
              {loading ? "Verificando..." : "Iniciar sesión"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E5DDD4]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[#5A5A5A]">¿No tienes cuenta?</span>
              </div>
            </div>

            <Button
              onClick={() => setShowRegister(true)}
              className="w-full h-12 bg-white hover:bg-[#F5EFE6] text-[#1E1E1E] border-2 border-[#1E1E1E] transition-all duration-300"
              style={{ borderRadius: "12px" }}
            >
              Registrarse como miembro
            </Button>

            <div className="mt-4 text-center">
              <Button
                onClick={() => setCurrentPage("forgot-password")}
                className="text-[#1E1E1E] hover:text-[#C41C1C] text-xs"
                variant="ghost"
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

