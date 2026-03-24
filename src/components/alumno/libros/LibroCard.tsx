'use client';

import React from 'react';
import { LibroAlumno } from '../../../types/alumno/libros';

interface LibroCardProps {
    libro: LibroAlumno;
    onClick: (id: number) => void;
}

export const LibroCard: React.FC<LibroCardProps> = ({ libro, onClick }) => {
    const isCompleted = libro.progresoPorcentaje === 100;
    const hasStarted = libro.progresoPorcentaje > 0;

    return (
        <div
            onClick={() => onClick(libro.libroId)}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#e3dac9]/30 hover:-translate-y-1"
        >
            {/* Portada */}
            <div className="aspect-[3/4] bg-gradient-to-br from-[#fbf8f1] to-[#f0e6d2] relative flex items-center justify-center p-6 overflow-hidden">
                {libro.portadaUrl ? (
                    <img
                        src={libro.portadaUrl}
                        alt={libro.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    /* Portada sintética estilo editorial */
                    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#3e2723] via-[#2b1b17] to-[#1a0e0a]">
                        {/* Lomo izquierdo */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-[#d4af37] via-[#c19a2e] to-[#a07820]" />
                        {/* Ornamento superior */}
                        <div className="absolute top-4 left-6 right-4 h-px bg-gradient-to-r from-[#d4af37]/80 to-transparent" />
                        <div className="absolute top-6 left-6 right-4 h-px bg-[#d4af37]/20" />
                        {/* Título centrado */}
                        <div className="px-6 py-4 text-center z-10">
                            <span className="font-playfair font-black text-white text-sm leading-snug block drop-shadow-md">
                                {libro.titulo}
                            </span>
                            {libro.materia && (
                                <span className="mt-2 inline-block text-[#d4af37]/70 text-[9px] uppercase tracking-[0.2em] font-bold">
                                    {libro.materia}
                                </span>
                            )}
                        </div>
                        {/* Ornamento inferior */}
                        <div className="absolute bottom-6 left-6 right-4 h-px bg-gradient-to-r from-[#d4af37]/80 to-transparent" />
                        <div className="absolute bottom-4 left-6 right-4 h-px bg-[#d4af37]/20" />
                    </div>
                )}

                {/* Badge completado */}
                {isCompleted && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-2 rounded-full shadow-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                {/* Overlay hover — franja inferior */}
                <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#2b1b17]/90 via-[#2b1b17]/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 translate-y-2 group-hover:translate-y-0">
                    <span className="flex items-center gap-1.5 bg-white/95 text-[#2b1b17] px-5 py-2 rounded-full font-bold shadow-lg text-xs backdrop-blur-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {hasStarted ? 'Continuar' : 'Abrir libro'}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-playfair font-bold text-[#2b1b17] text-base leading-tight line-clamp-2 mb-2">
                    {libro.titulo}
                </h3>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#fbf8f1] text-[#8d6e3f] rounded border border-[#e3dac9]">
                        {libro.materia}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">
                        {libro.grado}° Grado
                    </span>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                        <span className={isCompleted ? 'text-emerald-600' : 'text-[#a1887f]'}>
                            {isCompleted ? '¡Completado!' : hasStarted ? 'En curso' : 'Sin iniciar'}
                        </span>
                        <span className="text-[#2b1b17]">{libro.progresoPorcentaje}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#f0e6d2] rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ease-out rounded-full relative overflow-hidden ${
                                isCompleted
                                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                    : 'bg-gradient-to-r from-[#d4af37] to-[#c19a2e]'
                            }`}
                            style={{ width: `${libro.progresoPorcentaje}%` }}
                        >
                            {/* Shimmer en barras activas */}
                            {!isCompleted && hasStarted && (
                                <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};