import Navbar from "@/components/layout/Navbar";
import ReservasFiltros from "@/components/layout/ReservasFiltros";
import ReservasLista from "@/components/layout/ReservasLista";
import ReservasFormulario from "@/components/layout/ReservasFormulario";

export default function ReservasPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reserva un espacio</h1>
          <p className="text-gray-500 mt-2">
            Selecciona el aula o laboratorio que necesitas y elige tu horario.
          </p>
        </div>
        <ReservasFiltros />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReservasLista />
          </div>
          <div>
            <ReservasFormulario />
          </div>
        </div>
      </div>
    </main>
  );
}