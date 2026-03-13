'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { AlumnoForm } from './AlumnoForm';
import { alumnoService } from '../../../service/escuela/alumnos/alumno.service';
import { GrupoService } from '../../../service/escuela/grupos/grupo.service';
import { toast } from '../../../utils/toast';
import { AlumnoFormData } from '../../../types/escuela/alumnos/alumno.types';
import type { GrupoListItem } from '../../../types/escuela/grupos/grupo';

interface AddAlumnoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// Colores por grado
const gradoColors: Record<number, { bg: string; text: string; border: string; dot: string }> = {
    1: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300',   dot: 'bg-blue-500' },
    2: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' },
    3: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-300', dot: 'bg-violet-500' },
    4: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-500' },
    5: { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-300',   dot: 'bg-rose-500' },
    6: { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-300',   dot: 'bg-cyan-500' },
};
const defaultColor = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-400' };

export const AddAlumnoModal: React.FC<AddAlumnoModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    // ── Grupos ─────────────────────────────────────────────────────────────
    const [grupos, setGrupos] = useState<GrupoListItem[]>([]);
    const [loadingGrupos, setLoadingGrupos] = useState(false);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState<GrupoListItem | null>(null);
    const [filtroGrado, setFiltroGrado] = useState<number | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setGrupoSeleccionado(null);
        setFiltroGrado(null);

        const fetchGrupos = async () => {
            setLoadingGrupos(true);
            try {
                const data = await GrupoService.getAll();
                setGrupos(data.filter(g => g.activo));
            } catch {
                toast.error('No se pudieron cargar los grupos');
            } finally {
                setLoadingGrupos(false);
            }
        };
        fetchGrupos();
    }, [isOpen]);

    const grados = Array.from(new Set(grupos.map(g => g.grado))).sort((a, b) => a - b);
    const gruposFiltrados = filtroGrado ? grupos.filter(g => g.grado === filtroGrado) : grupos;

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (data: AlumnoFormData) => {
        setIsLoading(true);
        try {
            const payload: any = {
                nombre:          data.nombre.trim(),
                apellidoPaterno: data.apellidoPaterno.trim(),
                apellidoMaterno: data.apellidoMaterno.trim(),
                email:           data.email.trim().toLowerCase(),
                password:        data.password,
            };

            if (data.telefono?.trim())        payload.telefono        = data.telefono.trim();
            if (data.fechaNacimiento)         payload.fechaNacimiento = data.fechaNacimiento;
            if (data.cicloEscolar?.trim())    payload.cicloEscolar    = data.cicloEscolar.trim();

            // Asignar grupo por grupoId (opción B del README) — forzar entero
            if (grupoSeleccionado) {
                payload.grupoId = parseInt(String(grupoSeleccionado.id), 10);
            }

            console.log('📤 Enviando datos al backend:', payload);
            const response = await alumnoService.registrarAlumno(payload);
            console.log('✅ Respuesta del backend:', response);

            const nombre = `${response.data.nombre} ${response.data.apellidoPaterno}`;
            const grupoInfo = grupoSeleccionado ? ` al grupo ${grupoSeleccionado.grado}°${grupoSeleccionado.nombre}` : '';
            toast.success(`¡${nombre} registrado${grupoInfo} exitosamente!`, 5000);

            onClose();
            onSuccess();
        } catch (error: any) {
            console.error('❌ Error al crear alumno:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.description;
            let displayMessage = error.message || 'Error al registrar el alumno.';
            if (Array.isArray(errorMsg)) displayMessage = errorMsg.join(' | ');
            else if (typeof errorMsg === 'string') displayMessage = errorMsg;
            toast.error(displayMessage, 6000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => { if (!isLoading) onClose(); };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Nuevo Alumno" size="lg">
            <div className="space-y-6">

                {/* ── Selector de Grupo ───────────────────────────────────── */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-[#2b1b17] flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Asignar a un grupo
                            <span className="font-normal text-[#a1887f] text-xs">(opcional)</span>
                        </label>
                        {grupoSeleccionado && (
                            <button
                                type="button"
                                onClick={() => setGrupoSeleccionado(null)}
                                className="text-xs text-[#a1887f] hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Quitar grupo
                            </button>
                        )}
                    </div>

                    {loadingGrupos ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-[#fbf8f1]">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#d4af37]" />
                            <span className="text-sm text-[#8d6e3f]">Cargando grupos...</span>
                        </div>
                    ) : grupos.length === 0 ? (
                        <div className="px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-[#fbf8f1] text-sm text-[#a1887f] italic">
                            No hay grupos activos. Crea grupos primero desde la sección de Grupos.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Filtro por grado */}
                            {grados.length > 1 && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFiltroGrado(null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            filtroGrado === null
                                                ? 'bg-[#2b1b17] text-[#f0e6d2]'
                                                : 'bg-[#fbf8f1] text-[#5d4037] hover:bg-[#e3dac9]'
                                        }`}
                                    >
                                        Todos
                                    </button>
                                    {grados.map(g => {
                                        const c = gradoColors[g] ?? defaultColor;
                                        return (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setFiltroGrado(g)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                    filtroGrado === g
                                                        ? `${c.bg} ${c.text} ${c.border}`
                                                        : 'bg-[#fbf8f1] text-[#5d4037] border-transparent hover:bg-[#e3dac9]'
                                                }`}
                                            >
                                                {g}° Grado
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Grid de grupos */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                                {gruposFiltrados.map(grupo => {
                                    const c = gradoColors[grupo.grado] ?? defaultColor;
                                    const isSelected = grupoSeleccionado?.id === grupo.id;
                                    const maestro = grupo.maestros?.[0];

                                    return (
                                        <button
                                            key={grupo.id}
                                            type="button"
                                            onClick={() => setGrupoSeleccionado(isSelected ? null : grupo)}
                                            className={`relative flex flex-col items-start gap-1 px-3 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                                                isSelected
                                                    ? `${c.bg} ${c.border} shadow-md`
                                                    : 'border-[#e3dac9] bg-white hover:bg-[#fbf8f1] hover:border-[#d4af37]/40'
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${c.dot} flex items-center justify-center`}>
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${c.bg} ${c.text}`}>
                                                    {grupo.grado}
                                                </span>
                                                <span className={`font-black text-base ${isSelected ? c.text : 'text-[#2b1b17]'}`}>
                                                    {grupo.nombre}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-[#a1887f] truncate w-full">
                                                {maestro
                                                    ? `👤 ${maestro.nombre?.split(' ')[0] ?? maestro.correo}`
                                                    : 'Sin maestro'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Grupo seleccionado — resumen */}
                            {grupoSeleccionado && (
                                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 ${(gradoColors[grupoSeleccionado.grado] ?? defaultColor).bg} ${(gradoColors[grupoSeleccionado.grado] ?? defaultColor).border}`}>
                                    <svg className={`w-4 h-4 shrink-0 ${(gradoColors[grupoSeleccionado.grado] ?? defaultColor).text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className={`text-sm font-bold ${(gradoColors[grupoSeleccionado.grado] ?? defaultColor).text}`}>
                                        Se asignará al grupo {grupoSeleccionado.grado}°{grupoSeleccionado.nombre}
                                        {grupoSeleccionado.maestros?.[0] && (
                                            <span className="font-normal"> · Maestro: {grupoSeleccionado.maestros[0].nombre?.split(' ')[0]}</span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Divisor */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e3dac9]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-[#a1887f] font-bold uppercase tracking-wider">
                            Datos del Alumno
                        </span>
                    </div>
                </div>

                {/* ── Formulario de datos ─────────────────────────────────── */}
                <AlumnoForm
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isLoading={isLoading}
                    hideGrupoFields  // oculta los selects de grado/grupo del form
                />
            </div>
        </Modal>
    );
};