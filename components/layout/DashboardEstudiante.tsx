"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ModalConfirmacion from "@/components/ui/ModalConfirmacion";
import Calendario from "@/components/ui/Calendario";
import { reservasService } from "@/lib/api";


// Interfaz para las props del componente
interface Usuario {
  code: string;
  name1: string;
  usertype_id: string;
}


// Interfaz para las props del componente
interface Reserva {
  id: number;
  espacio: string;
  fecha: string;
  hora: string;
  estado: string;
}


// Interfaz para las props del componente
interface Props {
  usuario: Usuario;
}


// Colores para cada estado de reserva
const estadoColor: Record<string, string> = {
  Confirmada: "bg-green-100 text-green-700",
  Pendiente: "bg-yellow-100 text-yellow-700",
  Completada: "bg-blue-100 text-blue-700",
  Cancelada: "bg-red-100 text-red-700",
  P: "bg-yellow-100 text-yellow-700",
  A: "bg-green-100 text-green-700",
  C: "bg-red-100 text-red-700",
};


//  Mapeo para mostrar estado de reservas con etiquetas legibles
const estadoLabel: Record<string, string> = {
  P: "Pendiente",
  A: "Confirmada",
  C: "Cancelada",
};


// Componente principal del dashboard de estudiantes
export default function DashboardEstudiante({ usuario }: Props) {
  const [reservasActivas, setReservasActivas] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    cargarReservas();
  }, []);

  async function cargarReservas() {
    setCargando(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservas/actualizar-estados`, { method: "POST" });
      const data = await reservasService.obtenerTodas({ code: usuario.code });
      console.log("Data completa:", JSON.stringify(data[0], null, 2));
      const activas = data.filter((r: any) => {
    const detalle = r.detalles?.[0];
    return !detalle || detalle.status !== "C";
    });
    const hist = data.filter((r: any) => {
    const detalle = r.detalles?.[0];
    return detalle?.status === "C";
      });
      setReservasActivas(activas);
      setHistorial(hist);
    } catch {
      setReservasActivas([]);
      setHistorial([]);
    } finally {
      setCargando(false);
    }
  }

  // Función para abrir el modal de confirmación de cancelación
  function abrirModal(reservation_number: string) {
    setReservaSeleccionada(reservation_number);
    setModalVisible(true);
  }


  // Función para confirmar la cancelación de una reserva
  async function confirmarCancelacion() {
    if (!reservaSeleccionada) return;
    try {
      await reservasService.cancelar(reservaSeleccionada, usuario.code);
      await cargarReservas();
    } catch (err) {
      console.error(err);
    } finally {
      setModalVisible(false);
      setReservaSeleccionada(null);
    }
  }

  // Función para cerrar el modal y limpiar la reserva seleccionada
  function cerrarModal() {
    setModalVisible(false);
    setReservaSeleccionada(null);
  }



  // Filtrar reservas activas (no canceladas) para mostrar estadísticas
const reservasCalendario = [...reservasActivas, ...historial].map((r: any) => {
  const fecha = r.date ? r.date.split("T")[0] : "";
  const [anio, mes, dia] = fecha.split("-");
  const fechaFormateada = `${dia}/${mes}/${anio}`;
  const detalle = r.detalles?.[0];
  return {
    id: r.reservation_number,
    espacio: detalle?.space_id || "Sin espacio",
    fecha: fechaFormateada,
    hora: detalle
      ? `${detalle.start_time?.split("T")[1]?.slice(0, 5) || ""} - ${detalle.end_time?.split("T")[1]?.slice(0, 5) || ""}`
      : "",
    estado: estadoLabel[detalle?.status || "P"],
  };
});

// Filtrar reservas activas (no canceladas) para mostrar estadísticas
  return (
    <div className="space-y-8">
      <ModalConfirmacion
        visible={modalVisible}
        titulo="¿Cancelar reserva?"
        mensaje="Esta acción no se puede deshacer. La reserva pasará al historial como cancelada."
        onConfirmar={confirmarCancelacion}
        onCancelar={cerrarModal}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {usuario.name1} 👋
        </h1>
        <p className="text-gray-500 mt-1">Aquí puedes ver y gestionar tus reservas.</p>
      </div>

      <div id="estadisticas" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Reservas activas", valor: reservasActivas.length.toString(), icon: "📅", color: "bg-red-50 text-red-700" },
          { label: "Reservas este mes", valor: reservasActivas.length.toString(), icon: "📊", color: "bg-blue-50 text-blue-700" },
          { label: "Historial", valor: historial.length.toString(), icon: "🏫", color: "bg-green-50 text-green-700" },
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

      <div id="reservas" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900">Reservas activas</h2>
          <Link href="/reservas" className="text-sm text-red-700 hover:underline font-medium">
            + Nueva reserva
          </Link>
        </div>
        {cargando ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : reservasActivas.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No tienes reservas activas.</p>
        ) : (
          <div className="space-y-3">
            {reservasActivas.map((r: any) => (
              <div key={r.reservation_number} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {r.detalles?.[0]?.space_id || "Reserva"} #{r.reservation_number}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {r.date} · {r.detalles?.[0]?.start_time?.split("T")[1]?.slice(0, 5)} - {r.detalles?.[0]?.end_time?.split("T")[1]?.slice(0, 5)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColor[r.detalles?.[0]?.status || "P"]}`}>
                    {estadoLabel[r.detalles?.[0]?.status || "P"]}
                  </span>
                  <button
                    onClick={() => abrirModal(r.reservation_number)}
                    className="text-xs text-red-700 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Historial de reservas</h2>
        {historial.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No hay reservas en el historial.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Reserva</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historial.map((r: any) => (
                  <tr key={r.reservation_number}>
                    <td className="py-3 text-gray-900">#{r.reservation_number}</td>
                    <td className="py-3 text-gray-500">{r.date}</td>
                    <td className="py-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                        Cancelada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Mi calendario</h2>
        <Calendario
          reservas={reservasCalendario}
          onDiaClick={(fecha) => console.log("Día seleccionado:", fecha)}
        />
      </div>
    </div>
  );
}