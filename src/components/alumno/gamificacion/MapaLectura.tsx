'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapaLecturaService } from '../../../service/alumno/mapaLectura.service';
import { MapaTextoDetalle } from '../../../types/alumno/gamificacion';
import { GamificacionIcon } from '../../ui/GamificacionIcon';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getComprensionColor(pct: number, enCurso: boolean = false): string {
  if (pct === 0 && !enCurso) return '#94a3b8'; // Gris neutral para libros no iniciados
  if (pct >= 80) return '#4caf50';
  if (pct >= 60) return '#f97316';
  return '#ef4444';
}

function getComprensionLabel(pct: number): string {
  if (pct >= 80) return 'Alta comprensión';
  if (pct >= 60) return 'Comprensión media';
  return 'Comprensión baja';
}

function getDificultadLabel(n: number): string {
  return ['', 'Básico', 'Elemental', 'Intermedio', 'Avanzado', 'Experto'][n] ?? 'Intermedio';
}

function formatMins(mins: number): string {
  if (mins === 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatDateSafe(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

// ── Panel modal centrado de detalle (Rediseñado para mayor énfasis y estética premium) ──
function PanelDetalle({ texto, onClose }: { texto: MapaTextoDetalle; onClose: () => void }) {
  const color = getComprensionColor(texto.comprensionPromedio);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Fondo oscuro traslúcido y blur */}
      <div 
        className="fixed inset-0 z-50 bg-[#0a1628]/45 backdrop-blur-[4px] transition-all duration-300" 
        onClick={onClose} 
        aria-hidden 
      />

      {/* Contenedor del Modal Centrado */}
      <div className="fixed inset-0 z-[51] flex items-center justify-center pointer-events-none p-4">
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col pointer-events-auto border border-[#c8d8f0]/50 max-h-[85vh]"
          style={{ 
            animation: 'scaleInModal 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            boxShadow: '0 20px 50px -12px rgba(10, 22, 40, 0.15)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header del modal */}
          <div
            className="px-6 py-5 relative overflow-hidden flex-shrink-0"
            style={{ 
              background: `linear-gradient(135deg, ${color}08, white)`, 
              borderBottom: '1px solid #c8d8f040' 
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center z-10"
            >
              <GamificacionIcon name="x" className="w-3.5 h-3.5" strokeColor="#0a1628" />
            </button>

            <div className="flex gap-4 items-start pr-8">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${color}10`, border: `1.5px solid ${color}20` }}
              >
                <GamificacionIcon name="book-open" className="w-6 h-6" strokeColor={color} />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#0a1628] leading-tight mb-1">
                  {texto.titulo}
                </h2>
                {texto.autor && (
                  <p className="text-xs text-[#6b8cba] font-medium italic mb-2">{texto.autor}</p>
                )}
                {texto.materia && (
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: `${color}10`, color }}
                  >
                    {texto.materia}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contenido scrollable del modal */}
          <div 
            className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#c8d8f060 transparent' }}
          >

            {/* Stats en grid */}
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { label: 'XP Ganados',    value: texto.xpGanados > 0 ? `+${texto.xpGanados}` : '—',          color: '#d4af37', icono: 'zap'       },
                { label: 'Tiempo total',  value: formatMins(texto.tiempoLecturaMinutos),                       color: '#3b82f6', icono: 'clock'     },
                { label: 'Fragmentos',    value: `${texto.segmentosCompletados}/${texto.totalSegmentos}`,       color: '#8b5cf6', icono: 'document'  },
                { label: 'Anotaciones',   value: String(texto.anotaciones),                                    color: '#ec4899', icono: 'pen'       },
                { label: 'Dificultad',    value: getDificultadLabel(texto.nivelDificultad),                    color: '#6366f1', icono: 'chart-bar' },
                { label: 'Estado',        value: texto.enCurso ? 'En curso' : texto.comprensionPromedio > 0 ? 'Completado' : 'No iniciado', color, icono: 'check-circle' },
              ].map(m => (
                <div key={m.label}
                  className="rounded-2xl border border-gray-100 p-3.5 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <GamificacionIcon name={m.icono} className="w-3.5 h-3.5" strokeColor={m.color} />
                    <p className="text-[9px] uppercase tracking-widest font-extrabold text-[#6b8cba]">{m.label}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Comprensión por dimensión */}
            {texto.comprensionPorDimension && (
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[9px] uppercase tracking-widest font-extrabold text-[#6b8cba] mb-3.5">
                  Comprensión por dimensión
                </p>
                <div className="space-y-3">
                  {Object.entries({
                    'Velocidad':            texto.comprensionPorDimension.velocidad,
                    'Comprensión directa':  texto.comprensionPorDimension.comprensionDirecta,
                    'Entre líneas':         texto.comprensionPorDimension.comprensionEntreLineas,
                    'Vocabulario':          texto.comprensionPorDimension.vocabulario,
                    'Pensamiento crítico':  texto.comprensionPorDimension.pensamientoCritico,
                  }).map(([label, val]) => {
                    const c = getComprensionColor(val);
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#1e3a6e] font-semibold">{label}</span>
                          <span className="font-bold" style={{ color: c }}>{val}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100">
                          <div className="h-full rounded-full" style={{ width: `${val}%`, background: c }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Insignias obtenidas */}
            {texto.insigniasObtenidas.length > 0 && (
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[9px] uppercase tracking-widest font-extrabold text-[#6b8cba] mb-2.5">
                  Insignias obtenidas en este texto
                </p>
                <div className="flex flex-wrap gap-2">
                  {texto.insigniasObtenidas.map((iconoNombre, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center"
                    >
                      <GamificacionIcon name={iconoNombre} className="w-5 h-5" strokeColor="#d4af37" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fechas */}
            <div className="text-[11px] text-[#6b8cba] font-medium italic space-y-0.5 pt-3 border-t border-gray-100">
              <p>Inicio: {formatDateSafe(texto.fechaInicio)}</p>
              {texto.fechaFin && <p>Completado: {formatDateSafe(texto.fechaFin)}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Portadas dinámicas
const COVER_GRADIENTS = [
  'from-[#1e3a8a] to-[#3b82f6]', // Azul
  'from-[#064e3b] to-[#0f766e]', // Verde/Teal
  'from-[#5b21b6] to-[#8b5cf6]', // Violeta
  'from-[#7c2d12] to-[#c2410c]', // Naranja/Óxido
];

// ── Tarjeta de texto (Rediseño Premium estilo Libro horizontal) ──
interface TarjetaMapaProps {
  texto: MapaTextoDetalle;
  isActive: boolean;
  index: number;
  onClick: () => void;
}

function TarjetaMapa({ texto, isActive, index, onClick }: TarjetaMapaProps) {
  const color = getComprensionColor(texto.comprensionPromedio, texto.enCurso);
  const coverGradient = COVER_GRADIENTS[index % COVER_GRADIENTS.length];

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      {/* Tarjeta principal (Cambiado de button a div para evitar botones anidados) */}
      <div
        onClick={onClick}
        className={`group relative flex flex-row gap-4.5 rounded-3xl border p-4.5 w-[340px] h-[160px] text-left transition-all duration-300 bg-white hover:shadow-md cursor-pointer ${
          isActive 
            ? 'border-blue-500 shadow-sm ring-2 ring-blue-500/10' 
            : 'border-gray-100 hover:border-gray-200 shadow-sm'
        }`}
      >
        {/* LADO IZQUIERDO: Portada del libro */}
        <div className={`relative w-[84px] h-[120px] rounded-2xl bg-gradient-to-br ${coverGradient} flex flex-col justify-between p-3 shadow-md flex-shrink-0 overflow-hidden`}>
          {/* Decoración de fondo de la portada */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1.2px,_transparent_1.2px)] bg-[size:8px_8px]" />

          {/* Badge flotante "En curso" */}
          {texto.enCurso && (
            <span className="relative z-10 self-start text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded-md text-white bg-blue-500 uppercase shadow-sm">
              En Curso
            </span>
          )}
          
          {/* Título en portada */}
          <div className="relative z-10 my-auto">
            <p className="text-[9px] font-extrabold text-white/90 leading-tight uppercase tracking-wider line-clamp-3">
              {texto.titulo}
            </p>
          </div>

          {/* Icono de libro en la base de la portada */}
          <div className="relative z-10 self-start opacity-70">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* LADO DERECHO: Narrativa del viaje lector */}
        <div className="flex flex-col flex-1 min-w-0 h-full py-0.5 justify-between">
          <div>
            {/* Lectura index */}
            <div className="flex items-center gap-1.5 text-gray-400 mb-2">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-[9px] font-bold tracking-widest uppercase text-gray-400">
                Lectura {index + 1}
              </span>
            </div>

            {/* Título */}
            <h4 className="text-sm font-bold text-[#0a1628] leading-tight line-clamp-2 mb-1">
              {texto.titulo}
            </h4>

            {/* Materia o autor */}
            {(texto.materia || texto.autor) && (
              <p className="text-[10px] text-gray-400 font-medium truncate">
                {texto.materia ?? texto.autor}
              </p>
            )}
          </div>

          {/* Chips de estado — narrativa diferente a la biblioteca */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Chip 1: Estado actual del libro */}
            {(() => {
              const pct = texto.comprensionPromedio;
              const enCurso = texto.enCurso;
              const completado = pct >= 100 || (!enCurso && texto.segmentosCompletados > 0 && texto.segmentosCompletados >= texto.totalSegmentos);
              const sinIniciar = pct === 0 && !enCurso;
              if (sinIniciar) return (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                  Sin iniciar
                </span>
              );
              if (completado) return (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Completado
                </span>
              );
              return (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse" />
                  En curso
                </span>
              );
            })()}

            {/* Chip 2: Último acceso — solo se muestra si el libro tiene actividad y fecha válida */}
            {(() => {
              // No mostrar chip si el libro no ha sido iniciado
              if (texto.comprensionPromedio === 0 && !texto.enCurso) return null;

              const fecha = new Date(texto.fechaInicio);
              // Ocultar si la fecha no es válida
              if (isNaN(fecha.getTime())) return null;

              const ahora = new Date();
              const diffDias = Math.floor((ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
              let label = '';
              if (diffDias === 0)        label = 'Hoy';
              else if (diffDias === 1)   label = 'Ayer';
              else if (diffDias < 7)     label = `Hace ${diffDias}d`;
              else if (diffDias < 30)    label = `Hace ${Math.floor(diffDias / 7)}sem`;
              else                       label = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

              return (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {label}
                </span>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Eje de la línea de tiempo inferior */}
      <div className="relative w-full flex items-center justify-center h-12">
        {/* Línea horizontal continua que se superpone a los lados por 12px (la mitad del gap-6) */}
        <div className="absolute -left-3 -right-3 h-0.5 bg-blue-100" />
        
        {/* Nodo numérico (Cambiado a azul (#3b82f6) para coincidir con el diseño) */}
        <div 
          className="relative z-10 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center border-4 border-white shadow-sm bg-[#3b82f6]"
        >
          {index + 1}
        </div>
      </div>
    </div>
  );
}
// Spacers compatibles
function LineaConectora() {
  return null;
}

function MapaEmpty() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-[#c8d8f0]/50">
      <div className="w-14 h-14 rounded-full bg-[#c8d8f0]/30 flex items-center justify-center mx-auto mb-4">
        <GamificacionIcon name="map" className="w-7 h-7" strokeColor="#6b8cba" />
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#0a1628] mb-2">
        Tu mapa de lectura está vacío
      </h3>
      <p className="text-sm text-[#6b8cba] font-lora italic max-w-xs mx-auto">
        Empieza a leer tus libros y aquí aparecerá el registro visual de tu trayecto lector.
      </p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
type VistaOrden = 'cronologico' | 'dificultad';

export default function MapaLectura() {
  const [textos,      setTextos]      = useState<MapaTextoDetalle[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [selectedId,  setSelectedId]  = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Resetear estado en cada montaje para garantizar carga fresca
    // al navegar entre pestañas y volver al mapa
    setTextos([]);
    setIsLoading(true);
    setSelectedId(null);

    let cancelled = false;
    MapaLecturaService.getMapa()
      .then(data  => { if (!cancelled) setTextos(data); })
      .catch(err  => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const textosOrdenados = [...textos].sort((a, b) => {
    if (!a.fechaInicio && !b.fechaInicio) return 0;
    if (!a.fechaInicio) return 1;
    if (!b.fechaInicio) return -1;
    return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
  });

  const selectedTexto = textos.find(t => t.libroId === selectedId) ?? null;

  const completados  = textos.filter(t => !t.enCurso && t.comprensionPromedio > 0).length;
  const enCurso      = textos.filter(t => t.enCurso).length;
  const xpTotal      = textos.reduce((s, t) => s + t.xpGanados, 0);
  const tiempoTotal  = textos.reduce((s, t) => s + t.tiempoLecturaMinutos, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#c8d8f0]/40">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#6b8cba] font-medium">Cargando mapa de lectura...</p>
      </div>
    );
  }

  if (textos.length === 0) return <MapaEmpty />;

  return (
    <>
      <div className="space-y-6">
        {/* ── Stats globales (Rediseñados de forma Premium y robusta) ── */}
        <div className="bg-gradient-to-br from-[#0a1628] via-[#0d1f38] to-[#122849] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-[#1e3a6e]/40">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ 
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', 
              backgroundSize: '20px 20px',
              maskImage: 'linear-gradient(to bottom, black, transparent)'
            }}
          />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-[#6b8cba] font-bold mb-4">
              Tu Trayecto Lector
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Libros Completados', value: String(completados), color: '#4caf50', icon: 'check-circle' },
                { label: 'En Curso',            value: String(enCurso),      color: '#3b82f6', icon: 'book-open' },
                { label: 'XP Ganados',          value: xpTotal > 0 ? `+${xpTotal}` : '—', color: '#d4af37', icon: 'zap' },
                { label: 'Tiempo de Lectura',   value: formatMins(tiempoTotal), color: '#8b5cf6', icon: 'clock' },
              ].map(s => (
                <div 
                  key={s.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex items-center gap-4 hover:bg-white/8 transition-colors duration-200 shadow-sm"
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
                  >
                    <GamificacionIcon name={s.icon} className="w-6 h-6" strokeColor={s.color} />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-[#6b8cba] uppercase tracking-widest font-bold leading-none mb-2">{s.label}</p>
                    <p className="text-3xl md:text-4xl font-playfair font-black text-white leading-none">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Encabezado ── */}
        <div className="flex flex-col gap-1">
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#0a1628]">Mi trayecto lector</h3>
          <p className="text-xs md:text-sm text-[#6b8cba] font-lora italic">
            El historial visual de todos tus libros: completados, en curso y pendientes de empezar.
          </p>
        </div>

        {/* ── Timeline ── */}
        <div className="bg-white rounded-3xl shadow-md border border-[#c8d8f0]/50 p-6 overflow-hidden">

          <div
            ref={scrollRef}
            className="transition-opacity duration-200"
          >
            {/* DESKTOP: Horizontal scroll */}
            <div
              className="hidden sm:flex items-start gap-6 pb-6 pt-4 px-6 overflow-x-auto rounded-2xl"
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#c8d8f060 transparent', 
                minHeight: 230,
                backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
                backgroundColor: 'rgba(248, 250, 252, 0.25)'
              }}
            >
              {textosOrdenados.map((texto, i) => (
                <TarjetaMapa
                  key={texto.libroId}
                  texto={texto}
                  isActive={selectedId === texto.libroId}
                  index={i}
                  onClick={() => setSelectedId(selectedId === texto.libroId ? null : texto.libroId)}
                />
              ))}
            </div>

            {/* MOBILE: Lista vertical */}
            <div className="sm:hidden space-y-3">
              {textosOrdenados.map((texto, i) => {
                const color = getComprensionColor(texto.comprensionPromedio);
                return (
                  <button
                    key={texto.libroId}
                    onClick={() => setSelectedId(selectedId === texto.libroId ? null : texto.libroId)}
                    className={`w-full text-left flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                      selectedId === texto.libroId ? 'ring-2 ring-[#d4af37] shadow-md' : ''
                    }`}
                    style={{
                      borderColor: `${color}35`,
                      background: `linear-gradient(135deg, ${color}06, white)`,
                      borderStyle: texto.enCurso ? 'dashed' : 'solid',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}15` }}
                    >
                      <GamificacionIcon name="book-open" className="w-6 h-6" strokeColor={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0a1628] leading-snug truncate">{texto.titulo}</p>
                      {texto.materia && <p className="text-[10px] text-[#6b8cba] mt-0.5">{texto.materia}</p>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-[#c8d8f0]/40 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${texto.comprensionPromedio}%`, background: color }} />
                        </div>
                        <span className="text-xs font-black flex-shrink-0" style={{ color }}>{texto.comprensionPromedio}%</span>
                      </div>
                    </div>
                    {texto.enCurso && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${color}15`, color }}>
                        Leyendo
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {selectedTexto && (
        <PanelDetalle texto={selectedTexto} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}
