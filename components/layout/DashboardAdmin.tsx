"use client";
import { useState, useEffect } from "react";
import { reservasService, usuariosService, espaciosService } from "@/lib/api";
import AforoWidget from "@/components/ui/AforoWidget";
import RegistrarAdmin from "@/components/ui/RegistrarAdmin";

interface Props {
  usuario: { code: string; name1: string; usertype_id: string };
}


const estadoLabel: Record<string, string> = {
  P: "Pendiente",
  A: "Confirmada",
  C: "Cancelada",
};

const estadoColor: Record<string, string> = {
  P: "bg-yellow-100 text-yellow-700",
  A: "bg-green-100 text-green-700",
  C: "bg-red-100 text-red-700",
};

export default function DashboardAdmin({ usuario }: Props) {
  const [reservas, setReservas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [espacios, setEspacios] = useState<any[]>([]);
  const [paginaUsuarios, setPaginaUsuarios] = useState(0);
  const USUARIOS_POR_PAGINA = 10;

  useEffect(() => {
    cargarDatos();
  }, []);

async function cargarDatos() {
  setCargando(true);
  try {
    const [r, u, e] = await Promise.allSettled([
      reservasService.obtenerTodas(),
      usuariosService.obtenerTodos(),
      espaciosService.obtenerTodos(),
    ]);
    setReservas(r.status === "fulfilled" ? r.value : []);
    setUsuarios(u.status === "fulfilled" ? u.value : []);
    setEspacios(e.status === "fulfilled" ? e.value : []);
  } catch {
    setReservas([]);
    setUsuarios([]);
    setEspacios([]);
  } finally {
    setCargando(false);
  }
}

  async function handleCancelar(reservation_number: string) {
    if (!confirm("¿Cancelar esta reserva?")) return;
    try {
      await reservasService.cancelar(reservation_number, "");
      await cargarDatos();
    } catch (err) {
      console.error(err);
    }
  }

  const reservasActivas = reservas.filter((r: any) => r.detalles?.[0]?.status !== "C");
  const rolLabel: Record<string, string> = { ES: "Estudiante", DO: "Docente", AD: "Admin" };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">Gestiona todos los espacios y reservas del edificio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total reservas", valor: reservas.length.toString(), icon: "📅", color: "bg-red-50 text-red-700" },
          { label: "Reservas activas", valor: reservasActivas.length.toString(), icon: "✅", color: "bg-green-50 text-green-700" },
          { label: "Usuarios registrados", valor: usuarios.length.toString(), icon: "👥", color: "bg-blue-50 text-blue-700" },
          { label: "Canceladas", valor: (reservas.length - reservasActivas.length).toString(), icon: "❌", color: "bg-purple-50 text-purple-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Todas las reservas</h2>
          {cargando ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : reservas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay reservas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Reserva</th>
                    <th className="pb-3 font-medium">Usuario</th>
                    <th className="pb-3 font-medium">Fecha</th>
                    <th className="pb-3 font-medium">Estado</th>
                    <th className="pb-3 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reservas.map((r: any) => (
                    <tr key={r.reservation_number}>
                      <td className="py-3 text-gray-900 font-medium">#{r.reservation_number}</td>
                      <td className="py-3 text-gray-500">
                        <p>{r.usuario?.name1 || r.code}</p>
                        <p className="text-xs text-gray-400">{r.code}</p>
                      </td>
                      <td className="py-3 text-gray-500">{r.date}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColor[r.detalles?.[0]?.status || "P"]}`}>
                          {estadoLabel[r.detalles?.[0]?.status || "P"]}
                        </span>
                      </td>
                      <td className="py-3">
                        {r.detalles?.[0]?.status !== "C" && (
                          <button
                            onClick={() => handleCancelar(r.reservation_number)}
                            className="text-xs text-red-700 hover:underline"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
       
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Usuarios registrados</h2>
          {cargando ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
          ) : usuarios.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No hay usuarios registrados.</p>
          ) : (
          <>
          <div className="space-y-3">
          {usuarios
            .slice(paginaUsuarios * USUARIOS_POR_PAGINA, (paginaUsuarios + 1) * USUARIOS_POR_PAGINA)
            .map((u: any) => (
              <div key={u.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.name1} {u.last_name1}</p>
                  <p className="text-xs text-gray-400">{u.code} · {u.email}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  u.usertype_id === "AD" ? "bg-purple-100 text-purple-700" :
                  u.usertype_id === "DO" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                  }`}>
                  {rolLabel[u.usertype_id] || u.usertype_id}
                </span>
              </div>
            ))}
          </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {paginaUsuarios * USUARIOS_POR_PAGINA + 1}–{Math.min((paginaUsuarios + 1) * USUARIOS_POR_PAGINA, usuarios.length)} de {usuarios.length} usuarios
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPaginaUsuarios(p => Math.max(0, p - 1))}
            disabled={paginaUsuarios === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setPaginaUsuarios(p => Math.min(Math.ceil(usuarios.length / USUARIOS_POR_PAGINA) - 1, p + 1))}
            disabled={(paginaUsuarios + 1) * USUARIOS_POR_PAGINA >= usuarios.length}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </>
  )}
</div>
      </div>
      {espacios.length > 0 && <AforoWidget espacios={espacios} />}
      <RegistrarAdmin adminCode={usuario?.code || ""} />
    </div>
  );
}
