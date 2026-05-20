"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  code: string;
  name1: string;
  usertype_id: string;
}

const ROL_LABEL: Record<string, string> = {
  ES: "Estudiante",
  DO: "Docente",
  AD: "Administrador",
};

export default function Navbar() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (data && token) {
      try {
        setUsuario(JSON.parse(data));
      } catch {
        setUsuario(null);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickFuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  function handleCerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setMenuAbierto(false);
    router.push("/");
  }

  return (
    <nav className="w-full bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-700 font-bold text-sm">U</span>
        </div>
        <span className="font-bold text-lg tracking-wide">SIGEU</span>
      </Link>

      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link href="/#features" className="hover:text-red-200 transition-colors">Características</Link>
        <Link href="/#how" className="hover:text-red-200 transition-colors">Cómo funciona</Link>
        <Link href="/#contact" className="hover:text-red-200 transition-colors">Contacto</Link>
      </div>

      {usuario ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 transition-colors px-3 py-2 rounded-lg"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-700 font-bold text-sm">
                {usuario.name1.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{usuario.name1}</p>
              <p className="text-xs text-red-200 leading-tight">
                {ROL_LABEL[usuario.usertype_id] || "Usuario"}
              </p>
            </div>
            <span className="text-red-200 text-xs ml-1">▼</span>
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{usuario.name1}</p>
                <p className="text-xs text-gray-500">{usuario.code}</p>
                <p className="text-xs text-red-600 font-medium mt-0.5">
                  {ROL_LABEL[usuario.usertype_id]}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>🏠</span> Mi dashboard
                </Link>
                <Link
                  href="/reservas"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>📅</span> Mis reservas
                </Link>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleCerrarSesion}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <span>🚪</span> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-white text-red-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
        >
          Iniciar sesión
        </Link>
      )}
    </nav>
  );
}