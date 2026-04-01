"use client";
import { useState } from "react";
import Link from "next/link";
import ModalConfirmacion from "@/components/ui/ModalConfirmacion";
import Calendario from "@/components/ui/Calendario";

const reservasInicialesActivas = [
  { id: 1, espacio: "Aula 101", fecha: "01/04/2026", hora: "8:00 - 10:00", estado: "Confirmada" },
  { id: 2, espacio: "Laboratorio de Sistemas", fecha: "02/04/2026", hora: "14:00 - 16:00", estado: "Pendiente" },
];

const historialInicial = [
  { id: 3, espacio: "Aula 203", fecha: "25/03/2026", hora: "10:00 - 12:00", estado: "Completada" },
  { id: 4, espacio: "Aula Magna", fecha: "20/03/2026", hora: "8:00 - 9:00", estado: "Cancelada" },
  { id: 5, espacio: "Laboratorio de Electrónica", fecha: "15/03/2026", hora: "16:00 - 18:00", estado: "Completada" },
];

const estadoColor: Record<string, string> = {
  Confirmada: "bg-green-100 text-green-700",
  Pendiente: "bg-yellow-100 text-yellow-700",
  Completada: "bg-blue-100 text-blue-700",
  Cancelada: "bg-red-100 text-red-700",
};

export default function DashboardEstudiante() {
  const [reservasActivas, setReservasActivas] = useState(reservasInicialesActivas);
  const [historial, setHistorial] = useState(historialInicial);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<number | null>(null);

  function abrirModal(id: number) {
    setReservaSeleccionada(id);
    setModalVisible(true);
  }

  function confirmarCancelacion() {
    if (reservaSeleccionada === null) return;
    const reserva = reservasActivas.find((r) => r.id === reservaSeleccionada);
    if (reserva) {
      setReservasActivas(reservasActivas.filter((r) => r.id !== reservaSeleccionada));
      setHistorial([{ ...reserva, estado: "Cancelada" }, ...historial]);
    }
    setModalVisible(false);
    setReservaSeleccionada(null);
  }

  function cerrarModal() {
    setModalVisible(false);
    setReservaSeleccionada(null);
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido, Estudiante</h1>
        <p className="text-gray-500 mt-1">Aquí puedes ver y gestionar tus reservas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Reservas activas", valor: reservasActivas.length.toString(), icon: "📅", color: "bg-red-50 text-red-700" },
          { label: "Reservas este mes", valor: "5", icon: "📊", color: "bg-blue-50 text-blue-700" },
          { label: "Espacios usados", valor: "3", icon: "🏫", color: "bg-green-50 text-green-700" },
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
          <h2 className="font-bold text-gray-900">Reservas activas</h2>
          <Link href="/reservas" className="text-sm text-red-700 hover:underline font-medium">
            + Nueva reserva
          </Link>
        </div>
        {reservasActivas.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No tienes reservas activas.</p>
        ) : (
          <div className="space-y-3">
            {reservasActivas.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{r.espacio}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.fecha} · {r.hora}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColor[r.estado]}`}>
                    {r.estado}
                  </span>
                  <button
                    onClick={() => abrirModal(r.id)}
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Espacio</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Horario</th>
                <th className="pb-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historial.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 text-gray-900">{r.espacio}</td>
                  <td className="py-3 text-gray-500">{r.fecha}</td>
                  <td className="py-3 text-gray-500">{r.hora}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColor[r.estado]}`}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Mi calendario</h2>
        <Calendario
          reservas={[...reservasInicialesActivas, ...historialInicial]}
          onDiaClick={(fecha) => console.log("Día seleccionado:", fecha)}
        />
      </div>
    </div>
  );
}