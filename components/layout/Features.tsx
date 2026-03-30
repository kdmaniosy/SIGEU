const features = [
  {
    icon: "🏫",
    title: "Reserva de aulas",
    description: "Consulta la disponibilidad y reserva aulas del edificio en pocos clics.",
  },
  {
    icon: "🔬",
    title: "Reserva de laboratorios",
    description: "Gestiona el acceso a laboratorios especializados con horarios claros.",
  },
  {
    icon: "📅",
    title: "Calendario en tiempo real",
    description: "Visualiza todos los espacios disponibles en un calendario actualizado.",
  },
  {
    icon: "🔔",
    title: "Notificaciones",
    description: "Recibe confirmaciones y recordatorios de tus reservas al instante.",
  },
  {
    icon: "👥",
    title: "Gestión de usuarios",
    description: "Roles para estudiantes, docentes y administradores del edificio.",
  },
  {
    icon: "📊",
    title: "Reportes de uso",
    description: "Visualiza estadísticas de ocupación y optimiza el uso de los espacios.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            SIGEU centraliza la gestión de espacios para que docentes y estudiantes puedan organizarse sin complicaciones.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}