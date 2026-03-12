'use client';

// ============================================================
// COMPONENT — GrupoCard
// src/components/director/grupos/GrupoCard.tsx
// ============================================================

import React from 'react';
import type { GrupoListItem } from '../../../types/escuela/grupos/grupo';

interface GrupoCardProps {
    grupo: GrupoListItem;
    onEdit: (grupo: GrupoListItem) => void;
    onDelete: (grupo: GrupoListItem) => void;
}

const gradoColors: Record<number, { gradient: string; text: string; bg: string }> = {
    1: { gradient: 'from-blue-500 to-blue-600', text: 'text-blue-700', bg: 'bg-blue-50' },
    2: { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-700', bg: 'bg-purple-50' },
    3: { gradient: 'from-emerald-500 to-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    4: { gradient: 'from-orange-500 to-orange-600', text: 'text-orange-700', bg: 'bg-orange-50' },
    5: { gradient: 'from-rose-500 to-rose-600', text: 'text-rose-700', bg: 'bg-rose-50' },
    6: { gradient: 'from-teal-500 to-teal-600', text: 'text-teal-700', bg: 'bg-teal-50' },
};

const getGradoColor = (grado: number) =>
    gradoColors[grado] ?? { gradient: 'from-[#d4af37] to-[#c19a2e]', text: 'text-[#8d6e3f]', bg: 'bg-[#fbf8f1]' };

const getGradoLabel = (grado: number) => {
    const suffixes: Record<number, string> = { 1: '1er', 2: '2do', 3: '3er' };
    return `${suffixes[grado] ?? `${grado}°`} Grado`;
};

export const GrupoCard: React.FC<GrupoCardProps> = ({ grupo, onEdit, onDelete }) => {
    const color = getGradoColor(grupo.grado);

    return (
        <div className={`group bg-gradient-to-br from-white to-[#faf8f5] rounded-xl shadow-md hover:shadow-2xl border border-[#e3dac9]/50 hover:border-[#d4af37]/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${!grupo.activo ? 'opacity-70' : ''}`}>
            {/* Línea acento superior */}
            <div className="h-1 bg-gradient-to-r from-[#d4af37] to-[#c19a2e]" />

            {/* Glow en hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 via-transparent to-[#d4af37]/0 group-hover:from-[#d4af37]/5 group-hover:to-[#d4af37]/5 transition-all duration-500 rounded-xl pointer-events-none" />

            <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white font-playfair font-bold text-xl shadow-lg`}>
                            {grupo.nombre}
                        </div>
                        <div>
                            <h4 className="font-playfair font-bold text-lg text-[#2b1b17] group-hover:text-[#d4af37] transition-colors duration-300">
                                Grupo {grupo.nombre}
                            </h4>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${color.text}`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                </svg>
                                {getGradoLabel(grupo.grado)}
                            </span>
                        </div>
                    </div>

                    {/* Badge activo/inactivo */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        grupo.activo
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                        {grupo.activo ? '● Activo' : '○ Inactivo'}
                    </span>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-[#e3dac9]">
                    <div className={`flex items-center gap-2 ${color.bg} rounded-lg px-3 py-2`}>
                        <svg className={`w-4 h-4 ${color.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <div>
                            <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Grado</p>
                            <p className={`text-sm font-bold ${color.text}`}>{grupo.grado}° Grado</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#fbf8f1] rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <div>
                            <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Identificador</p>
                            <p className="text-sm font-bold text-[#2b1b17]">#{grupo.id} · {grupo.grado}°{grupo.nombre}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(grupo)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-lg font-bold text-sm hover:from-[#3e2723] hover:to-[#4e342e] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(grupo)}
                        className="p-2 hover:bg-red-50 rounded-lg text-[#8d6e3f] hover:text-red-600 transition-colors border-2 border-[#e3dac9] hover:border-red-200"
                        title="Eliminar grupo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};