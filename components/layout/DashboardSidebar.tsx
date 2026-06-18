"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type Rol = "estudiante" | "docente" | "admin";


// Interfaz para las props del componente
interface Props {
  rol: Rol;
  usuario: { code: string; name1: string; usertype_id: string };
}


// Mapeo para mostrar el rol del usuario con etiquetas legibles
const ROL_LABEL: Record<Rol, string> = {
  estudiante: "Estudiante",
  docente: "Docente",
  admin: "Administrador",
};


// Colores para cada rol de usuario
const ROL_COLOR: Record<Rol, string> = {
  estudiante: "bg-blue-100 text-blue-700",
  docente: "bg-green-100 text-green-700",
  admin: "bg-purple-100 text-purple-700",
};



// Componente principal del sidebar del dashboard
export default function DashboardSidebar({ rol, usuario }: Props) {
  const router = useRouter();
  const pathname = usePathname();


  // Función para cerrar sesión: limpia el token y redirige al login
  function handleCerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  }


  // Definir los elementos del menú según el rol del usuario
  const menuItems = [
    { icon: "🏠", label: "Inicio",            href: "/dashboard" },
    { icon: "📅", label: "Mis reservas",      href: "/dashboard/mis-reservas" },
    { icon: "🔍", label: "Reservar espacios", href: "/reservas" },
    { icon: "📊", label: "Estadísticas",      href: "/dashboard/estadisticas" },
    ...(rol === "admin"
      ? [{ icon: "👥", label: "Usuarios", href: "/usuarios" }]
      : []),
    { icon: "⚙️", label: "Configuración",    href: "/dashboard/configuracion" },
  ];

  // Renderizar el sidebar con la información del usuario y el menú de navegación
  return (
    <aside className="w-64 min-h-screen bg-red-700 text-white flex flex-col">
      <div className="p-6 border-b border-red-600">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-700 font-bold text-sm">U</span>
          </div>
          <span className="font-bold text-lg">SIGEU</span>
        </Link>
      </div>

      <div className="p-4 border-b border-red-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {usuario.name1.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{usuario.name1}</p>
            <p className="text-red-200 text-xs">{usuario.code}</p>
          </div>
        </div>
        <div className="mt-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ROL_COLOR[rol]}`}>
            {ROL_LABEL[rol]}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-red-200 text-xs mb-3 uppercase tracking-widest">Menú</p>
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const activo = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activo
                    ? "bg-white text-red-700 font-semibold"
                    : "text-red-100 hover:bg-red-600"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-red-600">
        <button
          onClick={handleCerrarSesion}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-100 hover:bg-red-600 transition-colors w-full"
        >
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
