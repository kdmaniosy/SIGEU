export default function Footer() {
  return (
    <footer id="contact" className="bg-red-700 text-white py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-lg">SIGEU</span>
          <p className="text-red-200 text-sm mt-1">
            Sistema de Gestión de Espacios Universitarios
          </p>
        </div>
        <p className="text-red-200 text-sm">
          © 2026 Universidad. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}