'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActiveTool,
  HighlightColor,
  HIGHLIGHT_SOLID,
} from '../../../hooks/useAnnotations';

interface AnnotationSidebarProps {
  activeTool: ActiveTool;
  onToggle:   (tool: ActiveTool) => void;
}

const COLORS: HighlightColor[] = ['amarillo', 'verde', 'rosa', 'azul'];

const COLOR_LABELS: Record<HighlightColor, string> = {
  amarillo: 'Amarillo',
  verde:    'Verde',
  rosa:     'Rosa',
  azul:     'Azul',
};

const COLOR_GRADIENTS: Record<HighlightColor, string> = {
  amarillo: 'radial-gradient(circle at 30% 30%, #fde68a, #f59e0b)',
  verde:    'radial-gradient(circle at 30% 30%, #86efac, #16a34a)',
  rosa:     'radial-gradient(circle at 30% 30%, #f9a8d4, #db2777)',
  azul:     'radial-gradient(circle at 30% 30%, #93c5fd, #2563eb)',
};

// ── Íconos ───────────────────────────────────────────────────────────────────

function IconHighlighter({ color, active }: { color: string; active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <path d="M9 3h6l3 7H6L9 3z"
        fill={active ? 'white' : color}
        stroke={active ? 'white' : color}
        strokeWidth="0.5"
        opacity={active ? 1 : 0.8}/>
      <path d="M6 10l3 7h6l3-7"
        fill={active ? 'rgba(255,255,255,0.35)' : `${color}44`}
        stroke={active ? 'white' : color}
        strokeWidth="0.5"/>
      <path d="M8 20h8" stroke={active ? 'white' : color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconPen({ active }: { active: boolean }) {
  const c = active ? '#fff' : '#9e8672';
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <path d="M12 20h9" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.15)' : 'transparent'}/>
    </svg>
  );
}

function IconGrip() {
  return (
    <svg viewBox="0 0 10 16" fill="currentColor" className="w-2 h-3">
      <circle cx="2" cy="3"  r="1.2"/><circle cx="8" cy="3"  r="1.2"/>
      <circle cx="2" cy="8"  r="1.2"/><circle cx="8" cy="8"  r="1.2"/>
      <circle cx="2" cy="13" r="1.2"/><circle cx="8" cy="13" r="1.2"/>
    </svg>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipProps { label: string; sublabel?: string; visible: boolean; }

function Tooltip({ label, sublabel, visible }: TooltipProps) {
  if (!visible) return null;
  return (
    <div
      className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ animation: 'fadeInLeft 0.14s ease both', zIndex: 300 }}
    >
      <div
        className="flex flex-col px-2.5 py-1.5 rounded-lg whitespace-nowrap"
        style={{
          background:     'rgba(40,28,20,0.92)',
          backdropFilter: 'blur(12px)',
          border:         '1px solid rgba(255,255,255,0.08)',
          boxShadow:      '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <span className="text-[9px] font-black uppercase tracking-widest text-white/90">{label}</span>
        {sublabel && <span className="text-[7px] font-medium text-white/45 mt-0.5 tracking-wide">{sublabel}</span>}
      </div>
      <div
        className="absolute left-full top-1/2 -translate-y-1/2 -ml-px w-1.5 h-1.5 rotate-45"
        style={{
          background:   'rgba(40,28,20,0.92)',
          borderRight:  '1px solid rgba(255,255,255,0.08)',
          borderTop:    '1px solid rgba(255,255,255,0.08)',
        }}
      />
    </div>
  );
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

type HoverId = 'grip' | 'collapse' | 'close' | 'comentario' | 'clear' | HighlightColor | null;

// ── Estilos base del panel (tema claro y suave) ───────────────────────────────

const panelStyle: React.CSSProperties = {
  background:     'rgba(253, 250, 245, 0.95)',
  backdropFilter: 'blur(20px)',
  border:         '1px solid rgba(180, 155, 120, 0.20)',
  boxShadow:      '0 4px 24px rgba(43,27,23,0.15), 0 1px 4px rgba(43,27,23,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
  borderRadius:   '14px',
};


// ── Componente principal ──────────────────────────────────────────────────────

export default function AnnotationSidebar({ activeTool, onToggle }: AnnotationSidebarProps) {
  const [pos,       setPos]       = useState({ x: 0, y: 0 });
  const [dragging,  setDragging]  = useState(false);
  const [dragOff,   setDragOff]   = useState({ x: 0, y: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const [hidden,    setHidden]    = useState(false);
  const [mounted,   setMounted]   = useState(false);
  const [hovered,   setHovered]   = useState<HoverId>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Posición inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    // Calculamos una posición segura: Centrado verticalmente a la derecha
    // para evitar cualquier posibilidad de encimarse en el header alto.
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    const sidebarW = 52;

    setPos({
      x: Math.max(8, w - sidebarW - 12),       // 12px desde el borde derecho
      y: Math.max(100, (h / 2) - 160),          // Centrado vertical con margen del header
    });
    setMounted(true);
  }, []);

  // ── Lógica de Drag ──────────────────────────────────────────────────────────
  const startDrag = useCallback((cx: number, cy: number) => {
    setDragging(true);
    setDragOff({ x: cx - pos.x, y: cy - pos.y });
  }, [pos]);

  const onMouseDown  = useCallback((e: React.MouseEvent) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }, [startDrag]);
  const onTouchStart = useCallback((e: React.TouchEvent) => { const t = e.touches[0]; if (t) startDrag(t.clientX, t.clientY); }, [startDrag]);

  useEffect(() => {
    if (!dragging) return;
    const move = (cx: number, cy: number) => {
      const pw = panelRef.current?.offsetWidth  ?? 52;
      const ph = panelRef.current?.offsetHeight ?? 200;
      setPos({
        x: Math.max(8, Math.min(window.innerWidth  - pw - 8, cx - dragOff.x)),
        // Top cap mantenido en 16px para que pueda llevarse hasta arriba si se quiere
        y: Math.max(16, Math.min(window.innerHeight - ph - 8, cy - dragOff.y)),
      });
    };
    const mm = (e: MouseEvent) => move(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); };
    const up = () => setDragging(false);
    
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup',   up);
    window.addEventListener('touchmove', tm, { passive: true });
    window.addEventListener('touchend',  up);
    
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup',   up);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('touchend',  up);
    };
  }, [dragging, dragOff]);

  if (!mounted) return null;

  // ── Estado CERRADO — botón compacto para reabrir ────────────────────────────
  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        title="Abrir herramientas de anotación"
        className="fixed z-[120] flex items-center justify-center gap-2 p-2 px-3 rounded-xl hover:shadow-md active:scale-95 transition-all duration-200"
        style={{
          left:       pos.x > window.innerWidth / 2 ? 'auto' : pos.x,
          right:      pos.x > window.innerWidth / 2 ? window.innerWidth - pos.x - 52 : 'auto', // aproximación si estaba en la derecha
          top:        pos.y,
          animation:  'fadeInPanel 0.2s ease both',
          ...panelStyle
        }}
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center transition-all bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm shrink-0">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#5a3e30]/80">
          Anotar
        </span>
      </button>
    );
  }

  // ── Panel principal (FLOTANTE y ARRASTRABLE) ──────────────────────────────────
  return (
    <div
      ref={panelRef}
      className={`fixed z-[120] flex flex-col items-center ${dragging ? 'pointer-events-none' : ''}`}
      style={{
        left:       pos.x,
        top:        pos.y,
        width:      '52px',
        animation:  'slideInPanel 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        userSelect: 'none',
        ...panelStyle
      }}
    >
      {/* Wrapper interactivo de eventos del bloque principal */}
      <div className={`flex flex-col w-full h-full ${dragging ? 'pointer-events-auto cursor-grabbing' : ''}`}>
        
        {/* ── Header del drag y controles ────────────────────────────────────── */}
        <div
          className="flex flex-col relative"
          style={{
            borderBottom:  collapsed ? 'none' : '1px solid rgba(180,155,120,0.12)',
            background:    'rgba(247,242,235,0.6)',
            borderRadius:  '14px 14px 0 0',
          }}
        >
          {/* GRIP para arrastrar */}
          <div className="w-full flex justify-center items-center pt-2 pb-0.5">
             <Tooltip label="Mover panel" sublabel="Arrastra para reubicar" visible={hovered === 'grip'} />
             <div
               onMouseDown={onMouseDown}
               onTouchStart={onTouchStart}
               onMouseEnter={() => setHovered('grip')}
               onMouseLeave={() => setHovered(null)}
               className="w-full h-6 flex items-center justify-center rounded cursor-grab active:cursor-grabbing hover:bg-black/5 transition-colors text-[#5a3e30]/30 hover:text-[#5a3e30]/60"
             >
               <IconGrip />
             </div>
          </div>

          <div className="flex items-center justify-center gap-1 pb-2">
            {/* Colapsar */}
            <div className="relative">
              <Tooltip
                label={collapsed ? 'Expandir' : 'Colapsar'}
                sublabel={collapsed ? 'Mostrar herramientas' : 'Ocultar herramientas'}
                visible={hovered === 'collapse'}
              />
              <button
                onClick={() => setCollapsed(c => !c)}
                onMouseEnter={() => setHovered('collapse')}
                onMouseLeave={() => setHovered(null)}
                className="w-5 h-5 rounded flex items-center justify-center transition-all hover:bg-black/[0.06]"
                style={{ color: 'rgba(90,62,48,0.40)' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  {collapsed ? <path d="M19 9l-7 7-7-7"/> : <path d="M5 15l7-7 7 7"/>}
                </svg>
              </button>
            </div>

            {/* Cerrar */}
            <div className="relative">
              <Tooltip label="Cerrar panel" sublabel="Minimizar a un botón" visible={hovered === 'close'} />
              <button
                onClick={() => { onToggle(null); setHidden(true); }}
                onMouseEnter={() => setHovered('close')}
                onMouseLeave={() => setHovered(null)}
                className="w-5 h-5 rounded flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-400"
                style={{ color: 'rgba(90,62,48,0.30)' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Herramientas ────────────────────────────────────────────────────── */}
        {!collapsed && (
          <div className="flex flex-col items-center gap-1 py-3 px-1.5 cursor-default">

            {/* Marcatextos de color */}
            {COLORS.map(color => {
              const isActive = activeTool === color;
              const solid    = HIGHLIGHT_SOLID[color];
              return (
                <div key={color} className="relative w-full flex justify-center">
                  <Tooltip
                    label={`Resaltar en ${COLOR_LABELS[color]}`}
                    sublabel="Selecciona texto para marcar"
                    visible={hovered === color}
                  />
                  <button
                    onClick={() => onToggle(color)}
                    onMouseEnter={() => setHovered(color as HighlightColor)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative flex items-center justify-center rounded-lg transition-all duration-150"
                    style={{
                      width:         '36px',
                      height:        '36px',
                      background:    isActive ? `${solid}12` : 'transparent',
                      outline:       isActive ? `1.5px solid ${solid}40` : '1.5px solid transparent',
                      outlineOffset: '2px',
                      transform:     isActive ? 'scale(1.06)' : 'scale(1)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full transition-all duration-150"
                      style={{
                        width:      isActive ? '26px' : '22px',
                        height:     isActive ? '26px' : '22px',
                        background: isActive ? COLOR_GRADIENTS[color] : `${solid}26`,
                        boxShadow:  isActive ? `0 2px 8px ${solid}50` : 'none',
                      }}
                    >
                      <IconHighlighter color={solid} active={isActive} />
                    </div>
                    {isActive && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
                        style={{ background: solid, boxShadow: `0 0 4px ${solid}`, animation: 'pulse 1.5s ease-in-out infinite' }}
                      />
                    )}
                  </button>
                </div>
              );
            })}

            {/* Divisor */}
            <div className="w-7 h-px my-1" style={{ background: 'rgba(180,155,120,0.20)' }}/>

            {/* Nota / comentario */}
            <div className="relative w-full flex justify-center">
              <Tooltip
                label="Añadir nota"
                sublabel="Selecciona texto y escribe"
                visible={hovered === 'comentario'}
              />
              <button
                onClick={() => onToggle('comentario')}
                onMouseEnter={() => setHovered('comentario')}
                onMouseLeave={() => setHovered(null)}
                className="relative flex items-center justify-center rounded-lg transition-all duration-150"
                style={{
                  width:         '36px',
                  height:        '36px',
                  background:    activeTool === 'comentario' ? 'rgba(212,175,55,0.12)' : 'transparent',
                  outline:       activeTool === 'comentario' ? '1.5px solid rgba(212,175,55,0.40)' : '1.5px solid transparent',
                  outlineOffset: '2px',
                  transform:     activeTool === 'comentario' ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-150"
                  style={{
                    width:      activeTool === 'comentario' ? '26px' : '22px',
                    height:     activeTool === 'comentario' ? '26px' : '22px',
                    background: activeTool === 'comentario' ? 'linear-gradient(135deg,#f59e0b,#d4af37)' : 'rgba(180,155,80,0.18)',
                    boxShadow:  activeTool === 'comentario' ? '0 2px 8px rgba(212,175,55,0.45)' : 'none',
                  }}
                >
                  <IconPen active={activeTool === 'comentario'} />
                </div>
                {activeTool === 'comentario' && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                    style={{ boxShadow: '0 0 4px rgba(212,175,55,0.8)', animation: 'pulse 1.5s ease-in-out infinite' }}/>
                )}
              </button>
            </div>

            {/* Desactivar herramienta activa */}
            {activeTool !== null && (
              <>
                <div className="w-7 h-px my-1" style={{ background: 'rgba(180,155,120,0.15)' }}/>
                <div className="relative w-full flex justify-center">
                  <Tooltip label="Desactivar" sublabel="Volver a modo lectura" visible={hovered === 'clear'} />
                  <button
                    onClick={() => onToggle(null)}
                    onMouseEnter={() => setHovered('clear')}
                    onMouseLeave={() => setHovered(null)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-black/[0.05]"
                    style={{ color: 'rgba(120,85,60,0.40)' }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 20H7L3 16l11-11 7 7-1 8z"/><path d="M6.5 17.5l4-4"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Dot indicador cuando está colapsado y hay herramienta activa */}
        {collapsed && activeTool !== null && (
          <div className="flex justify-center pb-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: activeTool === 'comentario' ? '#d4af37' : HIGHLIGHT_SOLID[activeTool as HighlightColor],
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}