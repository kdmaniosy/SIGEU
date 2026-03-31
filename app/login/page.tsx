"use client";
import { Link } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "registro">("login");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SIGEU</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sistema de Gestión de Espacios Universitarios
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === "login"
                  ? "bg-red-700 text-white"
                  : "bg-gray-50 text-gray-500 hover:text-gray-700"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setTab("registro")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === "registro"
                  ? "bg-red-700 text-white"
                  : "bg-gray-50 text-gray-500 hover:text-gray-700"
              }`}
            >
              Registrarse
            </button>
          </div>

          <div className="p-8">
            {tab === "login" ? <FormLogin /> : <FormRegistro />}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 Universidad. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

function FormLogin() {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo institucional
        </label>
        <input
          type="email"
          placeholder="correo@universidad.edu"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
          <input type="checkbox" className="accent-red-700" />
          Recordarme
        </label>
        <a href="#" className="text-sm text-red-700 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <Link href="/dashboard" className="block w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors text-center">
        Iniciar sesión
      </Link>
    </div>
  );
}

function FormRegistro() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido
          </label>
          <input
            type="text"
            placeholder="Tu apellido"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol
        </label>
        <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="">Selecciona tu rol</option>
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Código estudiantil / docente
        </label>
        <input
          type="text"
          placeholder="Ej: 20231234"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo institucional
        </label>
        <input
          type="email"
          placeholder="correo@universidad.edu"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="••••••••"
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
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <Link href="/dashboard" className="block w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors text-center">
        Crear cuenta
      </Link>
    </div>
  );
}
