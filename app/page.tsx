import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-void-black selection:bg-neon-acid selection:text-black">
      
      {/* Ruido de fondo (Efecto analógico/Cámara de seguridad) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

      <div className="z-10 text-center px-4">
        <h2 className="text-chrome font-mono text-sm tracking-[0.3em] uppercase mb-4">
          SYSTEM ONLINE // V 2.0.4
        </h2>
        
        <h1 className="text-7xl md:text-9xl font-bold font-sans uppercase tracking-tighter text-white mb-6 hover:text-neon-acid transition-colors duration-300">
          HEAVY <br /> HARDWARE
        </h1>
        
        <p className="max-w-md mx-auto text-chrome/70 font-mono text-xs md:text-sm mb-10 leading-relaxed">
          EQUIPAMIENTO TÁCTICO Y ÓPTICAS DE VISIÓN NOCTURNA PARA LA ESCENA UNDERGROUND. NO ES MODA, ES SUPERVIVENCIA INDUSTRIAL.
        </p>

        <Link 
          href="/shop" 
          className="inline-block bg-neon-acid text-black font-sans font-bold uppercase tracking-widest px-8 py-4 hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        >
          INICIAR EXTRACCIÓN
        </Link>
      </div>
    </main>
  );
}