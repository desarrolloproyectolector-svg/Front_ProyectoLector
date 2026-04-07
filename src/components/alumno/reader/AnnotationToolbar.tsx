'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  SelectionState,
  AnnotationType,
  HighlightColor,
  HIGHLIGHT_COLORS,
  HIGHLIGHT_BORDER,
  HIGHLIGHT_SOLID,
} from '../../../hooks/useAnnotations';

interface AnnotationToolbarProps {
  selection:      SelectionState | null;
  pendingType:    AnnotationType | null;
  setPendingType: (t: AnnotationType | null) => void;
  commentDraft:   string;
  setCommentDraft:(v: string) => void;
  onHighlight:    (color: HighlightColor) => void;
  onComentario:   (texto: string) => void;
  onClear:        () => void;
}

const COLORS: HighlightColor[] = ['amarillo', 'verde', 'rosa', 'azul'];

// Gradientes suaves para los swatches
const SWATCH_GRADIENTS: Record<HighlightColor, string> = {
  amarillo: 'radial-gradient(circle at 30% 30%, #fde68a, #f59e0b)',
  verde:    'radial-gradient(circle at 30% 30%, #86efac, #16a34a)',
  rosa:     'radial-gradient(circle at 30% 30%, #f9a8d4, #db2777)',
  azul:     'radial-gradient(circle at 30% 30%, #93c5fd, #2563eb)',
};

const COLOR_LABELS: Record<HighlightColor, string> = {
  amarillo: 'Amarillo',
  verde:    'Verde',
  rosa:     'Rosa',
  azul:     'Azul',
};

export default function AnnotationToolbar({
  selection,
  pendingType,
  setPendingType,
  commentDraft,
  setCommentDraft,
  onHighlight,
  onComentario,
  onClear,
}: AnnotationToolbarProps) {
  const toolbarRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [pos, setPos]       = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<HighlightColor | null>(null);

  // Calcular posición sobre la selección (position:fixed)
  useEffect(() => {
    if (!selection) { setVisible(false); return; }
    const { rect } = selection;
    const toolbarW = 280;
    const gap = 10;

    let left = rect.left + rect.width / 2 - toolbarW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - toolbarW - 8));

    setPos({ top: rect.top - gap, left });
    // Pequeño delay para permitir la animación de entrada
    setTimeout(() => setVisible(true), 10);
  }, [selection]);

  // Focus en textarea al abrir comentario
  useEffect(() => {
    if (pendingType === 'comentario') {
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [pendingType]);

  if (!selection) return null;

  const showColorPicker = pendingType === 'highlight';
  const showCommentModal = pendingType === 'comentario';

  return (
    <>
      {/* ── Toolbar flotante ────────────────────────────────────── */}
      <div
        ref={toolbarRef}
        style={{
          top: pos.top,
          left: pos.left,
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(-100%) scale(1)'
            : 'translateY(-90%) scale(0.92)',
          transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        className="fixed z-[500]"
      >
        {/* Contenedor principal */}
        <div
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(20,10,4,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Barra de acciones */}
          <div className="flex items-center gap-1 px-2 py-2">

            {/* Botón Marcatextos */}
            <button
              onMouseDown={e => { e.preventDefault(); setPendingType('highlight'); }}
              title="Marcar texto"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
              style={{
                background: pendingType === 'highlight'
                  ? 'rgba(212,175,55,0.25)'
                  : 'transparent',
                color: pendingType === 'highlight' ? '#f5d060' : 'rgba(212,175,55,0.7)',
                outline: pendingType === 'highlight'
                  ? '1px solid rgba(212,175,55,0.4)'
                  : '1px solid transparent',
              }}
            >
              {/* Ícono marcatextos */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M9 3h6l3 7H6L9 3z" fill="currentColor" opacity="0.5"/>
                <path d="M6 10l3 7h6l3-7" fill="currentColor" opacity="0.25"/>
                <path d="M8 20h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="uppercase tracking-wider text-[10px]">Marcar</span>
            </button>

            {/* Botón Nota */}
            <button
              onMouseDown={e => { e.preventDefault(); setPendingType('comentario'); }}
              title="Agregar nota"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
              style={{
                background: pendingType === 'comentario'
                  ? 'rgba(212,175,55,0.25)'
                  : 'transparent',
                color: pendingType === 'comentario' ? '#f5d060' : 'rgba(212,175,55,0.7)',
                outline: pendingType === 'comentario'
                  ? '1px solid rgba(212,175,55,0.4)'
                  : '1px solid transparent',
              }}
            >
              {/* Ícono nota */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" fill="currentColor" opacity="0.2"/>
              </svg>
              <span className="uppercase tracking-wider text-[10px]">Nota</span>
            </button>

            {/* Separador */}
            <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Cerrar */}
            <button
              onMouseDown={e => { e.preventDefault(); onClear(); }}
              title="Cancelar"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 text-white/30 hover:text-white/80 hover:bg-white/10"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sub-barra: selector de colores */}
          {showColorPicker && (
            <div
              className="flex items-center justify-center gap-3 px-4 py-2.5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              {COLORS.map(color => {
                const isHovered = hoveredColor === color;
                return (
                  <button
                    key={color}
                    onMouseDown={e => { e.preventDefault(); onHighlight(color); }}
                    onMouseEnter={() => setHoveredColor(color)}
                    onMouseLeave={() => setHoveredColor(null)}
                    title={COLOR_LABELS[color]}
                    className="relative flex flex-col items-center gap-1 transition-all duration-150"
                    style={{ transform: isHovered ? 'scale(1.2) translateY(-2px)' : 'scale(1)' }}
                  >
                    {/* Swatch circular */}
                    <div
                      className="w-7 h-7 rounded-full transition-all duration-150"
                      style={{
                        background: SWATCH_GRADIENTS[color],
                        boxShadow: isHovered
                          ? `0 4px 16px ${HIGHLIGHT_SOLID[color]}80, 0 0 0 2px ${HIGHLIGHT_SOLID[color]}60`
                          : `0 2px 8px ${HIGHLIGHT_SOLID[color]}40`,
                        border: `2px solid ${HIGHLIGHT_BORDER[color]}`,
                      }}
                    />
                    {/* Label */}
                    <span
                      className="text-[7px] font-black uppercase tracking-widest transition-all"
                      style={{
                        color: isHovered ? '#fff' : 'rgba(255,255,255,0.35)',
                        opacity: isHovered ? 1 : 0.7,
                      }}
                    >
                      {COLOR_LABELS[color].slice(0, 3)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Flecha apuntando hacia abajo (hacia la selección) */}
        <div className="flex justify-center mt-[-1px]">
          <div
            className="w-3 h-3 rotate-45 rounded-sm"
            style={{
              background: 'rgba(20,10,4,0.92)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: 'none',
              borderLeft: 'none',
            }}
          />
        </div>
      </div>

      {/* ── Modal de comentario ─────────────────────────────────── */}
      {showCommentModal && (
        <div
          className="fixed inset-0 z-[600] flex items-center justify-center p-4"
          style={{
            background: 'rgba(20,10,4,0.5)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeInBackdrop 0.2s ease both',
          }}
          onMouseDown={e => { if (e.target === e.currentTarget) onClear(); }}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,251,245,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,175,55,0.1)',
              animation: 'scaleInModal 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            {/* Header del modal */}
            <div
              className="px-6 pt-6 pb-4"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  {/* Ícono + Título */}
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d4af37)' }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </div>
                    <h3 className="font-playfair font-bold text-[#2b1b17] text-base">
                      Nueva nota
                    </h3>
                  </div>
                  {/* Texto seleccionado */}
                  <p className="text-[10px] text-[#a1887f] italic line-clamp-2 pl-9">
                    &ldquo;{selection.text.slice(0, 80)}{selection.text.length > 80 ? '…' : ''}&rdquo;
                  </p>
                </div>
                <button
                  onClick={onClear}
                  className="p-1.5 rounded-full hover:bg-[#fbf8f1] transition-colors shrink-0 mt-0.5"
                >
                  <svg className="w-3.5 h-3.5 text-[#c9b99a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cuerpo */}
            <div className="px-6 py-4">
              <textarea
                ref={textareaRef}
                value={commentDraft}
                onChange={e => setCommentDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onComentario(commentDraft);
                  if (e.key === 'Escape') onClear();
                }}
                placeholder="Escribe tu nota aquí..."
                rows={4}
                className="w-full resize-none rounded-xl p-3.5 text-sm font-lora text-[#2b1b17] placeholder-[#c9b99a] transition-all"
                style={{
                  background: '#faf7f0',
                  border: '1.5px solid rgba(212,175,55,0.2)',
                  outline: 'none',
                }}
                onFocus={e => {
                  e.target.style.border = '1.5px solid rgba(212,175,55,0.6)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)';
                }}
                onBlur={e => {
                  e.target.style.border = '1.5px solid rgba(212,175,55,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p className="text-[9px] text-[#c9b99a] mt-1.5 text-right select-none">
                Ctrl+Enter para guardar · Esc para cancelar
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={onClear}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(212,175,55,0.25)',
                  color: '#8d6e3f',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.background = '#fbf8f1';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.background = 'transparent';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => onComentario(commentDraft)}
                disabled={!commentDraft.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #3e2723, #2b1b17)',
                  boxShadow: '0 4px 12px rgba(43,27,23,0.3)',
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                Guardar nota
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}