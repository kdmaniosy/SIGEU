"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ModalConfirmacion from "@/components/ui/ModalConfirmacion";
import Calendario from "@/components/ui/Calendario";
import { reservasService } from "@/lib/api";

interface Usuario {
  code: string;
  name1: string;
  usertype_id: string;
}

interface Props {
  usuario: Usuario;
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

export default function DashboardDocente({ usuario }: Props) {
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
      const data = await reservasService.obtenerTodas({ code: usuario.code });
      setReservasActivas(data.filter((r: any) => r.detalles?.[0]?.status !== "C"));
      setHistorial(data.filter((r: any) => r.detalles?.[0]?.status === "C"));
    } catch {
      setReservasActivas([]);
      setHistorial([]);
    } finally {
      setCargando(false);
    }
  }

  function abrirModal(reservation_number: string) {
    setReservaSeleccionada(reservation_number);
    setModalVisible(true);
  }

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

  const reservasCalendario = reservasActivas.map((r: any) => ({
    id: r.reservation_number,
    espacio: r.detalles?.[0]?.space_id || "Espacio",
    fecha: r.date,
    hora: `${r.detalles?.[0]?.start_time || ""} - ${r.detalles?.[0]?.end_time || ""}`,
    estado: estadoLabel[r.detalles?.[0]?.status || "P"],
  }));

  return (
    <div className="space-y-8">
      <ModalConfirmacion
        visible={modalVisible}
        titulo="¿Cancelar reserva?"
        mensaje="Esta acción no se puede deshacer."
        onConfirmar={confirmarCancelacion}
        onCancelar={() => { setModalVisible(false); setReservaSeleccionada(null); }}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {usuario.name1} 👋
        </h1>
        <p className="text-gray-500 mt-1">Gestiona los espacios para tus clases y actividades.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Clases programadas", valor: reservasActivas.length.toString(), icon: "📅", color: "bg-red-50 text-red-700" },
          { label: "Historial", valor: historial.length.toString(), icon: "📚", color: "bg-blue-50 text-blue-700" },
          { label: "Código docente", valor: usuario.code, icon: "🪪", color: "bg-green-50 text-green-700" },
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Clases programadas</h2>
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
          <p className="text-sm text-gray-400 text-center py-6">No tienes clases programadas.</p>
        ) : (
          <div className="space-y-3">
            {reservasActivas.map((r: any) => (
              <div key={r.reservation_number} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Reserva #{r.reservation_number}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.date}</p>
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
        <h2 className="font-bold text-gray-900 mb-5">Mi calendario</h2>
        <Calendario
          reservas={reservasCalendario}
          onDiaClick={(fecha) => console.log("Día:", fecha)}
        />
      </div>
    </div>
  );
}