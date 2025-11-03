import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ChangePasswordProps {
  onBack: () => void;
}


export function ChangePassword({ onBack }: ChangePasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); // añade un input o pásalo por props, según tu flujo

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return setMessage("Las contraseñas no coinciden.");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setMessage("Contraseña cambiada correctamente.");
    } catch (e:any) {
      setMessage(e.message || "Error al cambiar la contraseña.");
    }
  };

  return (
    <div>
      <Label htmlFor="email">Correo</Label>
      <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@lab.com" />
      <Label htmlFor="newPassword">Nueva contraseña</Label>
      <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contraseña" />
      <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar contraseña" />
      <Button onClick={handleChangePassword}>Cambiar contraseña</Button>
      {message && <p>{message}</p>}
      <Button onClick={onBack}>Volver al inicio</Button>
    </div>
  );
}
