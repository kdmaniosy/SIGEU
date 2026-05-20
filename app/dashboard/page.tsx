"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardEstudiante from "@/components/layout/DashboardEstudiante";
import DashboardDocente from "@/components/layout/DashboardDocente";
import DashboardAdmin from "@/components/layout/DashboardAdmin";

type Rol = "estudiante" | "docente" | "admin";

interface UsuarioSesion {
  code: string;
  name1: string;
  usertype_id: string;
}

const ROL_MAP: Record<string, Rol> = {
  ES: "estudiante",
  DO: "docente",
  AD: "admin",
};

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [rol, setRol] = useState<Rol | null>(null);
  const inicializado = useRef(false);

  useEffect(() => {
    if (inicializado.current) return;
    inicializado.current = true;

    const token = localStorage.getItem("token");
    const data = localStorage.getItem("usuario");

    if (!token || !data) {
      router.push("/login");
      return;
    }

    try {
      const user: UsuarioSesion = JSON.parse(data);
      setUsuario(user);
      setRol(ROL_MAP[user.usertype_id] ?? "estudiante");
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!rol || !usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar rol={rol} usuario={usuario} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {rol === "estudiante" && <DashboardEstudiante usuario={usuario} />}
          {rol === "docente" && <DashboardDocente usuario={usuario} />}
          {rol === "admin" && <DashboardAdmin />}
        </div>
      </main>
    </div>
  );
}