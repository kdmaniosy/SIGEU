import Link from "next/link";

type Rol = "estudiante" | "docente" | "admin";

interface Props {
  rol: Rol;
  setRol: (rol: Rol) => void;
}

export default function DashboardSidebar({ rol, setRol }: Props) {
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
        <p className="text-red-200 text-xs mb-2 uppercase tracking-widest">
          Ver como
        </p>
        <div className="flex flex-col gap-2">
          {(["estudiante", "docente", "admin"] as Rol[]).map((r) => (
            <button
              key={r}
              onClick={() => setRol(r)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                rol === r
                  ? "bg-white text-red-700"
                  : "text-red-100 hover:bg-red-600"
              }`}
            >
              {r === "admin" ? "Administrador" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-red-200 text-xs mb-3 uppercase tracking-widest">
          Menú
        </p>
        <div className="flex flex-col gap-1">
          {[
            { icon: "🏠", label: "Inicio", href: "/dashboard" },
            { icon: "📅", label: "Mis reservas", href: "/dashboard" },
            { icon: "🔍", label: "Buscar espacios", href: "/reservas" },
            { icon: "📊", label: "Estadísticas", href: "/dashboard" },
            { icon: "⚙️", label: "Configuración", href: "/dashboard" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-100 hover:bg-red-600 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-red-600">
        <Link href="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-100 hover:bg-red-600 transition-colors w-full">
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
}