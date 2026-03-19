'use client';

import React from 'react';
import { LibroDetalle } from '../../../types/alumno/libros';

interface LibroDetalleModalProps {
    libro: LibroDetalle | null;
    isOpen: boolean;
    onClose: () => void;
    onLeer: (libro: LibroDetalle, segmentoId?: number) => void;
}

export const LibroDetalleModal: React.FC<LibroDetalleModalProps> = ({
    libro,
    isOpen,
    onClose,
    onLeer,
}) => {
    if (!isOpen || !libro) return null;

    const hasStarted = libro.progresoPorcentaje > 0;
    const isCompleted = libro.progresoPorcentaje === 100;

    // Segmentos ordenados por orden
    const segmentosOrdenados = [...(libro.segmentos ?? [])].sort((a, b) => a.orden - b.orden);

    // Detectar cuál es el último segmento leído
    const ultimoSegIdx = libro.ultimoSegmentoId
        ? segmentosOrdenados.findIndex(s => s.id === libro.ultimoSegmentoId)
        : -1;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-[#e3dac9]/30 relative">

                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 bg-white/80 rounded-full hover:bg-[#2b1b17] hover:text-white transition-all shadow-md"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Izquierda: Portada + info básica */}
                <div className="w-full md:w-2/5 bg-[#fbf8f1] p-8 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#e3dac9]/50">
                    <div className="relative group">
                        <div className="w-48 h-64 bg-gradient-to-br from-[#d4af37] to-[#8d6e3f] rounded-xl shadow-2xl flex items-center justify-center p-4 transform rotate-3 transition-transform group-hover:rotate-0">
                            {libro.portadaUrl ? (
                                <img src={libro.portadaUrl} alt={libro.titulo} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="border border-white/20 w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden text-center p-4">
                                    <h3 className="font-playfair font-black text-white text-xl drop-shadow-md">
                                        {libro.titulo}
                                    </h3>
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37] bg-white px-3 py-1 rounded-full shadow-sm border border-[#e3dac9]/30 mb-4 inline-block">
                            {typeof libro.materia === 'string' ? libro.materia : (libro.materia as any)?.nombre || ''}
                        </span>
                        <h2 className="font-playfair font-bold text-2xl text-[#2b1b17] mb-2">{libro.titulo}</h2>
                        <p className="text-[#a1887f] text-sm font-lora italic">{libro.grado}° Grado</p>
                    </div>

                    {/* Progreso real mergeado */}
                    <div className="mt-8 w-full">
                        <div className="flex justify-between text-xs font-black text-[#2b1b17] mb-2">
                            <span>PROGRESO TOTAL</span>
                            <span className={isCompleted ? 'text-emerald-600' : ''}>
                                {isCompleted ? '¡Completado! ✓' : `${libro.progresoPorcentaje}%`}
                            </span>
                        </div>
                        <div className="h-2.5 w-full bg-[#f0e6d2] rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.3)] ${
                                    isCompleted
                                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                        : 'bg-gradient-to-r from-[#d4af37] to-[#c19a2e]'
                                }`}
                                style={{ width: `${libro.progresoPorcentaje}%` }}
                            />
                        </div>

                        {/* Info de segmentos */}
                        {segmentosOrdenados.length > 0 && (
                            <p className="text-[10px] text-[#a1887f] mt-2 text-center">
                                {segmentosOrdenados.length} unidades en total
                                {ultimoSegIdx >= 0 && ` • En unidad ${ultimoSegIdx + 1}`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Derecha: Descripción + segmentos */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white">
                    {libro.descripcion && libro.descripcion.toLowerCase() !== 'string' && (
                        <section className="mb-10">
                            <h4 className="font-playfair font-bold text-lg text-[#2b1b17] mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#d4af37] rounded-full" />
                                Sobre este libro
                            </h4>
                            <p className="text-[#5d4037] font-lora text-sm md:text-base leading-relaxed">
                                {libro.descripcion}
                            </p>
                        </section>
                    )}

                    {segmentosOrdenados.length > 0 && (
                        <section className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-playfair font-bold text-lg text-[#2b1b17] flex items-center gap-2">
                                    <div className="w-1 h-5 bg-[#d4af37] rounded-full" />
                                    Unidades de estudio
                                </h4>
                                <span className="text-[10px] font-black text-[#a1887f] bg-[#fbf8f1] px-2 py-1 rounded border border-[#e3dac9]/50">
                                    {segmentosOrdenados.length} SECCIONES
                                </span>
                            </div>

                            <div className="space-y-3">
                                {segmentosOrdenados.map((seg, index) => {
                                    const isUltimo = seg.id === libro.ultimoSegmentoId;
                                    return (
                                        <div
                                            key={seg.id}
                                            onClick={() => onLeer(libro, seg.id)}
                                            className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                                                isUltimo
                                                    ? 'border-[#d4af37] bg-[#fbf8f1]/80'
                                                    : 'border-[#e3dac9]/30 hover:border-[#d4af37] hover:bg-[#fbf8f1]/50'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                                                isUltimo
                                                    ? 'bg-[#2b1b17] text-white border-[#2b1b17]'
                                                    : 'bg-white border-[#e3dac9] text-[#8d6e3f] group-hover:bg-[#2b1b17] group-hover:text-white group-hover:border-[#2b1b17]'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold text-sm truncate ${isUltimo ? 'text-[#2b1b17]' : 'text-[#2b1b17] group-hover:text-[#8d6e3f]'} transition-colors`}>
                                                    {seg.titulo}
                                                </p>
                                                {isUltimo && (
                                                    <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-wider">
                                                        Aquí te quedaste
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`transition-colors flex-shrink-0 ${isUltimo ? 'text-[#d4af37]' : 'text-[#e3dac9] group-hover:text-[#d4af37]'}`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    <button
                        onClick={() => onLeer(libro)}
                        className="w-full bg-[#2b1b17] text-white py-5 rounded-2xl font-playfair font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-[#2b1b17]/20 hover:-translate-y-1 active:translate-y-0 transition-all"
                    >
                        {isCompleted ? 'Releer libro' : hasStarted ? 'Continuar lectura' : 'Empezar a leer'}
                    </button>
                </div>
            </div>
        </div>
    );
};