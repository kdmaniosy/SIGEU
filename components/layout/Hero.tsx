import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-red-700 to-red-900 text-white py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block bg-red-600 text-red-100 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
          Sistema de Gestión de Espacios Universitarios
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Reserva aulas y laboratorios de forma fácil y rápida
        </h1>
        <p className="text-red-100 text-lg mb-10 max-w-xl mx-auto">
          SIGEU te permite gestionar la disponibilidad de espacios del nuevo edificio de la facultad en tiempo real, sin filas ni papeleos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-white text-red-700 font-bold px-8 py-3 rounded-lg hover:bg-red-50 transition-colors text-sm">
            Comenzar ahora
          </Link>
          <Link href="/#how" className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-red-800 transition-colors text-sm">
            Ver cómo funciona
          </Link>
        </div>
      </div>
    </section>
  );
}