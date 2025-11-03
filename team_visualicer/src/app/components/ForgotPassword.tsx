import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ForgotPasswordProps {
  onBack: () => void;
  onNext: () => void;
}

export function ForgotPassword({ onBack, onNext }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitEmail = async () => {
    // Lógica para verificar si el correo existe en la base de datos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = email.trim();
    if (!trimmed) {
      setMessage("Ingrese un correo electrónico.");
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setMessage("Formato de correo electrónico inválido.");
      return;
    }
    const response = { ok: true };

    if (response.ok) {
      setMessage("Código de verificación enviado.");
      onNext();  // Ir a la siguiente pantalla
    } else {
      setMessage("Error al enviar el código.");
    }
  };

  return (
    <div>
      <Label htmlFor="email">Correo electrónico</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu.correo@lab.com"
      />
      <Button onClick={handleSubmitEmail}>Enviar código</Button>
      {message && <p>{message}</p>}
      <Button onClick={onBack}>Volver al inicio</Button>
    </div>
  );
}
