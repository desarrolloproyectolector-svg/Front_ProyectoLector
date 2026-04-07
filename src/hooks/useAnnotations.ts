'use client';

import { useState, useCallback, useEffect } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type AnnotationType  = 'highlight' | 'comentario';
export type HighlightColor  = 'amarillo' | 'verde' | 'rosa' | 'azul';

// Herramienta activa: un color de highlight, 'comentario', o null (ninguna)
export type ActiveTool = HighlightColor | 'comentario' | null;

export interface Anotacion {
    id:                string;
    alumnoId:          number | string;
    libroId:           number;
    segmentoId:        number;
    tipo:              AnnotationType;
    textoSeleccionado: string;
    offsetInicio:      number;
    offsetFin:         number;
    color:             HighlightColor | null;
    comentario:        string | null;
    creadoEn:          string;
}

export interface SelectionState {
    text:         string;
    offsetInicio: number;
    offsetFin:    number;
    rect:         DOMRect;
}

// ── Colores ───────────────────────────────────────────────────────────────────

export const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
    amarillo: 'rgba(255, 236, 66, 0.45)',
    verde:    'rgba(134, 239, 172, 0.45)',
    rosa:     'rgba(249, 168, 212, 0.45)',
    azul:     'rgba(147, 197, 253, 0.45)',
};

export const HIGHLIGHT_BORDER: Record<HighlightColor, string> = {
    amarillo: 'rgba(202, 138, 4, 0.6)',
    verde:    'rgba(22, 163, 74, 0.6)',
    rosa:     'rgba(219, 39, 119, 0.6)',
    azul:     'rgba(37, 99, 235, 0.6)',
};

export const HIGHLIGHT_SOLID: Record<HighlightColor, string> = {
    amarillo: '#f59e0b',
    verde:    '#16a34a',
    rosa:     '#db2777',
    azul:     '#2563eb',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(): string {
    return `ann_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function storageKey(libroId: number): string {
    return `anotaciones_libro_${libroId}`;
}

function load(libroId: number): Anotacion[] {
    try {
        const raw = localStorage.getItem(storageKey(libroId));
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function save(libroId: number, anotaciones: Anotacion[]): void {
    localStorage.setItem(storageKey(libroId), JSON.stringify(anotaciones));
}

function getTextOffsetInElement(
    target:       Node,
    offsetInNode: number,
    root:         Element,
): number {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node: Node) {
                let el = node.parentElement;
                while (el && el !== root) {
                    if (el.getAttribute('data-annotation-ignore') === 'true') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    el = el.parentElement;
                }
                return NodeFilter.FILTER_ACCEPT;
            },
        },
    );

    let total = 0;
    let node  = walker.nextNode();
    while (node) {
        if (node === target) return total + offsetInNode;
        total += node.textContent?.length ?? 0;
        node = walker.nextNode();
    }
    return total;
}

function buildParaOffsets(contenido: string): number[] {
    const parrafos = contenido.split('\n');
    const offsets: number[] = [];
    let acc = 0;
    for (const p of parrafos) {
        offsets.push(acc);
        acc += p.length + 1;
    }
    return offsets;
}

export function getSelectionOffsets(
    selection: Selection,
    contenido:  string,
): { offsetInicio: number; offsetFin: number } | null {
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return null;

    const paraOffsets = buildParaOffsets(contenido);
    const startNode   = range.startContainer;
    const endNode     = range.endContainer;

    const startParaEl = (
        startNode.nodeType === Node.TEXT_NODE
            ? startNode.parentElement
            : startNode as Element
    )?.closest('[data-para-index]') as Element | null;

    const endParaEl = (
        endNode.nodeType === Node.TEXT_NODE
            ? endNode.parentElement
            : endNode as Element
    )?.closest('[data-para-index]') as Element | null;

    if (!startParaEl || !endParaEl) return null;

    const startParaIdx = parseInt(startParaEl.getAttribute('data-para-index') ?? '0', 10);
    const endParaIdx   = parseInt(endParaEl.getAttribute('data-para-index') ?? '0', 10);

    const offsetDentroInicio = getTextOffsetInElement(range.startContainer, range.startOffset, startParaEl);
    const offsetDentroFin    = getTextOffsetInElement(range.endContainer,   range.endOffset,   endParaEl);

    const offsetInicio = (paraOffsets[startParaIdx] ?? 0) + offsetDentroInicio;
    const offsetFin    = (paraOffsets[endParaIdx]   ?? 0) + offsetDentroFin;

    if (offsetInicio >= offsetFin) return null;
    return { offsetInicio, offsetFin };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseAnnotationsOptions {
    alumnoId:   number | string;
    libroId:    number;
    segmentoId: number;
}

export function useAnnotations({ alumnoId, libroId, segmentoId }: UseAnnotationsOptions) {
    const [todas,        setTodas]        = useState<Anotacion[]>([]);
    const [selection,    setSelection]    = useState<SelectionState | null>(null);
    const [pendingType,  setPendingType]  = useState<AnnotationType | null>(null);
    const [commentDraft, setCommentDraft] = useState('');
    // Herramienta activa seleccionada desde la barra lateral
    const [activeTool,   setActiveTool]   = useState<ActiveTool>(null);

    useEffect(() => { setTodas(load(libroId)); }, [libroId]);

    const anotacionesDelSegmento = todas.filter(a => a.segmentoId === segmentoId);

    // Alternar herramienta: si ya está activa, la desactiva
    const toggleTool = useCallback((tool: ActiveTool) => {
        setActiveTool(prev => prev === tool ? null : tool);
        setSelection(null);
        setPendingType(null);
    }, []);

    // ── Capturar selección ────────────────────────────────────────────────────

    const handleTextSelection = useCallback((contenido: string) => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
            setSelection(null);
            return;
        }
        const offsets = getSelectionOffsets(sel, contenido);
        if (!offsets) { setSelection(null); return; }

        const rect = sel.getRangeAt(0).getBoundingClientRect();
        const state: SelectionState = {
            text:         sel.toString(),
            offsetInicio: offsets.offsetInicio,
            offsetFin:    offsets.offsetFin,
            rect,
        };

        // Si hay herramienta activa, aplicar directo sin mostrar popup
        if (activeTool !== null) {
            if (activeTool === 'comentario') {
                // Para comentario sí necesitamos el modal — guardar selección y abrir
                setSelection(state);
                setPendingType('comentario');
            } else {
                // Es un color de highlight → aplicar directo
                const nueva: Anotacion = {
                    id: generateId(), alumnoId, libroId, segmentoId,
                    tipo: 'highlight',
                    textoSeleccionado: state.text,
                    offsetInicio: state.offsetInicio,
                    offsetFin:    state.offsetFin,
                    color: activeTool, comentario: null,
                    creadoEn: new Date().toISOString(),
                };
                setTodas(prev => {
                    const next = [...prev, nueva];
                    save(libroId, next);
                    return next;
                });
                window.getSelection()?.removeAllRanges();
            }
            return;
        }

        // Sin herramienta activa → comportamiento original (popup)
        setSelection(state);
        setPendingType(null);
    }, [activeTool, alumnoId, libroId, segmentoId]);

    const clearSelection = useCallback(() => {
        setSelection(null);
        setPendingType(null);
        setCommentDraft('');
        window.getSelection()?.removeAllRanges();
    }, []);

    const addHighlight = useCallback((color: HighlightColor) => {
        if (!selection) return;
        const nueva: Anotacion = {
            id: generateId(), alumnoId, libroId, segmentoId,
            tipo: 'highlight',
            textoSeleccionado: selection.text,
            offsetInicio: selection.offsetInicio,
            offsetFin:    selection.offsetFin,
            color, comentario: null,
            creadoEn: new Date().toISOString(),
        };
        const next = [...todas, nueva];
        setTodas(next); save(libroId, next); clearSelection();
    }, [selection, todas, alumnoId, libroId, segmentoId, clearSelection]);

    const addComentario = useCallback((texto: string) => {
        if (!selection || !texto.trim()) return;
        const nueva: Anotacion = {
            id: generateId(), alumnoId, libroId, segmentoId,
            tipo: 'comentario',
            textoSeleccionado: selection.text,
            offsetInicio: selection.offsetInicio,
            offsetFin:    selection.offsetFin,
            color: null, comentario: texto.trim(),
            creadoEn: new Date().toISOString(),
        };
        const next = [...todas, nueva];
        setTodas(next); save(libroId, next); clearSelection(); setCommentDraft('');
    }, [selection, todas, alumnoId, libroId, segmentoId, clearSelection]);

    const removeAnotacion = useCallback((id: string) => {
        const next = todas.filter(a => a.id !== id);
        setTodas(next); save(libroId, next);
    }, [todas, libroId]);

    const getPayloadParaBack = useCallback(() => todas, [todas]);

    return {
        anotacionesDelSegmento,
        selection, pendingType, setPendingType,
        commentDraft, setCommentDraft,
        activeTool, toggleTool,
        handleTextSelection, clearSelection,
        addHighlight, addComentario, removeAnotacion,
        getPayloadParaBack,
    };
}