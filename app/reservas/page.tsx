"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ReservasFiltros from "@/components/layout/ReservasFiltros";
import ReservasLista from "@/components/layout/ReservasLista";
import ReservasFormulario from "@/components/layout/ReservasFormulario";

// Interfaz para tipar los datos de un espacio disponible para reserva
interface Espacio {
  space_id: string;
  building_id: string;
  name: string;
  capacity: number;
  space_type_id: string;
  tipo_espacio?: { name: string };
  edificio?: { name: string };
}

// Interfaz para tipar los filtros de búsqueda de espacios
interface Filtros {
  tipo?: string;
  capacidad_min?: number;
}

// Componente principal de la página de reservas
export default function ReservasPage() {
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<Espacio | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({});

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reserva un espacio</h1>
          <p className="text-gray-500 mt-2">
            Selecciona el aula o laboratorio que necesitas y elige tu horario.
          </p>
        </div>
        <ReservasFiltros onFiltrar={setFiltros} />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReservasLista
              onSeleccionar={setEspacioSeleccionado}
              espacioSeleccionado={espacioSeleccionado}
              filtros={filtros}
            />
          </div>
          <div>
            <ReservasFormulario espacioSeleccionado={espacioSeleccionado} />
          </div>
        </div>
      </div>
    </main>
  );
}