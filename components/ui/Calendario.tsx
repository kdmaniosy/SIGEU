"use client";
import { useState } from "react";

interface Reserva {
  id: number;
  espacio: string;
  fecha: string;
  hora: string;
  estado: string;
}

interface Props {
  reservas: Reserva[];
  onDiaClick?: (fecha: string) => void;
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const estadoColor: Record<string, string> = {
  Confirmada: "bg-green-500",
  Pendiente: "bg-yellow-400",
  Completada: "bg-blue-400",
  Cancelada: "bg-red-400",
};

export default function Calendario({ reservas, onDiaClick }: Props) {
  const hoy = new Date();
  const [vista, setVista] = useState<"mensual" | "semanal">("mensual");
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  function formatearFecha(anio: number, mes: number, dia: number) {
    return `${String(dia).padStart(2, "0")}/${String(mes + 1).padStart(2, "0")}/${anio}`;
  }

  function reservasDelDia(fecha: string) {
    return reservas.filter((r) => r.fecha === fecha);
  }

  function handleDiaClick(fecha: string) {
    setDiaSeleccionado(fecha);
    onDiaClick?.(fecha);
  }

  function diasDelMes() {
    const primero = new Date(anioActual, mesActual, 1).getDay();
    const total = new Date(anioActual, mesActual + 1, 0).getDate();
    return { primero, total };
  }

  function semanaActual() {
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(inicioSemana);
      d.setDate(inicioSemana.getDate() + i);
      return d;
    });
  }

  const { primero, total } = diasDelMes();
  const diasSemana = semanaActual();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {vista === "mensual" && (
            <>
              <button
                onClick={() => {
                  if (mesActual === 0) { setMesActual(11); setAnioActual(anioActual - 1); }
                  else setMesActual(mesActual - 1);
                }}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
              >
                ‹
              </button>
              <span className="font-semibold text-gray-900 text-sm min-w-32 text-center">
                {MESES[mesActual]} {anioActual}
              </span>
              <button
                onClick={() => {
                  if (mesActual === 11) { setMesActual(0); setAnioActual(anioActual + 1); }
                  else setMesActual(mesActual + 1);
                }}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
              >
                ›
              </button>
            </>
          )}
          {vista === "semanal" && (
            <span className="font-semibold text-gray-900 text-sm">
              Semana actual
            </span>
          )}
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setVista("mensual")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              vista === "mensual" ? "bg-red-700 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setVista("semanal")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              vista === "semanal" ? "bg-red-700 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Semanal
          </button>
        </div>
      </div>

      {vista === "mensual" && (
        <div>
          <div className="grid grid-cols-7 mb-2">
            {DIAS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: primero }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: total }, (_, i) => i + 1).map((dia) => {
              const fecha = formatearFecha(anioActual, mesActual, dia);
              const rsv = reservasDelDia(fecha);
              const esHoy =
                dia === hoy.getDate() &&
                mesActual === hoy.getMonth() &&
                anioActual === hoy.getFullYear();
              const seleccionado = diaSeleccionado === fecha;
              return (
                <button
                  key={dia}
                  onClick={() => handleDiaClick(fecha)}
                  className={`relative p-1.5 rounded-lg text-xs transition-colors min-h-12 flex flex-col items-center ${
                    seleccionado
                      ? "bg-red-700 text-white"
                      : esHoy
                      ? "bg-red-50 text-red-700 font-bold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span>{dia}</span>
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {rsv.slice(0, 3).map((r) => (
                      <span
                        key={r.id}
                        className={`w-1.5 h-1.5 rounded-full ${estadoColor[r.estado] ?? "bg-gray-400"}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {vista === "semanal" && (
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map((fecha) => {
            const fechaStr = formatearFecha(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            const rsv = reservasDelDia(fechaStr);
            const esHoy = fecha.toDateString() === hoy.toDateString();
            const seleccionado = diaSeleccionado === fechaStr;
            return (
              <button
                key={fechaStr}
                onClick={() => handleDiaClick(fechaStr)}
                className={`rounded-xl p-3 text-center transition-colors ${
                  seleccionado
                    ? "bg-red-700 text-white"
                    : esHoy
                    ? "bg-red-50 text-red-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <p className="text-xs font-medium mb-1">{DIAS[fecha.getDay()]}</p>
                <p className={`text-lg font-bold ${seleccionado ? "text-white" : esHoy ? "text-red-700" : "text-gray-900"}`}>
                  {fecha.getDate()}
                </p>
                <div className="mt-2 space-y-1">
                  {rsv.map((r) => (
                    <div
                      key={r.id}
                      className={`text-xs px-1 py-0.5 rounded truncate ${
                        seleccionado ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.espacio}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {diaSeleccionado && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Reservas del {diaSeleccionado}
          </p>
          {reservasDelDia(diaSeleccionado).length === 0 ? (
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">No hay reservas este día.</p>
                <a href="/reservas" className="text-sm text-red-700 hover:underline font-medium">
                 + Reservar aquí
                </a>
            </div>
          ) : (
            <div className="space-y-2">
              {reservasDelDia(diaSeleccionado).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.espacio}</p>
                    <p className="text-xs text-gray-500">{r.hora}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    r.estado === "Confirmada" ? "bg-green-100 text-green-700" :
                    r.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700" :
                    r.estado === "Completada" ? "bg-blue-100 text-blue-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {r.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}