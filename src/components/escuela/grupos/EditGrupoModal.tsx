'use client';

// ============================================================
// COMPONENT — EditGrupoModal
// src/components/director/grupos/EditGrupoModal.tsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { GrupoService } from '../../../service/escuela/grupos/grupo.service';
import type { GrupoListItem, UpdateGrupoDTO } from '../../../types/escuela/grupos/grupo';

interface EditGrupoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    grupo: GrupoListItem;
}

export const EditGrupoModal: React.FC<EditGrupoModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    grupo,
}) => {
    const [formData, setFormData] = useState<UpdateGrupoDTO>({
        grado: grupo.grado,
        nombre: grupo.nombre,
        activo: grupo.activo,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof UpdateGrupoDTO, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Sincronizar al cambiar grupo
    useEffect(() => {
        if (isOpen) {
            setFormData({ grado: grupo.grado, nombre: grupo.nombre, activo: grupo.activo });
            setErrors({});
            setApiError('');
        }
    }, [isOpen, grupo]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'grado' ? parseInt(value, 10) : value,
        }));
        if (errors[name as keyof UpdateGrupoDTO]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof UpdateGrupoDTO, string>> = {};

        if (formData.grado !== undefined && formData.grado < 1)
            newErrors.grado = 'El grado debe ser un número entero ≥ 1';

        if (formData.nombre !== undefined) {
            if (!formData.nombre.trim())
                newErrors.nombre = 'El nombre no puede estar vacío';
            else if (formData.nombre.length > 20)
                newErrors.nombre = 'Máximo 20 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setIsLoading(true);
            setApiError('');
            await GrupoService.update(grupo.id, {
                grado: parseInt(String(formData.grado), 10),
                nombre: formData.nombre?.trim().toUpperCase(),
                activo: formData.activo,
            });
            console.log('✅ Grupo actualizado:', grupo.id);
            onSuccess();
            onClose();
        } catch (err: any) {
            const status = err.response?.status;
            const raw = err.response?.data?.message;
            const msg = Array.isArray(raw) ? raw[0] : raw;

            if (status === 409) {
                setApiError('Ya existe un grupo con ese grado y nombre.');
            } else if (status === 404) {
                setApiError('El grupo no fue encontrado.');
            } else if (status === 400) {
                setApiError(msg || 'Datos inválidos. Revisa los campos.');
            } else {
                setApiError(msg || 'Error al actualizar el grupo. Intenta de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#e3dac9]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-playfair text-xl font-bold text-[#2b1b17]">Editar Grupo</h2>
                            <p className="text-xs text-[#8d6e3f]">
                                {grupo.grado}° {grupo.nombre}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#fbf8f1] rounded-lg text-[#a1887f] hover:text-[#2b1b17] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* API Error */}
                    {apiError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-800">{apiError}</p>
                        </div>
                    )}

                    {/* Grado */}
                    <div>
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">Grado</label>
                        <input
                            type="number"
                            name="grado"
                            min={1}
                            value={formData.grado}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border-2 bg-white font-lora text-sm transition-all duration-300 focus:outline-none ${
                                errors.grado
                                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : 'border-[#e3dac9] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10'
                            }`}
                        />
                        {errors.grado && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.grado}</p>
                        )}
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">Nombre del Grupo</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            maxLength={20}
                            className={`w-full px-4 py-3 rounded-xl border-2 bg-white font-lora text-sm transition-all duration-300 focus:outline-none ${
                                errors.nombre
                                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : 'border-[#e3dac9] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10'
                            }`}
                        />
                        {errors.nombre && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.nombre}</p>
                        )}
                        <p className="mt-1 text-xs text-[#8d6e3f]">Máximo 20 caracteres</p>
                    </div>

                    {/* Activo */}
                    <div>
                        <label className="block text-sm font-bold text-[#2b1b17] mb-3">Estado del Grupo</label>
                        <div className="flex gap-3">
                            {[
                                { value: true, label: 'Activo', color: 'border-emerald-500 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
                                { value: false, label: 'Inactivo', color: 'border-gray-400 bg-gray-50 text-gray-600', dot: 'bg-gray-400' },
                            ].map(({ value, label, color, dot }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, activo: value }))}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                                        formData.activo === value
                                            ? color
                                            : 'border-[#e3dac9] bg-white text-[#8d6e3f] hover:bg-[#fbf8f1]'
                                    }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${formData.activo === value ? dot : 'bg-[#a1887f]'}`} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#e3dac9] text-[#5d4037] font-bold hover:bg-[#fbf8f1] transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f0e6d2]" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};