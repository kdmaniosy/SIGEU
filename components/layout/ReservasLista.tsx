"use client";
import { useState, useEffect } from "react";
import { espaciosService } from "@/lib/api";


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


// Props para el componente de lista de espacios disponibles en la página de reservas
interface Props {
  onSeleccionar: (espacio: Espacio) => void;
  espacioSeleccionado: Espacio | null;
  filtros: { tipo?: string; capacidad_min?: number };
}


// Componente principal para mostrar la lista de espacios disponibles en la página de reservas
export default function ReservasLista({ onSeleccionar, espacioSeleccionado, filtros }: Props) {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");


  // Efecto para cargar los espacios disponibles cada vez que cambian los filtros
  useEffect(() => {
    cargarEspacios();
  }, [filtros]);

  async function cargarEspacios() {
    setCargando(true);
    setError("");
    try {
      const data = await espaciosService.obtenerTodos(filtros);
      setEspacios(data);
    } catch {
      setError("No se pudieron cargar los espacios.");
    } finally {
      setCargando(false);
    }
  }

  // Renderizar estados de carga, error o la lista de espacios disponibles según corresponda
  if (cargando) {
    return (
      <div
        role="status"
        aria-label="Cargando espacios disponibles"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Mostrar mensaje de error si no se pudieron cargar los espacios, con opción para reintentar
  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      >
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={cargarEspacios}
          aria-label="Reintentar cargar espacios"
          className="mt-3 text-sm text-red-700 hover:underline font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Mostrar mensaje si no se encontraron espacios disponibles según los filtros aplicados
  if (espacios.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center"
      >
        <p className="text-gray-500 text-sm">No se encontraron espacios disponibles.</p>
      </div>
    );
  }


  // Renderizar la lista de espacios disponibles con información relevante y botón para seleccionar cada espacio
  return (
    <div
      role="list"
      aria-label={`${espacios.length} espacios disponibles`}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {espacios.map((espacio) => {
        const seleccionado = espacioSeleccionado?.space_id === espacio.space_id &&
          espacioSeleccionado?.building_id === espacio.building_id;
        return (
          <div
            key={`${espacio.space_id}-${espacio.building_id}`}
            role="listitem"
            aria-label={`${espacio.name}, capacidad ${espacio.capacity} personas, ${espacio.tipo_espacio?.name || espacio.space_type_id}`}
            className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
              seleccionado
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-100 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{espacio.name}</h3>
                <span className="text-xs text-gray-500">
                  {espacio.edificio?.name || espacio.building_id}
                </span>
              </div>
              <span
                role="status"
                aria-label="Espacio disponible"
                className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700"
              >
                Disponible
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span aria-label={`Capacidad: ${espacio.capacity} personas`}>
                👥 {espacio.capacity} personas
              </span>
              <span aria-label={`Tipo: ${espacio.tipo_espacio?.name || espacio.space_type_id}`}>
                🏷️ {espacio.tipo_espacio?.name || espacio.space_type_id}
              </span>
            </div>
            <button
              onClick={() => onSeleccionar(espacio)}
              aria-pressed={seleccionado}
              aria-label={seleccionado
                ? `${espacio.name} seleccionado, haz clic para deseleccionar`
                : `Seleccionar ${espacio.name} para reservar`}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                seleccionado
                  ? "bg-red-700 text-white"
                  : "bg-red-700 text-white hover:bg-red-800"
              }`}
            >
              {seleccionado ? "✓ Seleccionado" : "Reservar"}
            </button>
          </div>
        );
      })}
    </div>
  );
}