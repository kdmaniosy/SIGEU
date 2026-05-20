"use client";
import { useState, useEffect } from "react";
import { espaciosService } from "@/lib/api";

interface Espacio {
  space_id: string;
  building_id: string;
  name: string;
  capacity: number;
  space_type_id: string;
  tipo_espacio?: { name: string };
  edificio?: { name: string };
}

interface Props {
  onSeleccionar: (espacio: Espacio) => void;
  espacioSeleccionado: Espacio | null;
  filtros: { tipo?: string; capacidad_min?: number };
}

export default function ReservasLista({ onSeleccionar, espacioSeleccionado, filtros }: Props) {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

  if (cargando) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={cargarEspacios} className="mt-3 text-sm text-red-700 hover:underline font-medium">
          Reintentar
        </button>
      </div>
    );
  }

  if (espacios.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-500 text-sm">No se encontraron espacios disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {espacios.map((espacio) => {
        const seleccionado = espacioSeleccionado?.space_id === espacio.space_id &&
          espacioSeleccionado?.building_id === espacio.building_id;
        return (
          <div
            key={`${espacio.space_id}-${espacio.building_id}`}
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
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                Disponible
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>👥 {espacio.capacity} personas</span>
              <span>🏷️ {espacio.tipo_espacio?.name || espacio.space_type_id}</span>
            </div>
            <button
              onClick={() => onSeleccionar(espacio)}
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