"use client";
import { useState, useEffect } from "react";
import { reservasService } from "@/lib/api";


// Interfaz para representar un espacio disponible para reserva
interface Espacio {
  space_id: string;
  building_id: string;
  name: string;
  capacity: number;
  space_type_id: string;
  tipo_espacio?: { name: string };
  edificio?: { name: string };
}


// Props para el componente de formulario de reservas
interface Props {
  espacioSeleccionado: Espacio | null;
}


// Componente principal para mostrar el formulario de confirmación de reserva en la página de reservas
export default function ReservasFormulario({ espacioSeleccionado }: Props) {
  const [form, setForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    motivo: "",
  });

  // Estados para manejar la carga, errores y éxito de la reserva
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [usuario, setUsuario] = useState<{ code: string; name1: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);

  
  // Función para manejar cambios en los campos del formulario
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }


  // Función para manejar la creación de la reserva al hacer clic en el botón de confirmar
  async function handleReservar() {
    if (!espacioSeleccionado) {
      setError("Por favor selecciona un espacio de la lista.");
      return;
    }
    if (!usuario) {
      setError("Debes iniciar sesión para hacer una reserva.");
      return;
    }
    if (!form.fecha || !form.hora_inicio || !form.hora_fin) {
      setError("Por favor completa la fecha y horario.");
      return;
    }
    if (form.hora_inicio >= form.hora_fin) {
      setError("La hora de fin debe ser mayor a la hora de inicio.");
      return;
    }

    // Iniciar el proceso de reserva: mostrar estado de carga, limpiar errores y luego intentar crear la reserva
    setCargando(true);
    setError("");
    setExito(false);

    try {
      const reservation_number = `R${Date.now().toString().slice(-4)}`;
      await reservasService.crear({
      reservation_number,
      date: form.fecha,
      code: usuario.code,
     });

     // Agregar el detalle de la reserva con la información del espacio seleccionado y el horario
    await reservasService.agregarDetalle(reservation_number, {
    line_number: 1,
    reservation_number,
    space_id: espacioSeleccionado.space_id,
    building_id: espacioSeleccionado.building_id,
    start_time: `${form.fecha}T${form.hora_inicio}:00`,
    end_time: `${form.fecha}T${form.hora_fin}:00`,
    status: "P",
    });

      setExito(true);
      setForm({ fecha: "", hora_inicio: "", hora_fin: "", motivo: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la reserva");
    } finally {
      setCargando(false);
    }
  }

  // Renderizar el formulario de confirmación de reserva con campos para fecha, horario y motivo, además de mostrar el espacio seleccionado y el usuario autenticado
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Confirmar reserva</h2>

      <div role="form" aria-label="Formulario de confirmación de reserva" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Espacio seleccionado
          </label>
          <div aria-live="polite" aria-label={espacioSeleccionado ? `Espacio seleccionado: ${espacioSeleccionado.name}` : "Ningún espacio seleccionado"} className={`w-full border rounded-lg px-4 py-2 text-sm ${
            espacioSeleccionado
              ? "border-red-300 bg-red-50 text-red-700 font-medium"
              : "border-gray-200 bg-gray-50 text-gray-400"
          }`}>
            {espacioSeleccionado
              ? `${espacioSeleccionado.name} — ${espacioSeleccionado.edificio?.name || espacioSeleccionado.building_id}`
              : "Selecciona un espacio de la lista"}
          </div>
        </div>

        {usuario && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <div className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50">
              {usuario.name1} — {usuario.code}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            aria-label="Fecha de la reserva"
            aria-required="true"
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora inicio
            </label>
            <input
              type="time"
              name="hora_inicio"
              value={form.hora_inicio}
              onChange={handleChange}
               aria-label="Hora de inicio"
              aria-required="true"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora fin
            </label>
            <input
              type="time"
              name="hora_fin"
              value={form.hora_fin}
              onChange={handleChange}
              aria-label="Hora de fin"
              aria-required="true"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo de la reserva
          </label>
          <textarea
            name="motivo"
            rows={3}
            value={form.motivo}
            onChange={handleChange}
            aria-label="Motivo de la reserva"
            aria-required="true"
            placeholder="Ej: Clase de programación, práctica de laboratorio..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {error && (
          <p role="alert" aria-live="assertive" className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
        )}

        {exito && (
          <p role="status" aria-live="polite" className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg font-medium">
            ✅ ¡Reserva creada exitosamente!
          </p>
        )}

        <button
          onClick={handleReservar}
          disabled={cargando || !espacioSeleccionado}
          aria-label={!espacioSeleccionado ? "Selecciona un espacio para confirmar la reserva" : "Confirmar reserva"}
          aria-busy={cargando}
          aria-disabled={cargando || !espacioSeleccionado}
          className="w-full bg-red-700 text-white py-3 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {cargando ? "Creando reserva..." : "Confirmar reserva"}
        </button>
      </div>
    </div>
  );
}