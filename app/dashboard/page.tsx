"use client";
import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardEstudiante from "@/components/layout/DashboardEstudiante";
import DashboardDocente from "@/components/layout/DashboardDocente";
import DashboardAdmin from "@/components/layout/DashboardAdmin";

type Rol = "estudiante" | "docente" | "admin";

export default function DashboardPage() {
  const [rol, setRol] = useState<Rol>("estudiante");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar rol={rol} setRol={setRol} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {rol === "estudiante" && <DashboardEstudiante />}
          {rol === "docente" && <DashboardDocente />}
          {rol === "admin" && <DashboardAdmin />}
        </div>
      </main>
    </div>
  );
}