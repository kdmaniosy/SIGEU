"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Detalle {
  space_id: string;
  building_id: string;
  status: string;
}

interface Reserva {
  reservation_number: string;
  date: string;
  detalles: Detalle[];
}

export default function EstadisticasPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
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
      .then((r) => r.json())
      .then(setReservas);
  }, [montado]);

  const totalDetalles = reservas.flatMap((r) => r.detalles);
  const activos    = totalDetalles.filter((d) => d.status === "A").length;
  const cancelados = totalDetalles.filter((d) => d.status === "C").length;
  const pendientes = totalDetalles.filter((d) => d.status === "P").length;

  const frecuencia: Record<string, number> = {};
  totalDetalles.forEach((d) => {
    const key = `${d.space_id} / ${d.building_id}`;
    frecuencia[key] = (frecuencia[key] ?? 0) + 1;
  });
  const espaciosOrdenados = Object.entries(frecuencia).sort((a, b) => b[1] - a[1]);

  const stats = [
    { label: "Total reservas",   value: reservas.length, color: "bg-blue-50 text-blue-700",   icon: "📅" },
    { label: "Detalles activos", value: activos,          color: "bg-green-50 text-green-700", icon: "✅" },
    { label: "Pendientes",       value: pendientes,       color: "bg-yellow-50 text-yellow-700", icon: "⏳" },
    { label: "Cancelados",       value: cancelados,       color: "bg-red-50 text-red-700",     icon: "❌" },
  ];

  if (!montado) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Estadisticas</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Espacios mas reservados</h2>
        {espaciosOrdenados.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Sin datos suficientes.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {espaciosOrdenados.slice(0, 5).map(([espacio, count]) => {
              const porcentaje = Math.round((count / totalDetalles.length) * 100);
              return (
                <div key={espacio}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{espacio}</span>
                    <span className="text-gray-500">{count} vez{count > 1 ? "ces" : ""}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-700 h-2 rounded-full transition-all"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
