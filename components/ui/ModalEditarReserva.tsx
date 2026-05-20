"use client";
import { useState, useEffect } from "react";
import { espaciosService, reservasService } from "@/lib/api";

interface Espacio {
  space_id: string;
  building_id: string;
  name: string;
  capacity: number;
  space_type_id: string;
  tipo_espacio?: { name: string };
  edificio?: { name: string };
}

interface ReservaDetalle {
  line_number: number;
  reservation_number: string;
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
  detalles?: ReservaDetalle[];
}

interface Props {
  visible: boolean;
  reserva: Reserva | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ModalEditarReserva({ visible, reserva, onClose, onSave }: Props) {
  const [fecha, setFecha] = useState("");
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(""); // formato: "space_id|building_id"
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [cargandoEspacios, setCargandoEspacios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (visible && reserva) {
      setError("");
      setExito(false);
      setFecha(reserva.date);
      
      const primerDetalle = reserva.detalles?.[0];
      if (primerDetalle) {
        setEspacioSeleccionado(`${primerDetalle.space_id}|${primerDetalle.building_id}`);
      } else {
        setEspacioSeleccionado("");
      }

      cargarEspacios();
    }
  }, [visible, reserva]);

  async function cargarEspacios() {
    setCargandoEspacios(true);
    try {
      const data = await espaciosService.obtenerTodos();
      setEspacios(data);
    } catch {
      setError("No se pudieron cargar los espacios disponibles.");
    } finally {
      setCargandoEspacios(false);
    }
  }

  async function handleGuardar() {
    if (!reserva) return;
    if (!fecha) {
      setError("Por favor selecciona una fecha válida.");
      return;
    }
    if (!espacioSeleccionado) {
      setError("Por favor selecciona un espacio.");
      return;
    }

    setGuardando(true);
    setError("");
    setExito(false);

    try {
      const [space_id, building_id] = espacioSeleccionado.split("|");
      const primerDetalle = reserva.detalles?.[0];
      const line_number = primerDetalle?.line_number || 1;
      const status = primerDetalle?.status || "P";

      // 1. Actualizar cabecera de la reserva (fecha)
      await reservasService.actualizar(reserva.reservation_number, {
        date: fecha,
        code: reserva.code,
      });

      // 2. Actualizar el detalle de la reserva
      let start_time = fecha;
      let end_time = fecha;
      if (primerDetalle) {
        const startMatch = primerDetalle.start_time.match(/[T ](\d{2}:\d{2}(:\d{2})?)/);
        const startTimePart = startMatch ? startMatch[1] : "00:00:00";
        start_time = `${fecha}T${startTimePart.split(':').length === 2 ? `${startTimePart}:00` : startTimePart}`;

        const endMatch = primerDetalle.end_time.match(/[T ](\d{2}:\d{2}(:\d{2})?)/);
        const endTimePart = endMatch ? endMatch[1] : "00:00:00";
        end_time = `${fecha}T${endTimePart.split(':').length === 2 ? `${endTimePart}:00` : endTimePart}`;
      }

      await reservasService.actualizarDetalle(reserva.reservation_number, line_number, {
        line_number,
        reservation_number: reserva.reservation_number,
        space_id,
        building_id,
        start_time,
        end_time,
        status,
      });

      setExito(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar la reserva");
    } finally {
      setGuardando(false);
    }
  }

  if (!visible || !reserva) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
          <h2 className="text-xl font-bold text-gray-900">Editar Reserva {reserva.reservation_number}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none">
            &times;
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de la reserva
            </label>
            <input
              type="date"
              value={fecha}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Espacio seleccionado
            </label>
            {cargandoEspacios ? (
              <div className="text-sm text-gray-400 animate-pulse py-2">Cargando espacios disponibles...</div>
            ) : (
              <select
                value={espacioSeleccionado}
                onChange={(e) => setEspacioSeleccionado(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">Selecciona un espacio</option>
                {espacios.map((esp) => (
                  <option key={`${esp.space_id}|${esp.building_id}`} value={`${esp.space_id}|${esp.building_id}`}>
                    {esp.name} — {esp.edificio?.name || esp.building_id} (Aforo: {esp.capacity})
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {exito && (
            <div className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg font-medium border border-green-100">
              ✅ ¡Reserva actualizada exitosamente!
            </div>
          )}

          <div className="flex gap-3 border-t border-gray-100 pt-5 mt-6">
            <button
              onClick={onClose}
              disabled={guardando}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardando || cargandoEspacios}
              className="flex-1 py-2.5 rounded-lg bg-red-700 text-white text-sm font-semibold hover:bg-red-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {guardando ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
