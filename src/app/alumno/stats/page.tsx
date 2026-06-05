'use client';

import { useState, useEffect } from 'react';
import { Cell, PieChart, Pie } from 'recharts';
import { TarjetaEstadistica } from '../../../components/alumno/TarjetaEstadistica';
import { AlumnoService } from '../../../service/alumno/alumno.service';
import { AlumnoLibrosService } from '../../../service/alumno/libros.service';
import { GamificacionService } from '../../../service/alumno/gamificacion.service';
import { EstadisticasAlumno } from '../../../types/alumno/alumno';
import { LibroAlumno } from '../../../types/alumno/libros';
import { ProgresoGamificacion, Insignia } from '../../../types/alumno/gamificacion';

// ── Barra de progreso animada ──────────────────────────────────────────────
function BarraProgreso({ porcentaje, color = '#3b82f6' }: { porcentaje: number; color?: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(Math.min(porcentaje, 100)), 120); return () => clearTimeout(t); }, [porcentaje]);
  return (
    <div className="w-full h-2.5 bg-[#c8d8f0]/60 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${w}%`, background: `linear-gradient(90deg,${color}cc,${color})` }} />
    </div>
  );
}

// ── Lista de progreso por libro ────────────────────────────────────────────
function GraficaAvance({ libros }: { libros: LibroAlumno[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const sorted = [...libros].sort((a, b) => b.progresoPorcentaje - a.progresoPorcentaje);

  return (
    <div className="space-y-2.5 overflow-y-auto pr-1"
      style={{ maxHeight: 380, scrollbarWidth: 'thin', scrollbarColor: '#3b82f660 transparent' }}>
      {sorted.map((libro, i) => {
        const pct   = libro.progresoPorcentaje;
        const done  = pct >= 100;
        const fresh = pct === 0;
        const color = done ? '#4caf50' : fresh ? '#6b8cba' : '#3b82f6';
        const label = done ? 'Completado' : fresh ? 'Sin iniciar' : 'En progreso';
        return (
          <div key={libro.libroId}
            className="rounded-xl border px-4 py-3 transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: `${color}28`,
              background: `linear-gradient(90deg, ${color}08, #ffffff)`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translateY(6px)',
              transition: `opacity 0.4s ease ${i * 45}ms, transform 0.4s ease ${i * 45}ms, box-shadow 0.2s`,
            }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0a1628] leading-snug truncate">{libro.titulo}</p>
                <p className="text-[11px] text-[#6b8cba] mt-0.5 truncate">
                  {libro.materia}{libro.grado && ` · ${libro.grado}`}
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-0.5">
                <span className="text-base font-playfair font-black leading-none" style={{ color }}>{pct}%</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${color}18`, color }}>{label}</span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: `${color}18` }}>
              <div className="h-full rounded-full"
                style={{
                  width: mounted ? `${pct}%` : '0%',
                  transition: `width 0.85s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
                  background: `linear-gradient(90deg, ${color}70, ${color})`,
                  boxShadow: pct > 0 ? `0 0 8px ${color}50` : 'none',
                }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Barra de nivel ─────────────────────────────────────────────────────────
function BarraNivel({ porcentaje, color }: { porcentaje: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(Math.min(porcentaje, 100)), 200); return () => clearTimeout(t); }, [porcentaje]);
  return (
    <div className="w-full h-3 rounded-full overflow-hidden bg-white/20">
      <div className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${w}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }} />
    </div>
  );
}

// ── Tarjeta de insignia ────────────────────────────────────────────────────
function TarjetaInsignia({ insignia }: { insignia: Insignia }) {
  const obtenida = insignia.obtenida;
  return (
    <div className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all duration-200 hover:shadow-md ${
      obtenida
        ? 'bg-white border-[#d4af37]/30 shadow-sm'
        : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
        obtenida ? 'bg-[#d4af37]/10' : 'bg-gray-100'
      }`}>
        {insignia.icono ?? '🏅'}
      </div>
      <div>
        <p className={`text-xs font-bold leading-tight ${obtenida ? 'text-[#0a1628]' : 'text-gray-400'}`}>
          {insignia.nombre}
        </p>
        <p className={`text-[10px] mt-0.5 leading-snug ${obtenida ? 'text-[#6b8cba]' : 'text-gray-300'}`}>
          {insignia.descripcion}
        </p>
      </div>
      {obtenida && insignia.obtenidaEn && (
        <span className="text-[9px] text-[#d4af37] font-bold uppercase tracking-wider">
          {new Date(insignia.obtenidaEn).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      )}
      {!obtenida && (
        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider">Bloqueada</span>
      )}
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const [stats,       setStats]       = useState<EstadisticasAlumno | null>(null);
  const [libros,      setLibros]      = useState<LibroAlumno[]>([]);
  const [gamificacion, setGamificacion] = useState<ProgresoGamificacion | null>(null);
  const [insignias,   setInsignias]   = useState<Insignia[]>([]);
  const [noVistas,    setNoVistas]    = useState(0);
  const [isLoading,   setIsLoading]   = useState(true);
  const [tabActiva,   setTabActiva]   = useState<'resumen' | 'libros' | 'gamificacion'>('resumen');

  useEffect(() => {
    let m = true;
    Promise.all([
      AlumnoService.getEstadisticas(),
      AlumnoLibrosService.getMisLibros(),
      GamificacionService.getProgreso(),
      GamificacionService.getInsignias(),
    ])
      .then(([s, l, g, ins]) => {
        if (!m) return;
        setStats(s);
        setLibros(l);
        setGamificacion(g);
        setInsignias(ins.data);
        setNoVistas(ins.noVistas);
      })
      .catch(console.error)
      .finally(() => { if (m) setIsLoading(false); });
    return () => { m = false; };
  }, []);

  // Marcar vistas cuando el alumno abre la tab de gamificación
  useEffect(() => {
    if (tabActiva === 'gamificacion' && noVistas > 0) {
      GamificacionService.marcarInsigniasVistas()
        .then(() => setNoVistas(0))
        .catch(console.error);
    }
  }, [tabActiva, noVistas]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#6b8cba] font-lora italic">Cargando estadísticas…</p>
    </div>
  );
  if (!stats) return null;

  const hrs = Math.floor(stats.tiempoTotalMinutos / 60);
  const mins = stats.tiempoTotalMinutos % 60;
  const tiempoFmt = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  const librosCompletos  = libros.filter(l => l.progresoPorcentaje >= 100);
  const librosEnProgreso = libros.filter(l => l.progresoPorcentaje > 0 && l.progresoPorcentaje < 100);
  const promedioGlobal   = libros.length
    ? Math.round(libros.reduce((s, l) => s + l.progresoPorcentaje, 0) / libros.length)
    : 0;
  const rachaRatio = stats.rachaMaximaDias > 0
    ? Math.round((stats.rachaActualDias / stats.rachaMaximaDias) * 100)
    : 0;

  const streakData = [
    { v: stats.rachaActualDias },
    { v: Math.max(stats.rachaMaximaDias - stats.rachaActualDias, 0) },
  ];

  const insigniasPorCategoria = insignias.reduce<Record<string, Insignia[]>>((acc, ins) => {
    const cat = ins.categoria ?? 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ins);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#c8d8f0]">
        {(['resumen', 'libros', 'gamificacion'] as const).map(t => (
          <button key={t} onClick={() => setTabActiva(t)}
            className={`relative px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${tabActiva === t
              ? 'border-[#d4af37] text-[#0a1628] bg-white shadow-sm'
              : 'border-transparent text-[#6b8cba] hover:text-[#0a1628]'}`}>
            {t === 'resumen' ? 'Resumen General' : t === 'libros' ? 'Mis Libros' : 'Gamificación'}
            {/* Badge de insignias no vistas */}
            {t === 'gamificacion' && noVistas > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {noVistas}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══ TAB RESUMEN ═══════════════════════════════════════════════════ */}
      {tabActiva === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <TarjetaEstadistica label="Libros Leídos" value={String(stats.librosLeidos)} subtext={`${stats.librosEnProgreso} en progreso`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </TarjetaEstadistica>
            <TarjetaEstadistica label="Tiempo de Lectura" value={tiempoFmt} subtext={`${stats.tiempoEsteMesMinutos}m este mes`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </TarjetaEstadistica>
            <TarjetaEstadistica label="Puntaje Promedio" value={`${Number(stats.promedioEvaluaciones || 0).toFixed(2)}%`} subtext={`${stats.segmentosCompletados} secciones completadas`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </TarjetaEstadistica>
            <TarjetaEstadistica label="Racha Actual" value={`${stats.rachaActualDias} días`} subtext={`Máxima: ${stats.rachaMaximaDias} días`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
            </TarjetaEstadistica>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#0a1628]">Avance de Lectura</h3>
                  <p className="text-xs text-[#6b8cba] font-lora italic">Porcentaje completado por libro</p>
                </div>
                <div className="flex gap-3 text-[10px]">
                  {[['#3b82f6','En progreso'],['#4caf50','Completo'],['#6b8cba','Sin iniciar']].map(([c,l]) => (
                    <div key={l} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: c as string }} />
                      <span className="text-[#1e3a6e] font-medium">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              {libros.length === 0
                ? <p className="text-center text-[#6b8cba] text-sm py-12">Sin libros asignados aún</p>
                : <GraficaAvance libros={libros} />}
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6 flex flex-col">
              <h3 className="font-playfair text-lg font-bold text-[#0a1628] mb-1">Tu Racha</h3>
              <p className="text-xs text-[#6b8cba] font-lora italic mb-4">Días consecutivos leyendo</p>
              <div className="flex flex-col items-center flex-1 justify-center gap-2">
                <div className="relative" style={{ width: 148, height: 148 }}>
                  <PieChart width={148} height={148}>
                    <Pie data={streakData} cx={74} cy={74} innerRadius={48} outerRadius={68}
                      startAngle={90} endAngle={-270} dataKey="v" strokeWidth={0} animationBegin={0} animationDuration={1000}>
                      <Cell fill="#d4af37" />
                      <Cell fill="#f0ebe3" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl">🔥</span>
                    <span className="text-2xl font-playfair font-black text-[#0a1628] leading-none">{stats.rachaActualDias}</span>
                    <span className="text-[10px] text-[#6b8cba] uppercase tracking-wider">días</span>
                  </div>
                </div>
                <div className="w-full mt-2 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6b8cba]">Racha actual</span>
                    <span className="font-black text-[#d4af37]">{stats.rachaActualDias}d</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f0ebe3] overflow-hidden">
                    <div className="h-full rounded-full bg-[#d4af37] transition-all duration-700"
                      style={{ width: `${rachaRatio}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6b8cba]">Mejor racha</span>
                    <span className="font-black text-[#0a1628]">{stats.rachaMaximaDias}d</span>
                  </div>
                </div>
                {stats.rachaActualDias >= stats.rachaMaximaDias && stats.rachaActualDias > 0 && (
                  <div className="mt-2 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
                    🏆 ¡Nuevo récord personal!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6">
              <h3 className="font-playfair text-lg font-bold text-[#0a1628] mb-5">Rendimiento Académico</h3>
              <div className="space-y-5">
                {[
                  { label: 'Promedio en evaluaciones', displayValue: Number(stats.promedioEvaluaciones || 0).toFixed(2), numericValue: Number(stats.promedioEvaluaciones || 0), max: 100, color: '#4caf50', suffix: '%' },
                  { label: 'Progreso global de lectura', displayValue: String(promedioGlobal), numericValue: promedioGlobal, max: 100, color: '#2196f3', suffix: '%' },
                  { label: 'Secciones completadas', displayValue: String(stats.segmentosCompletados), numericValue: Math.min(stats.segmentosCompletados, 200), max: 200, color: '#d4af37', suffix: '' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-[#0a1628]">{m.label}</span>
                      <span className="text-sm font-black" style={{ color: m.color }}>{m.displayValue}{m.suffix}</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: `${m.color}20` }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(m.numericValue / m.max) * 100}%`, background: `linear-gradient(90deg,${m.color}90,${m.color})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-playfair text-lg font-bold text-[#0a1628]">Mi Biblioteca</h3>
                {stats.ultimaActividad && (
                  <span className="text-[11px] text-[#6b8cba] font-lora italic">
                    Última sesión: {new Date(stats.ultimaActividad).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Libros completados', value: librosCompletos.length, color: '#4caf50', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /> },
                  { label: 'En progreso', value: librosEnProgreso.length, color: '#3b82f6', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
                  { label: 'Anotaciones', value: stats.anotacionesTotales, color: '#9c27b0', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /> },
                  { label: 'Tiempo este mes', value: `${stats.tiempoEsteMesMinutos}m`, color: '#2196f3', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
                ].map(item => (
                  <div key={item.label}
                    className="flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default"
                    style={{ background: `${item.color}09`, borderColor: `${item.color}28` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(135deg,${item.color}30,${item.color}15)` }}>
                      <svg className="w-5 h-5" fill="none" stroke={item.color} viewBox="0 0 24 24">{item.icon}</svg>
                    </div>
                    <div>
                      <p className="text-xl font-playfair font-black leading-none" style={{ color: item.color }}>{item.value}</p>
                      <p className="text-[11px] text-[#1e3a6e] mt-0.5 leading-tight">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB MIS LIBROS ════════════════════════════════════════════════ */}
      {tabActiva === 'libros' && (
        <div className="space-y-3">
          {libros.length === 0 ? (
            <div className="text-center py-16 text-[#6b8cba] font-lora italic">No tienes libros asignados aún.</div>
          ) : (
            libros.slice().sort((a, b) => b.progresoPorcentaje - a.progresoPorcentaje).map(libro => {
              const done  = libro.progresoPorcentaje >= 100;
              const fresh = libro.progresoPorcentaje === 0;
              const color = done ? '#4caf50' : fresh ? '#6b8cba' : '#3b82f6';
              const badge = done ? '✅ Completado' : fresh ? '📌 Sin iniciar' : '📖 En progreso';
              const badgeCls = done ? 'bg-green-50 text-green-700 border-green-200'
                : fresh ? 'bg-gray-50 text-gray-500 border-gray-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';
              return (
                <div key={libro.libroId}
                  className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ borderLeft: `4px solid ${color}` }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-playfair font-bold text-[#0a1628] text-base line-clamp-2 sm:truncate">{libro.titulo}</h4>
                        <span className={`self-start sm:shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeCls}`}>{badge}</span>
                      </div>
                      <p className="text-xs text-[#6b8cba] mb-3">
                        {libro.materia} · {libro.grado}{libro.autor && ` · ${libro.autor}`}
                      </p>
                      <BarraProgreso porcentaje={libro.progresoPorcentaje} color={color} />
                    </div>
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#c8d8f0]/40 w-full sm:w-auto">
                      <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-center">
                        <span className="text-2xl sm:text-3xl font-playfair font-bold" style={{ color }}>{libro.progresoPorcentaje}%</span>
                        <span className="sm:hidden text-[10px] text-[#6b8cba] uppercase font-bold tracking-wider">progreso</span>
                      </div>
                      {libro.ultimaLectura && (
                        <span className="text-[10px] text-[#6b8cba] mt-0.5 sm:mt-1 whitespace-nowrap">
                          Último acceso: {new Date(libro.ultimaLectura).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ══ TAB GAMIFICACIÓN ══════════════════════════════════════════════ */}
      {tabActiva === 'gamificacion' && (
        <div className="space-y-6">

          {/* Nivel actual */}
          {gamificacion && (
            <div className="rounded-3xl p-6 text-white relative overflow-hidden shadow-xl"
              style={{ background: `linear-gradient(135deg, ${gamificacion.nivel?.color ?? '#0a1628'}, #0a1628)` }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Icono + nivel */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-lg">
                    {gamificacion.nivel?.icono ?? '⭐'}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Nivel {gamificacion.nivelActual}</p>
                    <p className="font-playfair text-2xl font-bold text-white">{gamificacion.nivel?.nombre ?? '—'}</p>
                    <p className="text-white/70 text-sm mt-0.5">{gamificacion.puntosTotales} puntos totales</p>
                  </div>
                </div>

                {/* Barra hacia siguiente nivel */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-xs text-white/70">
                    <span>Progreso al nivel {gamificacion.nivelActual + 1}</span>
                    <span>{gamificacion.porcentajeNivel}%</span>
                  </div>
                  <BarraNivel porcentaje={gamificacion.porcentajeNivel} color="rgba(255,255,255,0.9)" />
                  {gamificacion.nivelSiguiente && (
                    <p className="text-white/50 text-[11px]">
                      Faltan {gamificacion.puntosParaSiguienteNivel} puntos para <strong className="text-white/80">{gamificacion.nivelSiguiente.nombre}</strong>
                    </p>
                  )}
                </div>

                {/* Stats rápidos */}
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 shrink-0">
                  {[
                    { label: 'Racha', value: `${gamificacion.rachaActual}d 🔥` },
                    { label: 'Segmentos', value: gamificacion.segmentosLeidos },
                    { label: 'Evaluaciones', value: gamificacion.evaluacionesOk },
                    { label: 'Libros', value: gamificacion.librosCompletados },
                  ].map(s => (
                    <div key={s.label} className="bg-white/10 rounded-xl px-3 py-1.5 text-center">
                      <p className="text-white font-bold text-sm leading-none">{s.value}</p>
                      <p className="text-white/50 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Insignias por categoría */}
          {insignias.length > 0 && (
            <div className="space-y-6">
              {Object.entries(insigniasPorCategoria).map(([categoria, lista]) => (
                <div key={categoria} className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-playfair text-lg font-bold text-[#0a1628] capitalize">{categoria}</h3>
                    <span className="text-[11px] text-[#6b8cba] font-bold">
                      {lista.filter(i => i.obtenida).length} / {lista.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {lista.map(insignia => (
                      <TarjetaInsignia key={insignia.id} insignia={insignia} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state insignias */}
          {insignias.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#c8d8f0]/50">
              <p className="text-4xl mb-3">🏅</p>
              <p className="font-playfair text-lg font-bold text-[#0a1628] mb-1">Aún no tienes insignias</p>
              <p className="text-sm text-[#6b8cba] font-lora italic">Sigue leyendo y completando evaluaciones para desbloquearlas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}