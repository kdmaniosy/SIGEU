"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { aforoService } from "@/lib/api";
import { ToastContainer, useToast } from "@/components/ui/Toast";

// Interfaz para representar los datos de aforo de un espacio
interface AforoData {
  space_id: string;
  building_id: string;
  personas_detectadas: number;
  registrado_en?: string;
}


// Interfaz para representar un espacio con su información básica
interface Espacio {
  space_id: string;
  building_id: string;
  name: string;
  capacity: number;
}


// Props para el componente del widget de control de aforo en tiempo real, que recibe la lista de espacios a monitorear
interface Props {
  espacios: Espacio[];
}


// URL base para acceder a los streams de video de los espacios, configurable mediante variable de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


// Componente principal para mostrar el widget de control de aforo en tiempo real, con alertas visuales y opción para ver el stream de video de cada espacio
export default function AforoWidget({ espacios }: Props) {
  const [aforoData, setAforoData] = useState<Record<string, AforoData>>({});
  const [cargando, setCargando] = useState(true);
  const [espacioStream, setEspacioStream] = useState<Espacio | null>(null);
  const { toasts, agregar, cerrar } = useToast();
  const alertasEnviadas = useRef<Set<string>>(new Set());


  // Función para cargar los datos de aforo de todos los espacios, con lógica para enviar alertas cuando se superan ciertos umbrales de capacidad
  const cargarAforo = useCallback(async () => {
    if (espacios.length === 0) return;
    try {
      const resultados = await aforoService.obtenerTodosActual();
      const datos: Record<string, AforoData> = {};


      // Inicializar el objeto de datos de aforo con los espacios registrados, asignando 0 personas detectadas por defecto para cada espacio
      espacios.forEach((e) => {
        datos[`${e.space_id}-${e.building_id}`] = {
          space_id: e.space_id,
          building_id: e.building_id,
          personas_detectadas: 0,
        };
      });


      // Procesar los resultados obtenidos del servicio de aforo y actualizar el estado con los datos más recientes, además de enviar alertas si se superan ciertos umbrales de capacidad
      resultados.forEach((r: AforoData) => {
        const key = `${r.space_id}-${r.building_id}`;
        datos[key] = r;

        // Buscar el espacio correspondiente a los datos de aforo obtenidos para calcular el porcentaje de ocupación y determinar si se deben enviar alertas
        const espacio = espacios.find(
          (e) => e.space_id === r.space_id && e.building_id === r.building_id
        );
        if (!espacio) return;

        // Calcular el porcentaje de ocupación del espacio y generar una clave única para las alertas basadas en el espacio y el umbral de capacidad alcanzado
        const porcentaje = (r.personas_detectadas / espacio.capacity) * 100;
        const alertaKey = `${r.space_id}-${r.building_id}-${Math.floor(porcentaje / 10)}`;


        // Enviar alertas si el porcentaje de ocupación supera el 80% o el 100%, asegurándose de no enviar la misma alerta múltiples veces para el mismo espacio y umbral
        if (porcentaje >= 100 && !alertasEnviadas.current.has(`full-${alertaKey}`)) {
          agregar(`🚨 ${espacio.name} superó su capacidad máxima (${r.personas_detectadas}/${espacio.capacity} personas)`, "error");
          alertasEnviadas.current.add(`full-${alertaKey}`);
        } else if (porcentaje >= 80 && !alertasEnviadas.current.has(`warn-${alertaKey}`)) {
          agregar(`⚠️ ${espacio.name} está al ${Math.round(porcentaje)}% de su capacidad`, "warning");
          alertasEnviadas.current.add(`warn-${alertaKey}`);
        }
      });


      // Limpiar las alertas de espacios que han bajado de los umbrales de capacidad para permitir enviar nuevas alertas si vuelven a subir
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


  // Efecto para cargar los datos de aforo al montar el componente y configurar un intervalo para actualizar los datos cada 10 segundos, limpiando el intervalo al desmontar el componente
  useEffect(() => {
    cargarAforo();
    const intervalo = setInterval(cargarAforo, 10000);
    return () => clearInterval(intervalo);
  }, [cargarAforo]);


  // Función para calcular el porcentaje de ocupación de un espacio basado en el número de personas detectadas y la capacidad total del espacio, asegurándose de no exceder el 100%
  function getPorcentaje(personas: number, capacidad: number) {
    return Math.min(Math.round((personas / capacidad) * 100), 100);
  }


  // Función para determinar las clases de estilo CSS a aplicar a la barra de progreso y al texto del porcentaje basado en el nivel de ocupación del espacio, utilizando colores verde, amarillo y rojo para indicar niveles bajos, medios y altos de ocupación respectivamente
  function getColor(porcentaje: number) {
    if (porcentaje >= 100) return { bar: "bg-red-600", text: "text-red-700", bg: "bg-red-50" };
    if (porcentaje >= 80) return { bar: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" };
    return { bar: "bg-green-500", text: "text-green-700", bg: "bg-green-50" };
  }


  // Renderizado del componente, mostrando el título, el estado de actualización en vivo, la lista de espacios con su información de aforo y opciones para ver el stream de video de cada espacio, además de mostrar alertas visuales cuando se superan ciertos umbrales de capacidad
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

                // Renderizar la tarjeta de información para cada espacio, mostrando el nombre del espacio, el número de personas detectadas, la capacidad total, el porcentaje de ocupación con colores indicativos y un botón para ver el stream de video si está disponible
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