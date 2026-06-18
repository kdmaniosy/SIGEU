// Componente para el footer del sitio web

export default function Footer() {
  return (
    <footer id="contact" className="bg-red-700 text-white pt-10 pb-6 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Marca */}
        <div>
          <span className="font-medium text-xl tracking-wide">
            SIGEU <span className="text-red-300 text-sm font-normal">v1.0</span>
          </span>
          <p className="text-red-200 text-sm mt-2 leading-relaxed max-w-xs">
            Sistema de Gestión de Espacios Universitarios. Monitoreo de aforo y reservas en tiempo real.
          </p>
        </div>

        <div>
          
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-red-300 text-xs uppercase tracking-widest mb-3">Contacto</h4>
          <ul className="flex flex-col gap-2 text-red-100 text-sm">
            <li>✉ ufpsosigeu@gmail.com</li>
            <li>📞 +57 3154292440</li>
            <li>📍 Ocaña, Colombia</li>
          </ul>
          <h4 className="text-red-300 text-xs uppercase tracking-widest mt-5 mb-3">Institucional</h4>
          <nav className="flex flex-col gap-2">
            <a href="#" className="text-red-100 text-sm hover:text-white transition-colors">https://ufpso.edu.co/</a>
          </nav>
        </div>
      </div>

      <hr className="max-w-5xl mx-auto mt-8 border-white/20" />

      <div className="max-w-5xl mx-auto mt-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-red-200 text-xs">© 2026 Universidad. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}