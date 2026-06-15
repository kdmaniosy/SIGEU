"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  code: string;
  name1: string;
  name2?: string;
  last_name1: string;
  last_name2?: string;
  email: string;
  cellphone?: string;
  usertype_id: string;
}

export default function ConfiguracionPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ name1: "", name2: "", last_name1: "", last_name2: "", cellphone: "" });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (!montado) return;
    const token = localStorage.getItem("token");
    const usuarioRaw = localStorage.getItem("usuario");
    if (!token || !usuarioRaw) { router.push("/login"); return; }
    const u: Usuario = JSON.parse(usuarioRaw);
    setUsuario(u);
    setForm({
      name1: u.name1 ?? "",
      name2: u.name2 ?? "",
      last_name1: u.last_name1 ?? "",
      last_name2: u.last_name2 ?? "",
      cellphone: u.cellphone ?? "",
    });
  }, [montado]);

  async function handleGuardar() {
    if (!usuario) return;
    const token = localStorage.getItem("token");
    setGuardando(true);
    setMensaje("");
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/usuarios/${usuario.code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...usuario, ...form }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Error al guardar.");
        return;
      }
      const actualizado = await res.json();
      localStorage.setItem("usuario", JSON.stringify(actualizado));
      setUsuario(actualizado);
      setMensaje("Perfil actualizado correctamente.");
    } catch {
      setError("Error de conexion.");
    } finally {
      setGuardando(false);
    }
  }

  if (!montado) return null;
  if (!usuario) return null;

  const campos = [
    { key: "name1",      label: "Primer nombre",    required: true },
    { key: "name2",      label: "Segundo nombre",   required: false },
    { key: "last_name1", label: "Primer apellido",  required: true },
    { key: "last_name2", label: "Segundo apellido", required: false },
    { key: "cellphone",  label: "Celular",          required: false },
  ] as const;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Configuracion</h1>
      <p className="text-gray-500 text-sm mb-6">Actualiza tu informacion personal.</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex gap-6 text-sm text-gray-600">
        <div><span className="font-semibold">Codigo:</span> {usuario.code}</div>
        <div><span className="font-semibold">Email:</span> {usuario.email}</div>
        <div><span className="font-semibold">Rol:</span> {usuario.usertype_id}</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        {campos.map(({ key, label, required }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
              type="text"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
        ))}

        {mensaje && <p className="text-green-600 text-sm font-medium">{mensaje}</p>}
        {error   && <p className="text-red-600  text-sm font-medium">{error}</p>}

        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="mt-2 px-5 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
