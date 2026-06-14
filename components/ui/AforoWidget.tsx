"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { aforoService } from "@/lib/api";
import { ToastContainer, useToast } from "@/components/ui/Toast";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AforoWidget({ espacios }: Props) {
  const [aforoData, setAforoData] = useState<Record<string, AforoData>>({});
  const [cargando, setCargando] = useState(true);
  const [espacioStream, setEspacioStream] = useState<Espacio | null>(null);
  const { toasts, agregar, cerrar } = useToast();
  const alertasEnviadas = useRef<Set<string>>(new Set());

  const cargarAforo = useCallback(async () => {
    if (espacios.length === 0) return;
    try {
      const resultados = await aforoService.obtenerTodosActual();
      const datos: Record<string, AforoData> = {};

      espacios.forEach((e) => {
        datos[`${e.space_id}-${e.building_id}`] = {
          space_id: e.space_id,
          building_id: e.building_id,
          personas_detectadas: 0,
        };
      });

      resultados.forEach((r: AforoData) => {
        const key = `${r.space_id}-${r.building_id}`;
        datos[key] = r;

        const espacio = espacios.find(
          (e) => e.space_id === r.space_id && e.building_id === r.building_id
        );
        if (!espacio) return;

        const porcentaje = (r.personas_detectadas / espacio.capacity) * 100;
        const alertaKey = `${r.space_id}-${r.building_id}-${Math.floor(porcentaje / 10)}`;

        if (porcentaje >= 100 && !alertasEnviadas.current.has(`full-${alertaKey}`)) {
          agregar(`🚨 ${espacio.name} superó su capacidad máxima (${r.personas_detectadas}/${espacio.capacity} personas)`, "error");
          alertasEnviadas.current.add(`full-${alertaKey}`);
        } else if (porcentaje >= 80 && !alertasEnviadas.current.has(`warn-${alertaKey}`)) {
          agregar(`⚠️ ${espacio.name} está al ${Math.round(porcentaje)}% de su capacidad`, "warning");
          alertasEnviadas.current.add(`warn-${alertaKey}`);
        }
      });

      setAforoData(datos);
    } catch {
      const datos: Record<string, AforoData> = {};
      espacios.forEach((e) => {
        datos[`${e.space_id}-${e.building_id}`] = {
          space_id: e.space_id,
          building_id: e.building_id,
          personas_detectadas: 0,
        };
      });
      setAforoData(datos);
    } finally {
      setCargando(false);
    }
  }, [espacios, agregar]);

  useEffect(() => {
    cargarAforo();
    const intervalo = setInterval(cargarAforo, 10000);
    return () => clearInterval(intervalo);
  }, [cargarAforo]);

  function getPorcentaje(personas: number, capacidad: number) {
    return Math.min(Math.round((personas / capacidad) * 100), 100);
  }

  function getColor(porcentaje: number) {
    if (porcentaje >= 100) return { bar: "bg-red-600", text: "text-red-700", bg: "bg-red-50" };
    if (porcentaje >= 80) return { bar: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" };
    return { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" };
  }

  return (
    <>
      <ToastContainer toasts={toasts} onCerrar={cerrar} />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Control de Aforo en Tiempo Real</h2>
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            En vivo · actualiza cada 10s
          </span>
        </div>

        {espacioStream && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900">
                📷 Cámara — {espacioStream.name}
              </p>
              <button
                onClick={() => setEspacioStream(null)}
                className="text-xs text-red-600 hover:underline"
              >
                Cerrar video
              </button>
            </div>
            <div className="relative bg-black rounded-xl overflow-hidden">
              <img
                src={`${API_URL}/aforo/stream/${espacioStream.space_id}/${espacioStream.building_id}`}
                alt={`Stream ${espacioStream.name}`}
                className="w-full rounded-xl"
                style={{ maxHeight: "320px", objectFit: "contain" }}
              />
            </div>
          </div>
        )}

        {cargando ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : espacios.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No hay espacios registrados.</p>
        ) : (
          <div className="space-y-4">
            {espacios.map((espacio) => {
              const key = `${espacio.space_id}-${espacio.building_id}`;
              const aforo = aforoData[key];
              const personas = aforo?.personas_detectadas || 0;
              const porcentaje = getPorcentaje(personas, espacio.capacity);
              const colores = getColor(porcentaje);
              const streamActivo = espacioStream?.space_id === espacio.space_id &&
                espacioStream?.building_id === espacio.building_id;

              return (
                <div key={key} className={`p-4 rounded-lg border transition-all ${
                  streamActivo ? "border-red-400 ring-2 ring-red-100" : "border-transparent"
                } ${colores.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{espacio.name}</p>
                      <p className="text-xs text-gray-500">
                        {personas} / {espacio.capacity} personas
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${colores.text}`}>
                        {porcentaje}%
                      </span>
                      <button
                        onClick={() => setEspacioStream(streamActivo ? null : espacio)}
                        className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                          streamActivo
                            ? "bg-red-700 text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {streamActivo ? "📷 Viendo" : "📷 Ver"}
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${colores.bar}`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  {porcentaje >= 100 && (
                    <p className="text-xs text-red-700 font-semibold mt-1.5">
                      🚨 Capacidad superada — acceso restringido
                    </p>
                  )}
                  {porcentaje >= 80 && porcentaje < 100 && (
                    <p className="text-xs text-yellow-700 font-medium mt-1.5">
                      ⚠️ Capacidad casi llena
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}