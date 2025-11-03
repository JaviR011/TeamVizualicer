import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { MemberType } from "../App"; // o usa el string-union local si lo prefieres

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterPage({ onBack, onRegisterSuccess }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [career, setCareer] = useState("");
  const [memberType, setMemberType] = useState<MemberType | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getMemberTypeLabel = (t: string) =>
    t === "investigador" ? "Investigador Contratado"
    : t === "posgrado" ? "Estudiante de Posgrado"
    : t === "practicante" ? "Practicante"
    : t === "servicio-social" ? "Miembro de Servicio Social"
    : "";

  const handleRegister = async () => {
    if (!name || !career || !memberType || !email || !password || !confirmPassword) {
      alert("Por favor completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          career,
          memberType,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Error al registrar");
        return;
      }

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      onRegisterSuccess();
    } catch (e) {
      console.error(e);
      alert("No se pudo registrar (red/conexión).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-[#1E1E1E] mb-3" style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Registro de Miembro
          </h1>
          <p className="text-[#5A5A5A]">Únete al Team Visualizer Lab</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)}
                     className="mt-2 bg-[#F5EFE6] border-none" placeholder="Tu nombre completo" />
            </div>

            <div>
              <Label htmlFor="career">Carrera</Label>
              <Input id="career" value={career} onChange={(e) => setCareer(e.target.value)}
                     className="mt-2 bg-[#F5EFE6] border-none" placeholder="Tu carrera o especialización" />
            </div>

            <div>
              <Label htmlFor="memberType">Tipo de Miembro</Label>
              <Select value={memberType ?? ""} onValueChange={(v) => setMemberType(v as MemberType)}>
                <SelectTrigger className="mt-2 bg-[#F5EFE6] border-none">
                  <SelectValue placeholder="Selecciona tu tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investigador">{getMemberTypeLabel("investigador")}</SelectItem>
                  <SelectItem value="posgrado">{getMemberTypeLabel("posgrado")}</SelectItem>
                  <SelectItem value="practicante">{getMemberTypeLabel("practicante")}</SelectItem>
                  <SelectItem value="servicio-social">{getMemberTypeLabel("servicio-social")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                     className="mt-2 bg-[#F5EFE6] border-none" placeholder="tu.correo@lab.com" />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                     className="mt-2 bg-[#F5EFE6] border-none" placeholder="••••••••" />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="mt-2 bg-[#F5EFE6] border-none" placeholder="••••••••" />
            </div>

            <Button onClick={handleRegister} disabled={loading}
              className="w-full h-12 bg-[#C41C1C] hover:bg-[#A01515] text-white transition-all duration-300"
              style={{ borderRadius: '12px' }}>
              {loading ? "Guardando..." : "Registrarse"}
            </Button>

            <button onClick={onBack} className="w-full text-[#5A5A5A] hover:text-[#1E1E1E] transition-colors">
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
