import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#2b1b17] font-lora">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#2b1b17]" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" /></svg>
          </div>
          <span className="font-playfair text-xl font-bold tracking-widest">ACADEMIA</span>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-[#5d4037] hover:text-[#d4af37] transition-colors font-bold">Iniciar Sesión</Link>
          <Link href="/registro" className="px-4 py-2 bg-[#d4af37] text-white rounded-lg hover:bg-[#b5902b] transition-colors font-bold shadow-md">Registrarse</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[url('/hero-bg.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-[#2b1b17]/80"></div> {/* Overlay */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-[#f0e6d2] mb-6 animate-fade">
            El Conocimiento es Poder
          </h1>
          <p className="text-xl text-[#d7ccc8] mb-10 leading-relaxed">
            Plataforma educativa integral para alumnos, profesores y escuelas.
            Gestione el aprendizaje, descubra nuevos libros y potencie el futuro.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-8 py-3 bg-[#d4af37] text-white rounded-full font-bold text-lg hover:bg-[#b5902b] transition-transform hover:scale-105 shadow-lg">
              Comenzar Ahora
            </Link>
            <Link href="/registro" className="px-8 py-3 bg-transparent border-2 border-[#d4af37] text-[#d4af37] rounded-full font-bold text-lg hover:bg-[#d4af37] hover:text-white transition-all">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="font-playfair text-3xl font-bold text-center mb-16 relative">
          <span className="relative z-10 bg-[#f5f5f5] px-4">Nuestros Servicios</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-[#d7ccc8] -z-0"></div>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Para Alumnos"
            desc="Accede a tu biblioteca digital, realiza compras y sigue tu progreso académico en tiempo real."
            icon="book"
          />
          <FeatureCard
            title="Para Profesores"
            desc="Monitorea el rendimiento de tus estudiantes, asigna lecturas y gestiona tus clases eficientemente."
            icon="chart"
          />
          <FeatureCard
            title="Para Escuelas"
            desc="Administración total de la institución, maestros y alumnos desde un panel centralizado."
            icon="building"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2b1b17] text-[#a1887f] py-8 text-center">
        <p>© 2026 Academia Lector. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-[#e3dac9]">
      <div className="w-14 h-14 bg-[#f0e6d2] rounded-lg flex items-center justify-center mb-6 text-[#d4af37]">
        {icon === 'book' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
        {icon === 'chart' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>}
        {icon === 'building' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m0 0h10m0 0v3m-10-3h10m-6 0a1 1 0 00-1 1v3h2v-3a1 1 0 00-1-1z"></path></svg>}
      </div>
      <h3 className="font-playfair text-xl font-bold mb-3 text-[#2b1b17]">{title}</h3>
      <p className="text-[#5d4037] leading-relaxed">{desc}</p>
    </div>
  )
}
