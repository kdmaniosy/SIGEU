"use client";
import { useState, useEffect } from "react";
import { espaciosService, reservasService } from "@/lib/api";

// Este archivo define un componente de modal llamado ModalEditarReserva que se utiliza para editar los detalles de una reserva existente. El modal permite al usuario cambiar la fecha de la reserva y seleccionar un espacio diferente. El componente maneja el estado local para la fecha, el espacio seleccionado, los espacios disponibles, así como los estados de carga, error y éxito. Al abrir el modal, se cargan los espacios disponibles y se inicializan los campos con los datos de la reserva actual. Al guardar los cambios, se realizan llamadas a la API para actualizar tanto la cabecera como el detalle de la reserva, y se muestra un mensaje de éxito o error según corresponda.
interface Espacio {
  space_id: string;
  building_id: string;
  name: string;
  capacity: number;
  space_type_id: string;
  tipo_espacio?: { name: string };
  edificio?: { name: string };
}

// La interfaz ReservaDetalle representa los detalles específicos de una reserva, incluyendo el número de línea, número de reserva, identificadores del espacio y edificio, horarios de inicio y fin, y el estado de la reserva.
interface ReservaDetalle {
  line_number: number;
  reservation_number: string;
  space_id: string;
  building_id: string;
  start_time: string;
  end_time: string;
  status: string;
}


// La interfaz Reserva representa la estructura general de una reserva, incluyendo el número de reserva, fecha, código y un arreglo opcional de detalles de la reserva.
interface Reserva {
  reservation_number: string;
  date: string;
  code: string;
  detalles?: ReservaDetalle[];
}


// La interfaz Props define las propiedades que el componente ModalEditarReserva espera recibir. Estas incluyen la visibilidad del modal, la reserva que se va a editar, y las funciones para cerrar el modal y guardar los cambios realizados.
interface Props {
  visible: boolean;
  reserva: Reserva | null;
  onClose: () => void;
  onSave: () => void;
}


// El componente ModalEditarReserva es el componente principal que representa el modal de edición de reserva. Utiliza las props para controlar su comportamiento y apariencia, y maneja el estado local para los campos del formulario, así como los estados de carga, error y éxito.
export default function ModalEditarReserva({ visible, reserva, onClose, onSave }: Props) {
  const [fecha, setFecha] = useState("");
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(""); // formato: "space_id|building_id"
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [cargandoEspacios, setCargandoEspacios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  // El hook useEffect se utiliza para cargar los espacios disponibles y inicializar los campos del formulario cada vez que el modal se abre (cuando la prop "visible" cambia a true) o cuando la reserva a editar cambia. Si la reserva está disponible, se establecen los valores iniciales para la fecha y el espacio seleccionado, y se llama a la función cargarEspacios para obtener la lista de espacios disponibles desde la API.
  useEffect(() => {
    if (visible && reserva) {
      setError("");
      setExito(false);
      setFecha(reserva.date);
      
      // Si la reserva tiene detalles, se toma el primer detalle para establecer el espacio seleccionado. Si no hay detalles, se deja el espacio seleccionado vacío.
      const primerDetalle = reserva.detalles?.[0];
      if (primerDetalle) {
        setEspacioSeleccionado(`${primerDetalle.space_id}|${primerDetalle.building_id}`);
      } else {
        setEspacioSeleccionado("");
      }

      cargarEspacios();
    }
  }, [visible, reserva]);

  // La función cargarEspacios es una función asíncrona que se encarga de obtener la lista de espacios disponibles desde la API. Durante la carga, se establece el estado cargandoEspacios en true para mostrar un indicador de carga. Si la carga es exitosa, se actualiza el estado espacios con los datos obtenidos. Si ocurre un error durante la carga, se establece un mensaje de error en el estado error. Finalmente, independientemente del resultado, se establece cargandoEspacios en false para ocultar el indicador de carga.
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

  // La función handleGuardar es una función asíncrona que se ejecuta cuando el usuario hace clic en el botón para guardar los cambios realizados en la reserva. La función realiza varias validaciones para asegurarse de que se haya seleccionado una fecha y un espacio válidos. Si las validaciones pasan, se realizan llamadas a la API para actualizar tanto la cabecera como el detalle de la reserva con los nuevos datos. Durante el proceso de guardado, se establece el estado guardando en true para mostrar un indicador de carga, y se manejan los estados de error y éxito según corresponda.
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

    // Validar formato de espacio seleccionado
    setGuardando(true);
    setError("");
    setExito(false);


    // El bloque try-catch se utiliza para manejar posibles errores durante el proceso de guardado.
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

      // Si todo se actualiza correctamente, se muestra un mensaje de éxito y se cierra el modal después de un breve retraso para permitir que el usuario vea el mensaje.
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

  // Si el modal no es visible o no hay una reserva para editar, el componente no renderiza nada (retorna null).
  if (!visible || !reserva) return null;


  // El modal se muestra como una superposición en la pantalla, con un fondo semitransparente que oscurece el contenido detrás de él. El contenido del modal está centrado tanto vertical como horizontalmente, y se utiliza un diseño de tarjeta con bordes redondeados y sombra para darle un aspecto moderno y atractivo. Dentro del modal, se muestra un título con el número de reserva que se está editando, seguido de un botón para cerrar el modal. Luego, hay un formulario con campos para seleccionar la fecha de la reserva y el espacio seleccionado, así como mensajes de error o éxito según corresponda. Finalmente, hay dos botones: uno para cancelar los cambios (que cierra el modal) y otro para guardar los cambios (que ejecuta la función handleGuardar).
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
