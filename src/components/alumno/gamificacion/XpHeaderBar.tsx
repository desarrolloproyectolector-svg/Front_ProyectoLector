'use client';

import { useState, useEffect, useCallback } from 'react';
import { GamificacionService } from '../../../service/alumno/gamificacion.service';
import { ProgresoGamificacion } from '../../../types/alumno/gamificacion';
import { getNivelConfig, NIVEL_CONFIG } from '../../../utils/gamificacion.constants';
import { GamificacionIcon } from '../../ui/GamificacionIcon';

interface NivelUpState {
  nivelNuevo: number;
  nombreNivel: string;
  icono: string;
  color: string;
}

// ── Celebración al subir de nivel (Confetti/Card modal) ────────────────────────
function NivelUpOverlay({ info, onDone }: { info: NivelUpState; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-[#0a1628]/40 backdrop-blur-sm" />
      <div
        className="animate-nivel-up relative rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full mx-4 pointer-events-auto border bg-white"
        style={{ borderColor: '#c8d8f0' }}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-[#3b82f6]/10 border border-[#3b82f6]/25"
        >
          <GamificacionIcon name={info.icono} className="w-8 h-8" strokeColor="#3b82f6" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-[#3b82f6]">
          ¡Subiste de nivel!
        </p>
        <h2 className="font-playfair text-3xl font-black text-[#0a1628] mb-1">
          {info.nombreNivel}
        </h2>
        <p className="text-sm text-[#6b8cba] font-lora italic">Nivel {info.nivelNuevo} desbloqueado</p>
        <button
          onClick={onDone}
          className="mt-6 text-xs text-[#6b8cba] hover:text-[#0a1628] font-bold transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// ── Tooltip desplegable con la progresión de niveles ──────────────────────────
function NivelTooltip({ actual, onClose }: { actual: number; onClose: () => void }) {
  useEffect(() => {
    const clickHandler = () => onClose();
    window.addEventListener('click', clickHandler);
    return () => window.removeEventListener('click', clickHandler);
  }, [onClose]);

  return (
    <div
      className="absolute top-full right-0 mt-2 bg-white rounded-2xl p-4 shadow-xl w-72 z-50 border border-[#c8d8f0]"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-[11px] uppercase tracking-widest text-[#0a1628] mb-3.5 font-bold border-b border-[#c8d8f0]/40 pb-2">
        Progresión de niveles
      </p>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
        {NIVEL_CONFIG.map(n => (
          <div
            key={n.nivel}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
              n.nivel === actual ? 'bg-[#3b82f6]/10 font-bold' : 'hover:bg-gray-50/60'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                n.nivel === actual ? 'bg-[#3b82f6]/20' : 'bg-gray-100'
              }`}
            >
              <GamificacionIcon
                name={n.icono}
                className="w-4 h-4"
                strokeColor={n.nivel === actual ? '#3b82f6' : '#6b8cba'}
              />
            </div>
            <span
              className={`text-sm flex-1 ${n.nivel === actual ? 'text-[#0a1628] font-bold' : 'text-[#6b8cba] font-medium'}`}
            >
              {n.nombre}
            </span>
            <span
              className={`text-xs ${
                n.nivel === actual ? 'text-[#3b82f6] font-semibold' : 'text-[#6b8cba]/50 font-medium'
              }`}
            >
              Niv.{n.nivel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Componente principal (Píldora del Header, elegante y responsive) ───────────
export default function XpHeaderBar() {
  const [progreso,    setProgreso]    = useState<ProgresoGamificacion | null>(null);
  const [animateBar,  setAnimateBar]  = useState(false);
  const [nivelUp,     setNivelUp]     = useState<NivelUpState | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const fetchProgreso = useCallback(async () => {
    try {
      const data = await GamificacionService.getProgreso();
      setProgreso(data);
      setTimeout(() => setAnimateBar(true), 150);
    } catch { /* Sin datos */ }
  }, []);

  useEffect(() => {
    fetchProgreso();

    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail ?? {};
      if (detail.subioNivel && detail.nivelNuevo) {
        const cfg = getNivelConfig(Number(detail.nivelNuevo));
        setNivelUp({
          nivelNuevo:  cfg.nivel,
          nombreNivel: cfg.nombre,
          icono:       cfg.icono,
          color:       cfg.color,
        });
      }
      fetchProgreso();
    };

    window.addEventListener('gamificacion-update', handleUpdate);
    return () => window.removeEventListener('gamificacion-update', handleUpdate);
  }, [fetchProgreso]);

  if (!progreso) return null;

  const localCfg   = getNivelConfig(progreso.nivelActual);
  const iconoNombre = progreso.nivel?.icono ?? localCfg.icono;
  const nombreNivel = progreso.nivel?.nombre ?? localCfg.nombre;
  const pct         = progreso.porcentajeNivel;
  const isMax       = progreso.nivelActual >= 10;

  return (
    <>
      <div
        className="relative flex items-center gap-0 sm:gap-3.5 bg-white/95 backdrop-blur border border-[#c8d8f0]/60 rounded-full p-1 sm:px-4 sm:py-2 shadow-sm cursor-pointer select-none"
        onClick={e => {
          e.stopPropagation();
          setShowTooltip(v => !v);
        }}
      >
        {/* Ícono de nivel actual (SVG) */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex-shrink-0 relative"
        >
          <GamificacionIcon name={iconoNombre} className="w-5 h-5" strokeColor="#3b82f6" />
          {/* Badge del nivel que solo se muestra en móvil */}
          <span className="absolute -bottom-1 -right-1 bg-[#3b82f6] text-white text-[8px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white sm:hidden">
            {progreso.nivelActual}
          </span>
        </div>

        {/* Nivel y Barra de progreso (Sólo visible desde tabletas/PC en adelante) */}
        <div className="min-w-0 flex-col justify-center hidden sm:flex">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold text-[#0a1628] leading-none">
              {nombreNivel}
            </span>
            <span className="text-xs font-medium text-[#3b82f6] leading-none">
              Niv.{progreso.nivelActual}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-20 sm:w-32 h-2 bg-[#c8d8f0]/40 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] transition-all duration-1000 ease-out"
                style={{ width: animateBar ? `${pct}%` : '0%' }}
              />
            </div>
            <span className="text-[10px] font-medium text-[#3b82f6] leading-none">
              {isMax ? 'Máx' : `${pct}%`}
            </span>
          </div>
        </div>

        {/* Separador vertical - Oculto en móviles y tablets */}
        <div className="w-px h-7 bg-[#c8d8f0]/60 flex-shrink-0 hidden md:block" />

        {/* Racha - Oculto en móviles y tablets */}
        <div className="items-center gap-1.5 flex-shrink-0 hidden md:flex">
          <GamificacionIcon name="fire" className="w-5 h-5" strokeColor="#d4af37" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-medium text-[#0a1628]">{progreso.rachaActual}</span>
            <span className="text-[9px] text-[#6b8cba] font-bold uppercase tracking-wider">días</span>
          </div>
        </div>

        {/* XP Total - Oculto en tabletas/móviles pequeños (sólo laptops/pantallas grandes) */}
        <div className="w-px h-7 bg-[#c8d8f0]/60 flex-shrink-0 hidden lg:block" />
        <div className="items-center gap-1.5 flex-shrink-0 hidden lg:flex">
          <GamificacionIcon name="zap" className="w-5 h-5" strokeColor="#3b82f6" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-medium text-[#0a1628]">
              {progreso.puntosTotales.toLocaleString('es-MX')}
            </span>
            <span className="text-[9px] text-[#6b8cba] font-bold uppercase tracking-wider">XP</span>
          </div>
        </div>

        {/* Tooltip de progresión */}
        {showTooltip && (
          <NivelTooltip actual={progreso.nivelActual} onClose={() => setShowTooltip(false)} />
        )}
      </div>

      {/* Celebración de nivel nuevo */}
      {nivelUp && (
        <NivelUpOverlay info={nivelUp} onDone={() => setNivelUp(null)} />
      )}
    </>
  );
}
