export default function ReservasFiltros() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de espacio
          </label>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Todos</option>
            <option value="aula">Aulas</option>
            <option value="laboratorio">Laboratorios</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacidad mínima
          </label>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Cualquiera</option>
            <option value="10">10 personas</option>
            <option value="20">20 personas</option>
            <option value="30">30 personas</option>
            <option value="50">50 personas</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full sm:w-auto bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors">
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}