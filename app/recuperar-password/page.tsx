"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RecuperarPasswordPage() {
  const router = useRouter();
  const [paso, setPaso] = useState<"email" | "codigo">("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSolicitarCodigo() {
    if (!email) {
      setError("Por favor ingresa tu correo institucional.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/recuperar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al solicitar el código");
      setExito(data.mensaje);
      setPaso("codigo");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al solicitar el código");
    } finally {
      setCargando(false);
    }
  }

  async function handleVerificarCodigo() {
    if (!codigo || !nuevaContrasena || !confirmar) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (nuevaContrasena !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/verificar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo, nueva_contrasena: nuevaContrasena }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al verificar el código");
      setExito("¡Contraseña actualizada exitosamente! Redirigiendo al login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al verificar el código");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
          <p className="text-gray-500 text-sm mt-1">
            {paso === "email"
              ? "Ingresa tu correo institucional para recibir un código"
              : "Ingresa el código que enviamos a tu correo"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {paso === "email" ? (
            <div role="form" aria-label="Solicitar código de recuperación" className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo institucional
                </label>
                <input
                  type="email"
                  placeholder="correo@universidad.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Correo institucional"
                  aria-required="true"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {error && (
                <p role="alert" aria-live="assertive" className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}
              {exito && (
                <p role="status" aria-live="polite" className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">
                  {exito}
                </p>
              )}

              <button
                onClick={handleSolicitarCodigo}
                disabled={cargando}
                className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60"
              >
                {cargando ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          ) : (
            <div role="form" aria-label="Verificar código y cambiar contraseña" className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  maxLength={6}
                  aria-label="Código de verificación de 6 dígitos"
                  aria-required="true"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-center tracking-widest font-bold text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  aria-label="Nueva contraseña"
                  aria-required="true"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  aria-label="Confirmar nueva contraseña"
                  aria-required="true"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {error && (
                <p role="alert" aria-live="assertive" className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </p>
              )}
              {exito && (
                <p role="status" aria-live="polite" className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">
                  {exito}
                </p>
              )}

              <button
                onClick={handleVerificarCodigo}
                disabled={cargando}
                className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60"
              >
                {cargando ? "Actualizando..." : "Cambiar contraseña"}
              </button>

              <button
                onClick={() => setPaso("email")}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Volver
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link href="/login" className="text-red-700 hover:underline font-medium">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}