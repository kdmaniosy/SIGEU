export default function Navbar() {
  return (
    <nav className="w-full bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-700 font-bold text-sm">U</span>
        </div>
        <span className="font-bold text-lg tracking-wide">SIGEU</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <a href="#features" className="hover:text-red-200 transition-colors">Características</a>
        <a href="#how" className="hover:text-red-200 transition-colors">Cómo funciona</a>
        <a href="#contact" className="hover:text-red-200 transition-colors">Contacto</a>
      </div>
      <a href="/login" className="bg-white text-red-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
        Iniciar sesión
      </a>
    </nav>
  );
}