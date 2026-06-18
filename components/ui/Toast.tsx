"use client";
import { useEffect, useState } from "react";


// El componente Toast es un componente de notificación que muestra mensajes de diferentes tipos (error, warning, success, info) en la pantalla. El componente recibe tres props: mensaje, tipo y onCerrar. El mensaje es el texto que se mostrará en la notificación, el tipo determina el estilo de la notificación (color y icono) y onCerrar es una función que se ejecuta cuando el usuario cierra la notificación. La notificación se muestra durante 5 segundos antes de cerrarse automáticamente, pero también puede ser cerrada manualmente por el usuario haciendo clic en el botón de cierre.
interface ToastProps {
  mensaje: string;
  tipo: "error" | "warning" | "success" | "info";
  onCerrar: () => void;
}


// El componente utiliza el hook useEffect para establecer un temporizador que cierra la notificación después de 5 segundos. También define estilos e iconos para cada tipo de notificación, y renderiza la notificación con el mensaje, el icono correspondiente y un botón de cierre. El componente ToastContainer es un contenedor que muestra una lista de notificaciones, y el hook useToast proporciona una forma de agregar y cerrar notificaciones desde otros componentes.
export function Toast({ mensaje, tipo, onCerrar }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onCerrar, 5000);
    return () => clearTimeout(timer);
  }, [onCerrar]);

  // Los estilos para cada tipo de notificación se definen en el objeto estilos, donde cada clave corresponde a un tipo de notificación y su valor es una cadena de clases de Tailwind CSS que aplican el color de fondo y el color del texto. De manera similar, los iconos para cada tipo de notificación se definen en el objeto iconos, donde cada clave corresponde a un tipo de notificación y su valor es un emoji que representa visualmente el tipo de mensaje.
  const estilos = {
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-white",
    success: "bg-green-600 text-white",
    info: "bg-blue-600 text-white",
  };

  // Los iconos para cada tipo de notificación se definen en el objeto iconos, donde cada clave corresponde a un tipo de notificación y su valor es un emoji que representa visualmente el tipo de mensaje.
  const iconos = {
    error: "🚨",
    warning: "⚠️",
    success: "✅",
    info: "ℹ️",
  };


  // El componente renderiza una tarjeta con un título y una descripción, junto con un botón para mostrar u ocultar el formulario de registro. Si el estado visible es true, se muestra el formulario con los campos necesarios para registrar un nuevo administrador, así como mensajes de error o éxito según corresponda. El botón para registrar al nuevo administrador se deshabilita mientras se está realizando la solicitud a la API para evitar múltiples envíos.
  return (
    <div className={`flex items-start gap-3 px-5 py-4 rounded-xl shadow-lg max-w-sm ${estilos[tipo]} animate-slide-in`}>
      <span className="text-xl flex-shrink-0">{iconos[tipo]}</span>
      <div className="flex-1">
        <p className="text-sm font-medium leading-snug">{mensaje}</p>
      </div>
      <button
        onClick={onCerrar}
        className="text-white opacity-70 hover:opacity-100 transition-opacity text-lg leading-none flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}


// La interfaz ToastItem define la estructura de un objeto de notificación, que incluye un id único, el mensaje a mostrar y el tipo de notificación. La interfaz ToastContainerProps define las props que recibe el componente ToastContainer, que incluyen una lista de notificaciones (toasts) y una función onCerrar para cerrar una notificación específica.
interface ToastItem {
  id: number;
  mensaje: string;
  tipo: "error" | "warning" | "success" | "info";
}


// La interfaz ToastItem define la estructura de un objeto de notificación, que incluye un id único, el mensaje a mostrar y el tipo de notificación. La interfaz ToastContainerProps define las props que recibe el componente ToastContainer, que incluyen una lista de notificaciones (toasts) y una función onCerrar para cerrar una notificación específica.
interface ToastContainerProps {
  toasts: ToastItem[];
  onCerrar: (id: number) => void;
}


// El componente ToastContainer es un contenedor que muestra una lista de notificaciones. Recibe una lista de notificaciones (toasts) y una función onCerrar para cerrar una notificación específica. El componente renderiza cada notificación utilizando el componente Toast, pasando el mensaje, el tipo y la función de cierre correspondiente a cada notificación.
export function ToastContainer({ toasts, onCerrar }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} mensaje={t.mensaje} tipo={t.tipo} onCerrar={() => onCerrar(t.id)} />
      ))}
    </div>
  );
}


// El hook useToast proporciona una forma de agregar y cerrar notificaciones desde otros componentes. Utiliza el hook useState para mantener una lista de notificaciones (toasts) y define dos funciones: agregar para agregar una nueva notificación a la lista y cerrar para eliminar una notificación específica de la lista. La función agregar genera un id único para cada notificación utilizando Date.now() y agrega la nueva notificación a la lista, mientras que la función cerrar filtra la lista para eliminar la notificación con el id especificado.
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);


  // La función agregar genera un id único para cada notificación utilizando Date.now() y agrega la nueva notificación a la lista, mientras que la función cerrar filtra la lista para eliminar la notificación con el id especificado.
  function agregar(mensaje: string, tipo: "error" | "warning" | "success" | "info" = "info") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
  }


  // La función cerrar filtra la lista para eliminar la notificación con el id especificado.
  function cerrar(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // El hook devuelve la lista de notificaciones (toasts) y las funciones agregar y cerrar para que puedan ser utilizadas en otros componentes.
  return { toasts, agregar, cerrar };
}