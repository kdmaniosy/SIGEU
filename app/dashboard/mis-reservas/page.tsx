"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Detalle {
  line_number: number;
  space_id: string;
  building_id: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface Reserva {
  reservation_number: string;
  date: string;
  code: string;
  detalles: Detalle[];
}

const STATUS_LABEL: Record<string, string> = { A: "Activo", C: "Cancelado", P: "Pendiente" };
const STATUS_COLOR: Record<string, string> = {
  A: "bg-green-100 text-green-700",
  C: "bg-red-100 text-red-700",
  P: "bg-yellow-100 text-yellow-700",
};

export default function MisReservasPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [error, setError] = useState("");
  const [cancelando, setCancelando] = useState<string | null>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (!montado) return;
    const token = localStorage.getItem("token");
    const usuarioRaw = localStorage.getItem("usuario");
    if (!token || !usuarioRaw) { router.push("/login"); return; }
    const usuario = JSON.parse(usuarioRaw);

    fetch(`http://localhost:8000/reservas/?code=${usuario.code}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setReservas)
      .catch(() => setError("No se pudieron cargar las reservas."));
  }, [montado]);

  async function cancelarReserva(reservation_number: string) {
    const token = localStorage.getItem("token");
    setCancelando(reservation_number);
    try {
      const res = await fetch(`http://localhost:8000/reservas/${reservation_number}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Error al cancelar");
        return;
      }
      setReservas((prev) =>
        prev.map((r) =>
          r.reservation_number === reservation_number
            ? { ...r, detalles: r.detalles.map((d) => ({ ...d, status: "C" })) }
            : r
        )
      );
    } catch {
      alert("Error de conexion.");
    } finally {
      setCancelando(null);
    }
  }

  const tieneActivos = (r: Reserva) => r.detalles.some((d) => d.status !== "C");

  if (!montado) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis reservas</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {reservas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-lg font-medium">No tienes reservas aun</p>
          <button
            onClick={() => router.push("/reservas")}
            className="mt-4 px-5 py-2 bg-red-700 text-white rounded-lg text-sm hover:bg-red-800 transition"
          >
            Reservar un espacio
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reservas.map((r) => (
            <div key={r.reservation_number} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Reserva</span>
                  <h2 className="text-lg font-bold text-gray-800">#{r.reservation_number}</h2>
                  <p className="text-sm text-gray-500">Fecha: {r.date}</p>
                </div>
                {tieneActivos(r) && (
                  <button
                    onClick={() => cancelarReserva(r.reservation_number)}
                    disabled={cancelando === r.reservation_number}
                    className="px-4 py-2 bg-red-700 text-white text-sm rounded-lg hover:bg-red-800 transition disabled:opacity-50"
                  >
                    {cancelando === r.reservation_number ? "Cancelando..." : "Cancelar reserva"}
                  </button>
                )}
              </div>
              {r.detalles.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin detalles registrados.</p>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {r.detalles.map((d) => (
                    <div key={d.line_number} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                      <span className="text-gray-700 font-medium">Espacio {d.space_id} — Edificio {d.building_id}</span>
                      <span className="text-gray-500">{d.start_time} a {d.end_time}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[d.status]}`}>
                        {STATUS_LABEL[d.status] ?? d.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
