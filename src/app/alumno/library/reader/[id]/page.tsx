'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AlumnoLibrosService } from '../../../../../service/alumno/libros.service';
import { LibroDetalle } from '../../../../../types/alumno/libros';
import { toast } from '../../../../../utils/toast';

export default function ReaderPage() {
    const params       = useParams();
    const router       = useRouter();
    const searchParams = useSearchParams();
    const libroId      = Number(params.id);
    const initialSegId = searchParams.get('segmento') ? Number(searchParams.get('segmento')) : null;

    const [libro,       setLibro]       = useState<LibroDetalle | null>(null);
    const [currentIdx,  setCurrentIdx]  = useState(0);
    const [isLoading,   setIsLoading]   = useState(true);
    const [isSaving,    setIsSaving]    = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    // ── Load book ─────────────────────────────────────────────────────────────
    const fetchLibro = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await AlumnoLibrosService.getLibroDetalle(libroId);
            setLibro(data);
            if (data.segmentos?.length > 0) {
                const targetId = initialSegId || data.ultimoSegmentoId;
                const idx = data.segmentos.findIndex(s => s.id === targetId);
                setCurrentIdx(idx >= 0 ? idx : 0);
            }
        } catch {
            toast.error('No pudimos cargar el libro. Intenta de nuevo.');
            router.push('/alumno/library');
        } finally {
            setIsLoading(false);
        }
    }, [libroId, initialSegId, router]);

    useEffect(() => { fetchLibro(); }, [fetchLibro]);

    const totalSegments  = libro?.segmentos?.length ?? 0;
    const currentSegment = libro?.segmentos?.[currentIdx] ?? null;

    const progressPercent = useMemo(() => {
        if (!totalSegments) return 0;
        return Math.round(((currentIdx + 1) / totalSegments) * 100);
    }, [currentIdx, totalSegments]);

    const saveProgress = async (segId: number, idx: number) => {
        if (!libro) return;
        try {
            setIsSaving(true);
            const pct = Math.round(((idx + 1) / totalSegments) * 100);
            await AlumnoLibrosService.updateProgreso(libroId, { ultimoSegmentoId: segId, porcentaje: pct });
        } catch (e) { console.error(e); }
        finally { setIsSaving(false); }
    };

    const handleNext = () => {
        if (currentIdx < totalSegments - 1) {
            const next = currentIdx + 1;
            setCurrentIdx(next);
            const seg = libro?.segmentos[next];
            if (seg) saveProgress(seg.id, next);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            toast.success('¡Has terminado este libro! ¡Felicidades! 🏆');
            setTimeout(() => router.push('/alumno/library'), 2000);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            const prev = currentIdx - 1;
            setCurrentIdx(prev);
            const seg = libro?.segmentos[prev];
            if (seg) saveProgress(seg.id, prev);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const selectSegment = (idx: number) => {
        setShowSidebar(false);
        setCurrentIdx(idx);
        const seg = libro?.segmentos[idx];
        if (seg) saveProgress(seg.id, idx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ─────────────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-[#fbf8f1] flex flex-col items-center justify-center z-[200]">
                <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-playfair text-xl text-[#2b1b17] animate-pulse">Abriendo el libro...</p>
            </div>
        );
    }
    if (!libro || !currentSegment) return null;

    return (
        <div className="min-h-screen bg-[#fbf8f1] flex flex-col font-lora text-[#2b1b17]">

            {/* Header */}
            <header className="sticky top-0 z-[110] bg-white/80 backdrop-blur-md border-b border-[#e3dac9] px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/alumno/library')}
                        className="p-2 hover:bg-[#fbf8f1] rounded-full transition-colors group" title="Volver">
                        <svg className="w-6 h-6 text-[#8d6e3f] group-hover:text-[#2b1b17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="font-playfair font-bold text-lg md:text-xl line-clamp-1">{libro.titulo}</h1>
                        <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">
                            {currentSegment.unidadNombre || 'Contenido'} • {currentIdx + 1} de {totalSegments}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-black text-[#a1887f]">PROGRESO</span>
                        <div className="w-32 h-1.5 bg-[#f0e6d2] rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-[#d4af37] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                    <button onClick={() => setShowSidebar(true)}
                        className="p-2 bg-[#2b1b17] text-white rounded-lg hover:bg-[#3e2723] transition-all shadow-md flex items-center gap-2 px-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Capítulos</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-20 relative">
                <div className="pointer-events-none absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#d4af37]/20 -translate-x-4 -translate-y-4" />
                <div className="pointer-events-none absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#d4af37]/20 translate-x-4 -translate-y-4" />

                <article className="prose prose-stone prose-lg max-w-none">
                    <div className="text-center mb-16">
                        <span className="inline-block w-12 h-0.5 bg-[#d4af37] mb-6" />
                        <h2 className="font-playfair italic text-3xl md:text-4xl text-[#8d6e3f] mb-4">
                            {currentSegment.titulo}
                        </h2>
                        {currentSegment.numeroPagina && (
                            <p className="text-[#a1887f] text-sm">Página {currentSegment.numeroPagina}</p>
                        )}
                    </div>
                    <div className="text-[#2b1b17] leading-[2] text-justify font-lora text-lg md:text-xl selection:bg-[#d4af37]/30"
                         style={{ hyphens: 'auto' }}>
                        {currentSegment.contenido?.split('\n').map((para, i) => (
                            <p key={i} className="mb-8 indent-8 first:indent-0">{para}</p>
                        ))}
                    </div>
                </article>

                {/* Navigation */}
                <div className="mt-20 pt-8 border-t border-[#e3dac9] flex items-center justify-between">
                    <button onClick={handlePrev}
                        disabled={currentIdx === 0}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl border border-[#e3dac9] text-[#8d6e3f] font-bold hover:bg-white hover:text-[#2b1b17] disabled:opacity-30 disabled:pointer-events-none transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                    </button>
                    <span className="text-xs font-black text-[#a1887f] uppercase tracking-widest">
                        {currentIdx + 1} / {totalSegments}
                    </span>
                    <button onClick={handleNext}
                        className="flex items-center gap-3 px-10 py-3 rounded-xl bg-[#2b1b17] text-white font-bold hover:bg-[#3e2723] hover:-translate-y-0.5 transition-all shadow-lg active:translate-y-0">
                        {currentIdx === totalSegments - 1 ? 'Finalizar' : 'Siguiente'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </main>

            {/* Sidebar */}
            <div className={`fixed inset-0 z-[150] transition-opacity duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                 onClick={() => setShowSidebar(false)}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <aside className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
                       onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-playfair font-bold text-xl text-[#2b1b17]">Capítulos</h3>
                        <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {libro.segmentos.map((seg, idx) => {
                            const isActive = idx === currentIdx;
                            return (
                                <button key={seg.id} onClick={() => selectSegment(idx)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${isActive ? 'bg-[#fbf8f1] border-[#d4af37] shadow-sm' : 'border-transparent hover:bg-gray-50'}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${isActive ? 'bg-[#2b1b17] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate ${isActive ? 'text-[#2b1b17]' : 'text-gray-600'}`}>{seg.titulo}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{seg.unidadNombre || 'Sección'}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>

            {isSaving && (
                <div className="fixed bottom-8 right-8 z-[200] bg-white/90 backdrop-blur-sm border border-[#e3dac9] px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black text-[#8d6e3f] uppercase tracking-widest">Sincronizando...</span>
                </div>
            )}
        </div>
    );
}