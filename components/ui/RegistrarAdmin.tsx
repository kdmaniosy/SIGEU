"use client";
import { useState } from "react";

interface Props {
  adminCode: string;
}

export default function RegistrarAdmin({ adminCode }: Props) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name1: "",
    name2: "",
    last_name1: "",
    last_name2: "",
    email: "",
    cellphone: "",
    contrasena: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegistrar() {
    if (!form.code || !form.name1 || !form.last_name1 || !form.email || !form.contrasena) {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/registrar-admin?admin_code=${adminCode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: form.code,
            name1: form.name1,
            name2: form.name2 || undefined,
            last_name1: form.last_name1,
            last_name2: form.last_name2 || undefined,
            email: form.email,
            cellphone: form.cellphone || undefined,
            usertype_id: "AD",
            contrasena: form.contrasena,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error al registrar administrador");
      }
      setExito(true);
      setForm({ code: "", name1: "", name2: "", last_name1: "", last_name2: "", email: "", cellphone: "", contrasena: "", confirmar: "" });
      setTimeout(() => { setExito(false); setVisible(false); }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Registrar Administrador</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Solo los administradores pueden crear otras cuentas admin.
          </p>
        </div>
        <button
          onClick={() => setVisible(!visible)}
          className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors"
        >
          {visible ? "Cancelar" : "+ Nuevo admin"}
        </button>
      </div>

      {visible && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primer nombre *</label>
              <input name="name1" type="text" placeholder="Nombre" value={form.name1} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segundo nombre</label>
              <input name="name2" type="text" placeholder="Opcional" value={form.name2} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primer apellido *</label>
              <input name="last_name1" type="text" placeholder="Apellido" value={form.last_name1} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segundo apellido</label>
              <input name="last_name2" type="text" placeholder="Opcional" value={form.last_name2} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input name="code" type="text" placeholder="Ej: 192294" value={form.code} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
              <input name="cellphone" type="text" placeholder="Opcional" value={form.cellphone} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional *</label>
            <input name="email" type="email" placeholder="correo@universidad.edu" value={form.email} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
              <input name="contrasena" type="password" placeholder="••••••••" value={form.contrasena} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
              <input name="confirmar" type="password" placeholder="••••••••" value={form.confirmar} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}
          {exito && (
            <p className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg font-medium">
              ✅ Administrador registrado exitosamente.
            </p>
          )}

          <button
            onClick={handleRegistrar}
            disabled={cargando}
            className="w-full bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60"
          >
            {cargando ? "Registrando..." : "Registrar administrador"}
          </button>
        </div>
      )}
    </div>
  );
}