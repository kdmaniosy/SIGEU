"use client";
import { useState, useEffect } from "react";
import { aforoService } from "@/lib/api";

interface AforoData {
  space_id: string;
  building_id: string;
  personas_detectadas: number;
  registrado_en?: string;
}

interface Espacio {
  space_id: string;
  building_id: string;
  name: string;
  capacity: number;
}

interface Props {
  espacios: Espacio[];
}

export default function AforoWidget({ espacios }: Props) {
  const [aforoData, setAforoData] = useState<Record<string, AforoData>>({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarAforo();
    const intervalo = setInterval(cargarAforo, 10000);
    return () => clearInterval(intervalo);
  }, [espacios]);

  async function cargarAforo() {
    const datos: Record<string, AforoData> = {};
    console.log("Espacios a consultar:", espacios);
    await Promise.all(
      espacios.map(async (e) => {
        try {
          const data = await aforoService.obtenerActual(e.space_id, e.building_id);
          console.log(`Aforo ${e.space_id}-${e.building_id}:`, data);
          datos[`${e.space_id}-${e.building_id}`] = data;
        } catch {
          datos[`${e.space_id}-${e.building_id}`] = {
            space_id: e.space_id,
            building_id: e.building_id,
            personas_detectadas: 0,
          };
        }
      })
    );
    setAforoData(datos);
    setCargando(false);
  }

  function getPorcentaje(personas: number, capacidad: number) {
    return Math.min(Math.round((personas / capacidad) * 100), 100);
  }

  function getColor(porcentaje: number) {
    if (porcentaje >= 90) return { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50" };
    if (porcentaje >= 70) return { bar: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" };
    return { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" };
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900">Control de Aforo en Tiempo Real</h2>
        <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          En vivo
        </span>
      </div>

      {cargando ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {espacios.map((espacio) => {
            const key = `${espacio.space_id}-${espacio.building_id}`;
            const aforo = aforoData[key];
            const personas = aforo?.personas_detectadas || 0;
            const porcentaje = getPorcentaje(personas, espacio.capacity);
            const colores = getColor(porcentaje);

            return (
              <div key={key} className={`p-4 rounded-lg ${colores.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{espacio.name}</p>
                    <p className="text-xs text-gray-500">
                      {personas} / {espacio.capacity} personas
                    </p>
                  </div>
                  <span className={`text-lg font-bold ${colores.text}`}>
                    {porcentaje}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${colores.bar}`}
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
                {porcentaje >= 90 && (
                  <p className="text-xs text-red-600 font-medium mt-1.5">
                    ⚠️ Capacidad casi llena — nuevas reservas bloqueadas
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}