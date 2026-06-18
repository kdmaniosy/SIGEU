"use client";
import { useState } from "react";


//Este componente muestra un calendario con dos vistas: mensual y semanal. Permite navegar entre meses y semanas, y al hacer clic en un día, muestra las reservas asociadas a esa fecha. Las reservas se representan con puntos de colores según su estado (confirmada, pendiente, completada, cancelada). El componente también resalta el día actual y el día seleccionado.
interface Reserva {
  id: number;
  espacio: string;
  fecha: string;
  hora: string;
  estado: string;
}


//Define una interfaz Props que especifica las propiedades que el componente Calendario espera recibir. En este caso, se espera un array de reservas y una función opcional onDiaClick que se ejecutará cuando se haga clic en un día del calendario.
interface Props {
  reservas: Reserva[];
  onDiaClick?: (fecha: string) => void;
}


//Constantes para los nombres de los meses, días de la semana y colores asociados a los estados de las reservas.
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];


// Define un objeto estadoColor que asigna un color de fondo a cada estado de reserva. Esto se utiliza para mostrar visualmente el estado de cada reserva en el calendario.
const estadoColor: Record<string, string> = {
  Confirmada: "bg-green-500",
  Pendiente: "bg-yellow-400",
  Completada: "bg-blue-400",
  Cancelada: "bg-red-400",
};


// El componente Calendario utiliza el hook useState para manejar el estado de la vista actual (mensual o semanal), el mes y año actuales, y el día seleccionado. La función formatearFecha se utiliza para convertir una fecha en formato "YYYY-MM-DD", y la función reservasDelDia filtra las reservas para obtener solo las que corresponden a una fecha específica. La función handleDiaClick actualiza el día seleccionado y llama a la función onDiaClick si está definida. Las funciones diasDelMes y semanaActual calculan los días del mes actual y los días de la semana actual, respectivamente.
export default function Calendario({ reservas, onDiaClick }: Props) {
  const hoy = new Date();
  const [vista, setVista] = useState<"mensual" | "semanal">("mensual");
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  
  // La función formatearFecha toma un año, mes y día como argumentos y devuelve una cadena de texto en formato "YYYY-MM-DD". Esto se utiliza para estandarizar el formato de las fechas al comparar con las reservas.
  function formatearFecha(anio: number, mes: number, dia: number) {
  return `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  }

  // La función reservasDelDia toma una fecha como argumento y devuelve un array de reservas que corresponden a esa fecha. Esto se utiliza para mostrar las reservas asociadas a un día específico cuando se hace clic en él.
  function reservasDelDia(fecha: string) {
    return reservas.filter((r) => r.fecha === fecha);
  }


  // La función handleDiaClick se ejecuta cuando se hace clic en un día del calendario. Actualiza el estado diaSeleccionado con la fecha del día clickeado y llama a la función onDiaClick si está definida, pasando la fecha como argumento.
  function handleDiaClick(fecha: string) {
    setDiaSeleccionado(fecha);
    onDiaClick?.(fecha);
  }

  // La función diasDelMes calcula el día de la semana del primer día del mes actual y el número total de días en ese mes. Esto se utiliza para renderizar correctamente los días en la vista mensual del calendario.
  function diasDelMes() {
    const primero = new Date(anioActual, mesActual, 1).getDay();
    const total = new Date(anioActual, mesActual + 1, 0).getDate();
    return { primero, total };
  }

  // La función semanaActual calcula las fechas de los días de la semana actual, comenzando desde el domingo. Esto se utiliza para renderizar los días en la vista semanal del calendario.
  function semanaActual() {
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(inicioSemana);
      d.setDate(inicioSemana.getDate() + i);
      return d;
    });
  }

  // Se obtienen el día de la semana del primer día del mes y el número total de días en el mes actual utilizando la función diasDelMes. También se obtienen las fechas de los días de la semana actual utilizando la función semanaActual. Estos valores se utilizan posteriormente para renderizar el calendario correctamente.
  const { primero, total } = diasDelMes();
  const diasSemana = semanaActual();


  // El componente retorna un JSX que representa la estructura del calendario. Incluye botones para navegar entre meses y semanas, y muestra los días del mes o de la semana según la vista seleccionada. Al hacer clic en un día, se muestran las reservas asociadas a esa fecha debajo del calendario.
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