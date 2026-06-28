'use client';

import { useState, useEffect } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { PerfilCognitivoService } from '../../../service/alumno/perfilCognitivo.service';
import {
  PerfilCognitivo as TPerfilCognitivo,
  DimensionCognitiva,
  TendenciaDimension,
} from '../../../types/alumno/gamificacion';

// ── Helpers ───────────────────────────────────────────────────────────────────

const TENDENCIA_ICONS: Record<TendenciaDimension, string> = {
  up:     '↑',
  stable: '→',
  down:   '↓',
};

const TENDENCIA_COLORS: Record<TendenciaDimension, string> = {
  up:     '#4caf50',
  stable: '#6b8cba',
  down:   '#ef4444',
};

// Nombre corto para los vértices del radar (caben mejor en el chart)
const NOMBRE_CORTO: Record<string, string> = {
  velocidad:                  'Velocidad',
  comprension_directa:        'Comprensión\ndirecta',
  comprension_entre_lineas:   'Entre\nlíneas',
  vocabulario:                'Vocabulario',
  pensamiento_critico:        'Pensamiento\ncrítico',
};

// Color de la dimensión según su valor
const getColorDimension = (valor: number): string => {
  if (valor >= 75) return '#4caf50';
  if (valor >= 50) return '#3b82f6';
  return '#ef4444';
};

// ── Tooltip personalizado del radar ──────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DimensionCognitiva & { fullMark: number } }>;
}

function CustomRadarTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as DimensionCognitiva;
  const tColor = TENDENCIA_COLORS[d.tendencia];
  const tIcon  = TENDENCIA_ICONS[d.tendencia];
  const dColor = getColorDimension(d.valor);

  return (
    <div className="bg-[#0a1628] border border-[#1e3a6e] rounded-2xl p-3 shadow-2xl max-w-[200px]">
      <p className="text-[10px] uppercase tracking-widest text-[#6b8cba] font-bold mb-1">{d.nombre}</p>
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-2xl font-black font-playfair" style={{ color: dColor }}>{d.valor}</span>
        <span className="text-xs text-[#6b8cba]">/ 100</span>
        <span className="text-sm font-black ml-auto" style={{ color: tColor }}>{tIcon}</span>
      </div>
      <p className="text-[11px] text-white/70 font-lora italic leading-snug">{d.consejo}</p>
    </div>
  );
}

// ── Barra individual de dimensión ─────────────────────────────────────────────
function BarraDimension({ dim, delay = 0 }: { dim: DimensionCognitiva; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(dim.valor), 200 + delay);
    return () => clearTimeout(t);
  }, [dim.valor, delay]);

  const color     = getColorDimension(dim.valor);
  const tColor    = TENDENCIA_COLORS[dim.tendencia];
  const tIcon     = TENDENCIA_ICONS[dim.tendencia];
  const isCritico = dim.valor < 50;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-200 ${
        isCritico
          ? 'bg-red-50 border-red-100'
          : 'bg-white border-[#c8d8f0]/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0a1628] leading-none">{dim.nombre}</p>
          {isCritico && (
            <p className="text-[10px] text-red-500 mt-0.5 font-medium">Área de mejora</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-black" style={{ color: tColor }}>{tIcon}</span>
          <span className="text-xl font-black font-playfair" style={{ color }}>{dim.valor}</span>
        </div>
      </div>

      {/* Barra */}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: `${color}18` }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${w}%`,
            background: `linear-gradient(90deg, ${color}70, ${color})`,
            boxShadow: w > 0 ? `0 0 6px ${color}50` : 'none',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>

      {/* Consejo si crítico */}
      {isCritico && (
        <p className="mt-2 text-[11px] text-red-600 font-lora italic leading-snug">
          💡 {dim.consejo}
        </p>
      )}
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function SkeletonPerfil() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-3xl h-80" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-20" />
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function PerfilCognitivo() {
  const [perfil,    setPerfil]    = useState<TPerfilCognitivo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    PerfilCognitivoService.getPerfil()
      .then(setPerfil)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (perfil) {
      const t = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(t);
    }
  }, [perfil]);

  if (isLoading) return <SkeletonPerfil />;
  if (!perfil)   return null;

  // Formatear datos para el RadarChart
  const radarData = perfil.dimensiones.map(d => ({
    ...d,
    // Nombre corto para el eje polar
    subject: NOMBRE_CORTO[d.clave] ?? d.nombre,
    valor:   d.valor,
    fullMark: 100,
  }));

  // Detectar dimensiones críticas (< 50)
  const criticas = perfil.dimensiones.filter(d => d.valor < 50);
  const promedio = Math.round(
    perfil.dimensiones.reduce((s, d) => s + d.valor, 0) / perfil.dimensiones.length
  );

  return (
    <div className="space-y-6">
      {/* ── Encabezado con promedio global ── */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#1a2d5a] rounded-3xl p-6 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-[#6b8cba] font-bold mb-1">
              Tu perfil cognitivo
            </p>
            <h2 className="font-playfair text-2xl font-black text-white mb-1">
              Promedio global: {promedio}/100
            </h2>
            <p className="text-sm text-white/60 font-lora italic">
              {promedio < 40 ? 'Recién empezando tu viaje lector.' :
               promedio < 60 ? 'Progreso sólido. Sigue adelante.' :
               promedio < 80 ? 'Desempeño avanzado. ¡Muy bien!' :
                               '¡Perfil de élite! Eres un lector excepcional.'}
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-playfair text-6xl font-black text-[#d4af37]">{promedio}</span>
            <span className="text-2xl text-white/40">pts</span>
          </div>
        </div>
      </div>

      {/* ── Radar chart ── */}
      <div className="bg-white rounded-3xl shadow-md border border-[#c8d8f0]/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-playfair text-lg font-bold text-[#0a1628]">
              Mapa de habilidades
            </h3>
            <p className="text-xs text-[#6b8cba] font-lora italic">
              Pasa el cursor sobre cada vértice para ver consejos personalizados
            </p>
          </div>
          {/* Leyenda de tendencias */}
          <div className="hidden sm:flex items-center gap-3">
            {(['up', 'stable', 'down'] as TendenciaDimension[]).map(t => (
              <div key={t} className="flex items-center gap-1">
                <span className="text-sm font-black" style={{ color: TENDENCIA_COLORS[t] }}>
                  {TENDENCIA_ICONS[t]}
                </span>
                <span className="text-[10px] text-[#6b8cba]">
                  {t === 'up' ? 'Mejorando' : t === 'stable' ? 'Estable' : 'Bajando'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`transition-opacity duration-500 ${mounted ? 'opacity-100 animate-radar-in' : 'opacity-0'}`}
        >
          <div style={{ width: '100%', height: 340, minHeight: 340 }}>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#c8d8f020" gridType="polygon" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#1e3a6e', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#6b8cba', fontSize: 9 }}
                  tickCount={6}
                />
                <Radar
                  name="Perfil"
                  dataKey="valor"
                  stroke="#1e3a6e"
                  strokeWidth={2}
                  fill="#1e3a6e"
                  fillOpacity={0.12}
                  dot={{ r: 4, fill: '#d4af37', stroke: '#d4af37', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#d4af37', stroke: 'white', strokeWidth: 2 }}
                  animationBegin={300}
                  animationDuration={800}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* ── Barras individuales ── */}
      <div>
        <h3 className="font-playfair text-lg font-bold text-[#0a1628] mb-3">
          Detalle por dimensión
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {perfil.dimensiones.map((dim, i) => (
            <div
              key={dim.clave}
              className="animate-card-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <BarraDimension dim={dim} delay={i * 80} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Banner de advertencia si hay dimensiones críticas ── */}
      {criticas.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-bold text-amber-800 mb-1">
                {criticas.length === 1 ? 'Área de mejora detectada' : `${criticas.length} áreas de mejora detectadas`}
              </h4>
              <div className="space-y-2">
                {criticas.map(d => (
                  <div key={d.clave} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-sm flex-shrink-0 mt-0.5">→</span>
                    <div>
                      <span className="text-sm font-semibold text-amber-800">{d.nombre}:</span>
                      <span className="text-sm text-amber-700 ml-1 font-lora italic">{d.consejo}</span>
                    </div>
                  </div>
                ))}
              </div>
                <p className="text-xs text-amber-600 mt-3">
                  Las dimensiones bajo 50 puntos se actualizan tras cada sesión de lectura y evaluación.
                </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      {perfil.actualizadoEn && (
        <p className="text-center text-[11px] text-[#6b8cba] font-lora italic">
          Perfil actualizado el{' '}
          {new Date(perfil.actualizadoEn).toLocaleDateString('es-MX', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
}
