'use client';
// Vista consolidada de estadísticas y gamificación del estudiante.

import { useState, useEffect } from 'react';
import { Cell, PieChart, Pie } from 'recharts';
import { TarjetaEstadistica } from '../../../components/alumno/TarjetaEstadistica';
import { AlumnoService } from '../../../service/alumno/alumno.service';
import { AlumnoLibrosService } from '../../../service/alumno/libros.service';
import { GamificacionService } from '../../../service/alumno/gamificacion.service';
import { EstadisticasAlumno } from '../../../types/alumno/alumno';
import { LibroAlumno } from '../../../types/alumno/libros';
import { ProgresoGamificacion, Insignia } from '../../../types/alumno/gamificacion';
import GaleriaInsignias from '../../../components/alumno/gamificacion/GaleriaInsignias';
import PerfilCognitivo from '../../../components/alumno/gamificacion/PerfilCognitivo';
import MapaLectura from '../../../components/alumno/gamificacion/MapaLectura';
import XpHeaderBar from '../../../components/alumno/gamificacion/XpHeaderBar';
import { GamificacionIcon } from '../../../components/ui/GamificacionIcon';



// ── Tabs disponibles ───────────────────────────────────────────────────────
type TabId = 'resumen' | 'libros' | 'gamificacion' | 'cognitivo';

const TABS: { id: TabId; label: string; icono: string }[] = [
  { id: 'resumen',      label: 'Resumen',         icono: 'chart-pie'   },
  { id: 'libros',       label: 'Mis Libros',       icono: 'map'         },
  { id: 'gamificacion', label: 'Gamificación',     icono: 'trophy'      },
  { id: 'cognitivo',    label: 'Perfil Cognitivo', icono: 'light-bulb'  },
];

// ── Página ─────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const [stats,        setStats]        = useState<EstadisticasAlumno | null>(null);
  const [libros,       setLibros]       = useState<LibroAlumno[]>([]);
  const [gamificacion, setGamificacion] = useState<ProgresoGamificacion | null>(null);
  const [insignias,    setInsignias]    = useState<Insignia[]>([]);
  const [noVistas,     setNoVistas]     = useState(0);
  const [isLoading,    setIsLoading]    = useState(true);
  const [tabActiva,    setTabActiva]    = useState<TabId>('resumen');

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

  const tasaAprobacion = gamificacion && gamificacion.segmentosLeidos > 0
    ? Math.round((gamificacion.evaluacionesOk / gamificacion.segmentosLeidos) * 100)
    : 0;

  const streakData = [
    { v: stats.rachaActualDias },
    { v: Math.max(stats.rachaMaximaDias - stats.rachaActualDias, 0) },
  ];

  return (
    <div className="space-y-6 animate-fade pb-10">

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-[#c8d8f0] overflow-x-auto pb-0"
        style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTabActiva(t.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg whitespace-nowrap transition-all border-b-2 flex-shrink-0 ${
              tabActiva === t.id
                ? 'border-[#d4af37] text-[#0a1628] bg-white shadow-sm'
                : 'border-transparent text-[#6b8cba] hover:text-[#0a1628]'
            }`}
          >
            <span className="hidden sm:inline">
              <GamificacionIcon
                name={t.icono}
                className="w-4 h-4"
                strokeColor={tabActiva === t.id ? '#d4af37' : '#6b8cba'}
              />
            </span>
            <span>{t.label}</span>
            {/* Badge de insignias nuevas */}
            {t.id === 'gamificacion' && noVistas > 0 && (
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
            <TarjetaEstadistica label="Libros en Curso" value={String(librosEnProgreso.length)} subtext={`${librosCompletos.length} completados`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </TarjetaEstadistica>
            <TarjetaEstadistica label="Tiempo de Lectura" value={tiempoFmt} subtext={`${stats.tiempoEsteMesMinutos}m este mes`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </TarjetaEstadistica>
            <TarjetaEstadistica label="Secciones Completadas" value={String(stats.segmentosCompletados)} subtext="Fragmentos leídos">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </TarjetaEstadistica>
            <TarjetaEstadistica label="Anotaciones y Notas" value={String(stats.anotacionesTotales)} subtext="Textos destacados">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </TarjetaEstadistica>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rendimiento Académico */}
            <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6 flex flex-col justify-center">
              <h3 className="font-playfair text-lg font-bold text-[#0a1628] mb-5">Rendimiento Académico</h3>
              <div className="space-y-6">
                {[
                  { label: 'Promedio en evaluaciones',  displayValue: `${Number(stats.promedioEvaluaciones || 0).toFixed(2)}%`, numericValue: Number(stats.promedioEvaluaciones || 0), max: 100, color: '#4caf50' },
                  { label: 'Eficacia de lectura (Aprobación)', displayValue: `${tasaAprobacion}%`, numericValue: tasaAprobacion, max: 100, color: '#3b82f6' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-[#0a1628]">{m.label}</span>
                      <span className="text-sm font-black" style={{ color: m.color }}>{m.displayValue}</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: `${m.color}20` }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(m.numericValue / m.max) * 100}%`, background: `linear-gradient(90deg,${m.color}90,${m.color})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tu Racha */}
            <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6 flex flex-col items-center">
              <div className="text-left w-full mb-2">
                <h3 className="font-playfair text-lg font-bold text-[#0a1628] mb-0.5">Tu Racha de Lectura</h3>
                <p className="text-xs text-[#6b8cba] font-lora italic">Días consecutivos leyendo</p>
              </div>
              <div className="flex flex-col items-center flex-1 justify-center gap-4 w-full">
                <div className="relative" style={{ width: 148, height: 148 }}>
                  <PieChart width={148} height={148}>
                    <Pie data={streakData} cx={74} cy={74} innerRadius={48} outerRadius={68}
                      startAngle={90} endAngle={-270} dataKey="v" strokeWidth={0} animationBegin={0} animationDuration={1000}>
                      <Cell fill="#d4af37" />
                      <Cell fill="#f0ebe3" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <GamificacionIcon name="fire" className="w-8 h-8 mb-1 animate-streak" strokeColor="#d4af37" />
                    <span className="text-2xl font-playfair font-black text-[#0a1628] leading-none">{stats.rachaActualDias}</span>
                    <span className="text-[10px] text-[#6b8cba] uppercase tracking-wider font-bold">días</span>
                  </div>
                </div>
                <div className="w-full space-y-2">
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
                  <div className="mt-2 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 flex items-center gap-1 justify-center">
                    <GamificacionIcon name="trophy" className="w-3.5 h-3.5" strokeColor="#b45309" />
                    <span>¡Nuevo récord personal!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB MIS LIBROS (Mapa de Lectura fusionado) ═══════════════════════ */}
      {tabActiva === 'libros' && <MapaLectura />}

      {/* ══ TAB GAMIFICACIÓN ══════════════════════════════════════════════════ */}
      {tabActiva === 'gamificacion' && (
        <div className="space-y-6">
          <GaleriaInsignias
            insignias={insignias}
            noVistas={noVistas}
            onMarcarVistas={() => setNoVistas(0)}
          />
        </div>
      )}

      {/* ══ TAB PERFIL COGNITIVO ══════════════════════════════════════════════ */}
      {tabActiva === 'cognitivo' && <PerfilCognitivo />}
    </div>
  );
}