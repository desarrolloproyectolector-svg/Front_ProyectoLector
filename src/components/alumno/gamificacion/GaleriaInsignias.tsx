'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BADGE_CONFIG,
  CATEGORIA_LABELS,
  RAREZA_COLORS,
  getBadgeConfig,
} from '../../../utils/gamificacion.constants';
import { GamificacionIcon } from '../../ui/GamificacionIcon';
import { Insignia } from '../../../types/alumno/gamificacion';

// ── Utilidad de fecha segura ─────────────────────────────────────────────────
function formatDateSafe(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Toast de insignia desbloqueada ────────────────────────────────────────────
interface ToastInsignia {
  id: number;
  nombre: string;
  icono: string;
  categoria: string;
}

function InsigniaToast({ toast, onDismiss }: { toast: ToastInsignia; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const cfg = CATEGORIA_LABELS[toast.categoria] ?? { label: toast.categoria, icono: 'award' };

  return (
    <div className="animate-toast-up flex items-center gap-3 bg-[#0a1628] border border-[#d4af37]/30 rounded-2xl shadow-2xl px-4 py-3 min-w-[260px] max-w-xs w-full">
      <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
        <GamificacionIcon name={toast.icono} className="w-5 h-5" strokeColor="#d4af37" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <GamificacionIcon name={cfg.icono} className="w-3 h-3" strokeColor="#d4af37" />
          <p className="text-[10px] text-[#d4af37] uppercase tracking-widest font-bold">
            Insignia desbloqueada
          </p>
        </div>
        <p className="text-sm font-bold text-white leading-snug truncate">{toast.nombre}</p>
        <p className="text-[10px] text-[#6b8cba]">{cfg.label}</p>
      </div>
      <button
        onClick={onDismiss}
        className="ml-auto text-[#6b8cba] hover:text-white transition-colors flex-shrink-0"
        aria-label="Cerrar"
      >
        <GamificacionIcon name="x" className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Tarjeta individual de insignia ────────────────────────────────────────────
function TarjetaInsignia({ insignia }: { insignia: Insignia }) {
  const frontendCfg = getBadgeConfig(insignia.clave);
  const rareza      = frontendCfg?.rareza ?? 'comun';
  const criterio    = frontendCfg?.criterio ?? insignia.descripcion;
  const rarezaColor = RAREZA_COLORS[rareza] ?? '#6b8cba';
  // El ícono viene del backend (string de icon-name) o del config local
  const iconoNombre = (insignia.icono as string) || frontendCfg?.icono || 'award';
  const fechaStr    = formatDateSafe(insignia.obtenidaEn);

  return (
    <div
      className={`group relative rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all duration-200 ${
        insignia.obtenida
          ? 'bg-white hover:shadow-lg hover:-translate-y-0.5'
          : 'bg-gray-50 opacity-55 grayscale'
      }`}
      style={
        insignia.obtenida
          ? { borderColor: `${rarezaColor}35`, boxShadow: `0 1px 3px ${rarezaColor}08` }
          : { borderColor: '#e5e7eb' }
      }
    >
      {/* Rareza pill — solo en obtenidas */}
      {insignia.obtenida && (
        <span
          className="absolute top-2 right-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full"
          style={{ background: `${rarezaColor}15`, color: rarezaColor }}
        >
          {rareza}
        </span>
      )}

      {/* Ícono SVG */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 ${
          insignia.obtenida ? 'group-hover:scale-110' : ''
        }`}
        style={
          insignia.obtenida
            ? { background: `${rarezaColor}15`, border: `2px solid ${rarezaColor}30` }
            : { background: '#f3f4f6' }
        }
      >
        <GamificacionIcon
          name={iconoNombre}
          className="w-6 h-6"
          strokeColor={insignia.obtenida ? rarezaColor : '#9ca3af'}
        />
      </div>

      {/* Nombre */}
      <p className={`text-sm font-bold leading-tight ${insignia.obtenida ? 'text-[#0a1628]' : 'text-gray-400'}`}>
        {insignia.nombre}
      </p>

      {/* Criterio */}
      <p className={`text-xs leading-normal font-medium ${insignia.obtenida ? 'text-[#6b8cba]' : 'text-gray-300'}`}>
        {criterio}
      </p>

      {/* Fecha o estado */}
      {insignia.obtenida && fechaStr ? (
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: rarezaColor }}>
          {fechaStr}
        </span>
      ) : (
        <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
          {insignia.obtenida ? '—' : 'Bloqueada'}
        </span>
      )}
    </div>
  );
}

// ── Props del componente padre ────────────────────────────────────────────────
interface GaleriaInsigniasProps {
  insignias: Insignia[];
  noVistas?: number;
  onMarcarVistas?: () => void;
}

type FiltroEstado    = 'todas' | 'obtenidas' | 'bloqueadas';
type FiltroCategoria = 'todas' | 'primeros_pasos' | 'constancia' | 'comprension' | 'exploracion' | 'logros_mayores';

// ── Componente principal ──────────────────────────────────────────────────────
export default function GaleriaInsignias({
  insignias,
  noVistas = 0,
  onMarcarVistas,
}: GaleriaInsigniasProps) {
  const [filtroEstado,    setFiltroEstado]    = useState<FiltroEstado>('todas');
  const [filtroCategoria, setFiltroCategoria] = useState<FiltroCategoria>('todas');
  const [toasts,          setToasts]          = useState<ToastInsignia[]>([]);

  useEffect(() => {
    if (noVistas > 0 && onMarcarVistas) {
      const nuevas = insignias
        .filter(i => i.obtenida && !i.visto)
        .map(i => ({
          id:        i.id,
          nombre:    i.nombre,
          icono:     (i.icono as string) || getBadgeConfig(i.clave)?.icono || 'award',
          categoria: i.categoria ?? 'general',
        }));

      if (nuevas.length > 0) {
        nuevas.forEach((t, idx) => {
          setTimeout(() => setToasts(prev => [...prev, t]), idx * 800);
        });
        onMarcarVistas();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Unificar catálogo de 24 insignias ───────────────────────────────────────
  // El backend puede devolver:
  //   A) Las 24 insignias con obtenida: true/false
  //   B) Solo las insignias obtenidas (sin el campo obtenida o con obtenida: true)
  // En ambos casos hacemos merge correcto con BADGE_CONFIG como catálogo base.
  const todasLasInsignias = BADGE_CONFIG.map((config, idx) => {
    const backendInsignia = insignias.find(
      i => i.clave === config.clave || i.clave?.trim() === config.clave?.trim()
    );

    // Determinar si está obtenida:
    // - Si el backend la devolvió y tiene obtenida: true  → obtenida
    // - Si el backend la devolvió pero obtenida es false  → no obtenida
    // - Si el backend no la devolvió en absoluto          → no obtenida
    const obtenida = backendInsignia != null
      ? (backendInsignia.obtenida === true)
      : false;

    return {
      id:         backendInsignia?.id ?? (1000 + idx),
      clave:      config.clave,
      nombre:     config.nombre,
      descripcion: config.criterio,
      icono:      backendInsignia?.icono || config.icono,
      categoria:  config.categoria,
      obtenida,
      obtenidaEn: backendInsignia?.obtenidaEn ?? null,
      visto:      backendInsignia?.visto ?? true,
    };
  });

  // ── Filtrar ────────────────────────────────────────────────────────────────
  const filtradas = todasLasInsignias.filter(i => {
    const pasaEstado =
      filtroEstado === 'todas'      ? true :
      filtroEstado === 'obtenidas'  ? i.obtenida :
      /* bloqueadas */               !i.obtenida;

    const pasaCategoria =
      filtroCategoria === 'todas'
        ? true
        : i.categoria === filtroCategoria;

    return pasaEstado && pasaCategoria;
  });

  const enriquecidas = filtradas;

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalObtenidas = insignias.filter(i => i.obtenida).length;
  const total          = BADGE_CONFIG.length;
  const pctTotal       = total > 0 ? Math.round((totalObtenidas / total) * 100) : 0;

  const getCategoryCountInfo = (catKey: FiltroCategoria) => {
    if (catKey === 'todas') {
      return { obtenidas: totalObtenidas, total };
    }
    const catBadges = todasLasInsignias.filter(i => i.categoria === catKey);
    const catTotal = catBadges.length;
    const catObt = catBadges.filter(i => i.obtenida).length;
    return { obtenidas: catObt, total: catTotal };
  };

  const FILTROS_ESTADO: { key: FiltroEstado; label: string }[] = [
    { key: 'todas',      label: 'Todas'      },
    { key: 'obtenidas',  label: 'Obtenidas'  },
    { key: 'bloqueadas', label: 'Bloqueadas' },
  ];

  const FILTROS_CAT: { key: FiltroCategoria; iconoNombre: string; label: string }[] = [
    { key: 'todas',          iconoNombre: 'award',       label: 'Todas'          },
    { key: 'primeros_pasos', iconoNombre: 'rocket',      label: 'Primeros Pasos' },
    { key: 'constancia',     iconoNombre: 'fire',        label: 'Constancia'     },
    { key: 'comprension',    iconoNombre: 'light-bulb',  label: 'Comprensión'    },
    { key: 'exploracion',    iconoNombre: 'globe',       label: 'Exploración'    },
    { key: 'logros_mayores', iconoNombre: 'trophy',      label: 'Logros Mayores' },
  ];

  return (
    <>
      {/* ── Toasts ── */}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <InsigniaToast toast={t} onDismiss={() => dismissToast(t.id)} />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* ── Header con progreso ── */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#1A2F45] rounded-3xl p-6 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-[#6b8cba] font-bold mb-1">
                Tu colección de insignias
              </p>
              <h2 className="font-playfair text-2xl font-black text-white mb-0.5">
                {totalObtenidas} de {total} insignias
              </h2>
              <p className="text-sm text-white/60 font-lora italic">
                {pctTotal < 25  ? 'Estás comenzando. ¡Sigue así!' :
                 pctTotal < 50  ? 'Buen ritmo. Ya vas por la mitad.' :
                 pctTotal < 75  ? 'Más de la mitad. Impresionante.' :
                                  'Casi completa. Eres una leyenda.'}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="flex items-baseline gap-1">
                <span className="font-playfair text-6xl font-black text-[#d4af37]">{pctTotal}</span>
                <span className="text-xl text-white/40">%</span>
              </div>
              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pctTotal}%`,
                    background: 'linear-gradient(90deg, #d4af3780, #d4af37)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Filtros de estado ── */}
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white border border-[#c8d8f0]/50 rounded-xl overflow-hidden shadow-sm">
            {FILTROS_ESTADO.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltroEstado(f.key)}
                className={`px-5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  filtroEstado === f.key
                    ? 'bg-[#0a1628] text-[#d4af37]'
                    : 'text-[#6b8cba] hover:text-[#0a1628]'
                }`}
              >
                {f.label}
                {f.key === 'obtenidas' && (
                  <span className="ml-1.5 bg-[#d4af37]/20 text-[#d4af37] rounded-full px-2 py-0.5 text-[10px] font-semibold">
                    {totalObtenidas}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filtros de categoría ── */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 whitespace-nowrap" style={{ scrollbarWidth: 'none' }}>
          {FILTROS_CAT.map(f => {
            const counts = getCategoryCountInfo(f.key);
            const isActive = filtroCategoria === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFiltroCategoria(f.key)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-150 flex-shrink-0 ${
                  isActive
                    ? 'bg-[#0a1628] text-[#d4af37] border-[#0a1628] shadow-sm'
                    : 'bg-white text-[#1e3a6e] border-[#c8d8f0]/60 hover:border-[#0a1628]/30 hover:text-[#0a1628]'
                }`}
              >
                <GamificacionIcon
                  name={f.iconoNombre}
                  className="w-4 h-4 flex-shrink-0"
                  strokeColor={isActive ? '#d4af37' : '#6b8cba'}
                />
                <span>{f.label}</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isActive
                      ? 'bg-[#d4af37]/20 text-[#d4af37]'
                      : 'bg-[#c8d8f0]/30 text-[#6b8cba]'
                  }`}
                >
                  {counts.obtenidas}/{counts.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Grid de insignias ── */}
        {enriquecidas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#c8d8f0]/50">
            <div className="w-12 h-12 rounded-full bg-[#c8d8f0]/30 flex items-center justify-center mx-auto mb-3">
              <GamificacionIcon name="search" className="w-6 h-6" strokeColor="#6b8cba" />
            </div>
            <p className="font-playfair text-lg font-bold text-[#0a1628] mb-1">
              Sin resultados para este filtro
            </p>
            <p className="text-sm text-[#6b8cba] font-lora italic">
              Prueba cambiando la categoría o el estado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {enriquecidas.map((insignia, i) => (
              <div
                key={insignia.id}
                style={{ animationDelay: `${i * 25}ms` }}
                className="animate-card-in"
              >
                <TarjetaInsignia insignia={insignia} />
              </div>
            ))}
          </div>
        )}


      </div>
    </>
  );
}
