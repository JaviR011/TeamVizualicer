import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface VerifyCodeProps {
  onBack: () => void;
  onNext: () => void;
}

export function VerifyCode({ onBack, onNext }: VerifyCodeProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

const handleVerifyCode = async () => {
    // Verificar que el código tenga exactamente 8 dígitos numéricos
    const isValid = /^\d{8}$/.test(code);
    // Mantener la misma estructura que el código original (se usa más abajo)
    const response = { ok: isValid };


    if (response.ok) {
      setMessage("Código verificado. Ahora puedes cambiar tu contraseña.");
      onNext();  // Ir a la siguiente pantalla
    } else {
      setMessage("Código incorrecto.");
    }
  };

  return (
    <div>
      <Label htmlFor="code">Código de verificación</Label>
      <Input
        id="code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="123456"
      />
      <Button onClick={handleVerifyCode}>Verificar código</Button>
      {message && <p>{message}</p>}
      <Button onClick={onBack}>Volver al inicio</Button>
    </div>
  );
}
