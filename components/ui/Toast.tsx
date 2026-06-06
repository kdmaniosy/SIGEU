"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  mensaje: string;
  tipo: "error" | "warning" | "success" | "info";
  onCerrar: () => void;
}

export function Toast({ mensaje, tipo, onCerrar }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onCerrar, 5000);
    return () => clearTimeout(timer);
  }, [onCerrar]);

  const estilos = {
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-white",
    success: "bg-green-600 text-white",
    info: "bg-blue-600 text-white",
  };

  const iconos = {
    error: "🚨",
    warning: "⚠️",
    success: "✅",
    info: "ℹ️",
  };

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

interface ToastItem {
  id: number;
  mensaje: string;
  tipo: "error" | "warning" | "success" | "info";
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onCerrar: (id: number) => void;
}

export function ToastContainer({ toasts, onCerrar }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} mensaje={t.mensaje} tipo={t.tipo} onCerrar={() => onCerrar(t.id)} />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function agregar(mensaje: string, tipo: "error" | "warning" | "success" | "info" = "info") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
  }

  function cerrar(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, agregar, cerrar };
}