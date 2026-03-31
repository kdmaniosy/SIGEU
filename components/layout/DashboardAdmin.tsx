const reservasRecientes = [
  { id: 1, usuario: "Ana García", rol: "Estudiante", espacio: "Aula 101", fecha: "01/04/2026", hora: "8:00 - 10:00", estado: "Confirmada" },
  { id: 2, usuario: "Prof. Martínez", rol: "Docente", espacio: "Laboratorio de Sistemas", fecha: "01/04/2026", hora: "14:00 - 16:00", estado: "Pendiente" },
  { id: 3, usuario: "Carlos López", rol: "Estudiante", espacio: "Aula 203", fecha: "02/04/2026", hora: "10:00 - 12:00", estado: "Confirmada" },
  { id: 4, usuario: "Prof. Rodríguez", rol: "Docente", espacio: "Aula Magna", fecha: "02/04/2026", hora: "8:00 - 10:00", estado: "Cancelada" },
  { id: 5, usuario: "María Torres", rol: "Estudiante", espacio: "Laboratorio de Electrónica", fecha: "03/04/2026", hora: "16:00 - 18:00", estado: "Pendiente" },
];

const espacios = [
  { nombre: "Aula 101", tipo: "Aula", reservasHoy: 3, disponible: true },
  { nombre: "Aula 203", tipo: "Aula", reservasHoy: 2, disponible: false },
  { nombre: "Laboratorio de Sistemas", tipo: "Laboratorio", reservasHoy: 4, disponible: true },
  { nombre: "Laboratorio de Electrónica", tipo: "Laboratorio", reservasHoy: 1, disponible: true },
  { nombre: "Aula Magna", tipo: "Aula", reservasHoy: 1, disponible: false },
];

const estadoColor: Record<string, string> = {
  Confirmada: "bg-green-100 text-green-700",
  Pendiente: "bg-yellow-100 text-yellow-700",
  Completada: "bg-blue-100 text-blue-700",
  Cancelada: "bg-red-100 text-red-700",
};

export default function DashboardAdmin() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">Gestiona todos los espacios y reservas del edificio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Reservas hoy", valor: "11", icon: "📅", color: "bg-red-50 text-red-700" },
          { label: "Espacios disponibles", valor: "3", icon: "🏫", color: "bg-green-50 text-green-700" },
          { label: "Usuarios registrados", valor: "48", icon: "👥", color: "bg-blue-50 text-blue-700" },
          { label: "Ocupación promedio", valor: "74%", icon: "📊", color: "bg-purple-50 text-purple-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Reservas recientes</h2>
            <button className="text-sm text-red-700 hover:underline font-medium">
              Ver todas
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Usuario</th>
                  <th className="pb-3 font-medium">Espacio</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservasRecientes.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3">
                      <p className="text-gray-900 font-medium">{r.usuario}</p>
                      <p className="text-xs text-gray-400">{r.rol}</p>
                    </td>
                    <td className="py-3 text-gray-500">{r.espacio}</td>
                    <td className="py-3 text-gray-500">
                      <p>{r.fecha}</p>
                      <p className="text-xs">{r.hora}</p>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColor[r.estado]}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-xs text-red-700 hover:underline">Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Estado de espacios</h2>
          <div className="space-y-3">
            {espacios.map((e) => (
              <div key={e.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{e.nombre}</p>
                  <p className="text-xs text-gray-400">{e.reservasHoy} reservas hoy</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  e.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {e.disponible ? "Libre" : "Ocupado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}