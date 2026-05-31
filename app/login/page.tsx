"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api";

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleLogin() {
    if (!email || !contrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const data = await authService.login(email, contrasena);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo institucional
        </label>
        <input
          type="email"
          placeholder="correo@universidad.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
          <input type="checkbox" className="accent-red-700" />
          Recordarme
        </label>
        <a href="#" className="text-sm text-red-700 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <button
        onClick={handleLogin}
        disabled={cargando}
        className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60"
      >
        {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </div>
  );
}

function FormRegistro() {
  const router = useRouter();
  const [form, setForm] = useState({
    Code: "",
    name1: "",
    name2: "",
    last_name1: "",
    last_name2: "",
    Email: "",
    Cellphone: "",
    USERTYPE_ID: "",
    contrasena: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegistro() {
    if (!form.Code || !form.name1 || !form.last_name1 || !form.Email || !form.contrasena || !form.USERTYPE_ID) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (form.contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      await authService.registro({
      code: form.Code,
      name1: form.name1,
      name2: form.name2 || undefined,
      last_name1: form.last_name1,
      last_name2: form.last_name2 || undefined,
      email: form.Email,
      cellphone: form.Cellphone || undefined,
      usertype_id: form.USERTYPE_ID,
      contrasena: form.contrasena,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primer nombre *</label>
          <input name="name1" type="text" placeholder="Nombre" value={form.name1} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Segundo nombre</label>
          <input name="name2" type="text" placeholder="Opcional" value={form.name2} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primer apellido *</label>
          <input name="last_name1" type="text" placeholder="Apellido" value={form.last_name1} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Segundo apellido</label>
          <input name="last_name2" type="text" placeholder="Opcional" value={form.last_name2} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Código estudiantil / docente *</label>
        <input name="Code" type="text" placeholder="Ej: 20231234" value={form.Code} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
        <select name="USERTYPE_ID" value={form.USERTYPE_ID} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="">Selecciona tu rol</option>
          <option value="ES">Estudiante</option>
          <option value="DO">Docente</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Correo institucional *</label>
        <input name="Email" type="email" placeholder="correo@universidad.edu" value={form.Email} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
        <input name="Cellphone" type="text" placeholder="Opcional" value={form.Cellphone} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
        <input name="contrasena" type="password" placeholder="••••••••" value={form.contrasena} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña *</label>
        <input name="confirmar" type="password" placeholder="••••••••" value={form.confirmar} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>
      {error && (
        <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}
      <button
        onClick={handleRegistro}
        disabled={cargando}
        className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60"
      >
        {cargando ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </div>
  );
}