'use client';
import React, { useEffect, useState } from 'react';

export default function GlosarioTutorialModal({ 
  hideTutorial, 
  onClose 
}: { 
  hideTutorial: boolean; 
  onClose: (dontShowAgain: boolean) => void; 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (!hideTutorial) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hideTutorial]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(dontShowAgain);
    }, 400); // Mismo tiempo que la animación de salida
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop Blur claro */}
      <div 
        className="absolute inset-0 bg-[#0a0a0a]/30 backdrop-blur-sm transition-opacity duration-400 ease-in-out"
        style={{ opacity: isClosing ? 0 : 1 }}
        onClick={handleClose}
      />
      
      {/* Contenido de la Tarjeta */}
      <div 
        className="relative w-full max-w-sm bg-[#14100d] border border-[#d4af37]/40 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
        style={{ 
          animation: isClosing ? 'fadeOutScale 0.4s forwards' : 'scaleInModal 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.1), transparent 80%), linear-gradient(to bottom, #181512 0%, #0d0a08 100%)'
        }}
      >
        <div className="p-8 pb-7 flex flex-col items-center text-center">
          {/* Íconos flotantes */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            {/* Ondas radiales de pulso */}
            <div className="absolute inset-0 bg-[#d4af37]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 bg-[#d4af37]/30 rounded-full animate-pulse" />
            
            {/* Círculo central metálico */}
            <div className="relative w-14 h-14 bg-gradient-to-br from-[#fde68a] to-[#d4af37] flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              {/* Reflejo estilo vidrio interior */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-white/30" />
              <svg className="w-6 h-6 text-[#171717] drop-shadow-sm relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" opacity="0.4"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </div>

          {/* Título elegante */}
          <h2 className="font-playfair text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fde68a] via-[#d4af37] to-[#f5d060] mb-3">
            Herramientas de Estudio
          </h2>
          
          {/* Descripción de las herramientas */}
          <div className="font-lora text-[13px] text-white/70 leading-relaxed mb-8 flex flex-col gap-4 text-left w-full mt-3">
            <p>
              ¡Tienes dos formas de usar tus herramientas de estudio!
            </p>
            <ul className="flex flex-col gap-4 pl-1">
              <li className="flex gap-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shadow-[0_0_5px_rgba(212,175,55,0.8)] shrink-0" />
                <div>
                  <strong className="text-[#f5d060] font-playfair tracking-wide block mb-[2px] uppercase text-[11px]">1. Al Seleccionar el Texto</strong>
                  <span>Aparece un menú rápido flotante. Puedes usar un <strong>Marcador</strong>, guardar <strong>Notas</strong>, o seleccionar <strong className="text-white">una única palabra</strong> y pulsar <strong>Definir</strong> para usar el diccionario.</span>
                </div>
              </li>
              <li className="flex gap-2.5 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shadow-[0_0_5px_rgba(212,175,55,0.8)] shrink-0" />
                <div>
                  <strong className="text-[#f5d060] font-playfair tracking-wide block mb-[2px] uppercase text-[11px]">2. Panel Flotante Lateral</strong>
                  <span>Te permite aplicar marcadores y tomar notas de una forma mucho más dinámica, inmersiva y rápida mientras vas leyendo.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Checkbox para no volver a mostrar */}
          <div className="w-full flex items-center justify-start gap-3 mt-1 mb-5 px-2">
             <label className="flex items-center gap-2 cursor-pointer group">
               <div className="relative flex items-center justify-center w-4 h-4 rounded border border-[#d4af37]/50 bg-[#0a0a0a]/50 group-hover:border-[#f5d060] transition-colors">
                 <input 
                   type="checkbox" 
                   className="absolute w-full h-full opacity-0 cursor-pointer"
                   checked={dontShowAgain}
                   onChange={(e) => setDontShowAgain(e.target.checked)}
                 />
                 {dontShowAgain && (
                   <svg className="w-3 h-3 text-[#f5d060]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <polyline points="20 6 9 17 4 12" />
                   </svg>
                 )}
               </div>
               <span className="text-white/50 text-[11px] font-lora group-hover:text-white/80 transition-colors uppercase tracking-wider">
                 No volver a mostrar
               </span>
             </label>
          </div>

          {/* Botón premium iterativo */}
          <button 
            onClick={handleClose}
            className="group relative w-full overflow-hidden rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 py-3.5 px-4 transition-all duration-300 hover:border-[#d4af37] hover:bg-[#d4af37]/20 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
          >
            {/* Barrido de luz hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 font-bold uppercase tracking-[0.15em] text-[11px] text-[#fde68a]">
              ¡Entendido, a leer!
            </span>
          </button>
        </div>

        {/* Decoraciones de vidrio / Gold Foil esquinas */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#d4af37]/10 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#d4af37]/10 to-transparent opacity-50 pointer-events-none" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeOutScale {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.95) translateY(15px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
