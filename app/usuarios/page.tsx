"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usuariosService } from "@/lib/api";

// Mapeo de roles para mostrar etiquetas legibles y colores asociados
const ROL_LABEL: Record<string, string> = {
  ES: "Estudiante",
  DO: "Docente",
  AD: "Administrador",
};


// Colores para cada rol en las etiquetas
const ROL_COLOR: Record<string, string> = {
  ES: "bg-blue-100 text-blue-700",
  DO: "bg-green-100 text-green-700",
  AD: "bg-purple-100 text-purple-700",
};


// Componente principal de la página de gestión de usuarios
export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [pagina, setPagina] = useState(0);
  const POR_PAGINA = 15;

  // Efecto para verificar autenticación y cargar usuarios al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const data = localStorage.getItem("usuario");
    if (!token || !data) { router.push("/login"); return; }
    const user = JSON.parse(data);
    if (user.usertype_id !== "AD") { router.push("/dashboard"); return; }
    cargarUsuarios();
  }, [router]);


  // Efecto para aplicar filtros de búsqueda y rol cada vez que cambian los criterios o la lista de usuarios
  useEffect(() => {
    let resultado = usuarios;
    if (busqueda) {
      const b = busqueda.toLowerCase();
      resultado = resultado.filter((u: any) =>
        u.name1?.toLowerCase().includes(b) ||
        u.last_name1?.toLowerCase().includes(b) ||
        u.email?.toLowerCase().includes(b) ||
        u.code?.toLowerCase().includes(b)
      );
    }
    // Si se ha seleccionado un filtro de rol, se aplica al resultado
    if (filtroRol) {
      resultado = resultado.filter((u: any) => u.usertype_id === filtroRol);
    }
    setFiltrados(resultado);
    setPagina(0);
  }, [busqueda, filtroRol, usuarios]);

  // Función para cargar la lista de usuarios desde el servicio API y manejar estados de carga y error
  async function cargarUsuarios() {
    setCargando(true);
    try {
      const data = await usuariosService.obtenerTodos();
      setUsuarios(data);
      setFiltrados(data);
    } catch {
      setUsuarios([]);
      setFiltrados([]);
    } finally {
      setCargando(false);
    }
  }

  // Cálculo de los usuarios a mostrar en la página actual según la paginación
  const paginados = filtrados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);
  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);

  // Renderizado de la interfaz de gestión de usuarios con filtros, tabla y paginación
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-700 font-bold text-sm">U</span>
          </div>
          <span className="font-bold text-lg">SIGEU</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-red-200 hover:text-white transition-colors">
          ← Volver al dashboard
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-500 mt-1">
              {filtrados.length} usuarios encontrados de {usuarios.length} totales
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, código o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Todos los roles</option>
              <option value="ES">Estudiantes</option>
              <option value="DO">Docentes</option>
              <option value="AD">Administradores</option>
            </select>
            <button
              onClick={() => { setBusqueda(""); setFiltroRol(""); }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {cargando ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : paginados.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No se encontraron usuarios.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Usuario</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Código</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Correo</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Celular</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginados.map((u: any) => (
                  <tr key={u.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-700 font-bold text-xs">
                            {u.name1?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {u.name1} {u.name2 || ""} {u.last_name1} {u.last_name2 || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.code}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500">{u.cellphone || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ROL_COLOR[u.usertype_id] || "bg-gray-100 text-gray-600"}`}>
                        {ROL_LABEL[u.usertype_id] || u.usertype_id}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
  
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Página {pagina + 1} de {totalPaginas}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagina(p => Math.max(0, p - 1))}
                  disabled={pagina === 0}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))}
                  disabled={pagina >= totalPaginas - 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}