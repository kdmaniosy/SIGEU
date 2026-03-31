import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-700 font-bold text-sm">U</span>
        </div>
        <span className="font-bold text-lg tracking-wide">SIGEU</span>
      </Link>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link href="/#features" className="hover:text-red-200 transition-colors">Características</Link>
        <Link href="/#how" className="hover:text-red-200 transition-colors">Cómo funciona</Link>
        <Link href="/#contact" className="hover:text-red-200 transition-colors">Contacto</Link>
      </div>
      <Link href="/login" className="bg-white text-red-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
        Iniciar sesión
      </Link>
    </nav>
  );
}
