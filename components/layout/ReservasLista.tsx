const espacios = [
  {
    id: 1,
    nombre: "Aula 101",
    tipo: "Aula",
    capacidad: 30,
    piso: 1,
    disponible: true,
    equipamiento: ["Proyector", "Aire acondicionado", "Pizarrón"],
  },
  {
    id: 2,
    nombre: "Aula 203",
    tipo: "Aula",
    capacidad: 20,
    piso: 2,
    disponible: false,
    equipamiento: ["Proyector", "Pizarrón"],
  },
  {
    id: 3,
    nombre: "Laboratorio de Sistemas",
    tipo: "Laboratorio",
    capacidad: 25,
    piso: 3,
    disponible: true,
    equipamiento: ["Computadoras", "Proyector", "Aire acondicionado"],
  },
  {
    id: 4,
    nombre: "Laboratorio de Electrónica",
    tipo: "Laboratorio",
    capacidad: 20,
    piso: 3,
    disponible: true,
    equipamiento: ["Equipos electrónicos", "Osciloscopios", "Pizarrón"],
  },
  {
    id: 5,
    nombre: "Aula Magna",
    tipo: "Aula",
    capacidad: 100,
    piso: 1,
    disponible: false,
    equipamiento: ["Proyector", "Sistema de sonido", "Aire acondicionado"],
  },
  {
    id: 6,
    nombre: "Aula 305",
    tipo: "Aula",
    capacidad: 30,
    piso: 3,
    disponible: true,
    equipamiento: ["Proyector", "Pizarrón"],
  },
];

export default function ReservasLista() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {espacios.map((espacio) => (
        <div
          key={espacio.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{espacio.nombre}</h3>
              <span className="text-xs text-gray-500">Piso {espacio.piso}</span>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                espacio.disponible
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {espacio.disponible ? "Disponible" : "Ocupado"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>👥 {espacio.capacidad} personas</span>
            <span>🏷️ {espacio.tipo}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {espacio.equipamiento.map((item) => (
              <span
                key={item}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
              >
                {item}
              </span>
            ))}
          </div>
          <button
            disabled={!espacio.disponible}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
              espacio.disponible
                ? "bg-red-700 text-white hover:bg-red-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {espacio.disponible ? "Reservar" : "No disponible"}
          </button>
        </div>
      ))}
    </div>
  );
}