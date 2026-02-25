'use client';

import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import type { CreateEscuelaDTO } from '../../../types/admin/escuelas/escuela';

interface EscuelaFormData {
    nombre: string;
    nivel: string;
    clave: string;
    direccion: string;
    telefono: string;
    ciudad: string;
    estadoRegion: string;
    estado: 'activa' | 'suspendida' | 'inactiva';
}

interface EscuelaFormProps {
    initialData?: Partial<EscuelaFormData>;
    onSubmit: (data: CreateEscuelaDTO) => void;
    onCancel: () => void;
    isLoading?: boolean;
    isEdit?: boolean;
}

const EMPTY_FORM: EscuelaFormData = {
    nombre: '',
    nivel: '',
    clave: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    estadoRegion: '',
    estado: 'activa',
};

export const EscuelaForm: React.FC<EscuelaFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    isEdit = false,
}) => {
    const [formData, setFormData] = useState<EscuelaFormData>({
        ...EMPTY_FORM,
        ...initialData,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof EscuelaFormData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof EscuelaFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof EscuelaFormData, string>> = {};

        if (!formData.nombre.trim())
            newErrors.nombre = 'El nombre es requerido';
        else if (formData.nombre.length > 150)
            newErrors.nombre = 'Máximo 150 caracteres';

        if (!formData.nivel.trim())
            newErrors.nivel = 'El nivel es requerido';
        else if (formData.nivel.length > 50)
            newErrors.nivel = 'Máximo 50 caracteres';

        if (formData.clave && formData.clave.length > 50)
            newErrors.clave = 'Máximo 50 caracteres';

        if (formData.direccion && formData.direccion.length > 200)
            newErrors.direccion = 'Máximo 200 caracteres';

        if (formData.telefono && formData.telefono.length > 20)
            newErrors.telefono = 'Máximo 20 caracteres';

        if (formData.ciudad && formData.ciudad.length > 100)
            newErrors.ciudad = 'Máximo 100 caracteres';

        if (formData.estadoRegion && formData.estadoRegion.length > 100)
            newErrors.estadoRegion = 'Máximo 100 caracteres';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: CreateEscuelaDTO = {
            nombre: formData.nombre.trim(),
            nivel: formData.nivel.trim(),
        };

        if (formData.clave?.trim())        payload.clave        = formData.clave.trim();
        if (formData.direccion?.trim())    payload.direccion    = formData.direccion.trim();
        if (formData.telefono?.trim())     payload.telefono     = formData.telefono.trim();
        if (formData.ciudad?.trim())       payload.ciudad       = formData.ciudad.trim();
        if (formData.estadoRegion?.trim()) payload.estadoRegion = formData.estadoRegion.trim();
        if (isEdit)                        payload.estado       = formData.estado;

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Sección 1 — Datos principales */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full" />
                    Información de la Institución
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Nombre */}
                    <div className="md:col-span-2">
                        <Input
                            label="Nombre de la Escuela"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Preparatoria Central"
                            error={errors.nombre}
                            required
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            }
                        />
                        <p className="mt-1 text-xs text-[#8d6e3f]">Máximo 150 caracteres</p>
                    </div>

                    {/* Nivel */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                            Nivel Educativo <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1887f]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <select
                                name="nivel"
                                value={formData.nivel}
                                onChange={handleChange}
                                required
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white font-lora text-sm transition-all duration-300 focus:outline-none ${
                                    errors.nivel
                                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                        : 'border-[#e3dac9] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10'
                                }`}
                            >
                                <option value="">Selecciona un nivel</option>
                                <option value="Preescolar">Preescolar</option>
                                <option value="Primaria">Primaria</option>
                                <option value="Secundaria">Secundaria</option>
                                <option value="Preparatoria">Preparatoria</option>
                                <option value="Universidad">Universidad</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        {errors.nivel && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.nivel}
                            </p>
                        )}
                    </div>

                    {/* Clave */}
                    <Input
                        label="Clave de la Escuela (opcional)"
                        name="clave"
                        value={formData.clave}
                        onChange={handleChange}
                        placeholder="Ej: 29DPR0123X"
                        error={errors.clave}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        }
                    />

                    {/* Teléfono */}
                    <Input
                        label="Teléfono (opcional)"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="Ej: 5551234567"
                        error={errors.telefono}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                    />

                    {/* Dirección */}
                    <div className="md:col-span-2">
                        <Input
                            label="Dirección (opcional)"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Ej: Calle Principal #123, Colonia Centro"
                            error={errors.direccion}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        />
                        <p className="mt-1 text-xs text-[#8d6e3f]">Máximo 200 caracteres</p>
                    </div>
                </div>
            </div>

            {/* Sección 2 — Ubicación */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full" />
                    Ubicación
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ciudad */}
                    <Input
                        label="Ciudad (opcional)"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        placeholder="Ej: Ciudad de México"
                        error={errors.ciudad}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        }
                    />

                    {/* Estado/Región */}
                    <Input
                        label="Estado o Región (opcional)"
                        name="estadoRegion"
                        value={formData.estadoRegion}
                        onChange={handleChange}
                        placeholder="Ej: CDMX, Nuevo León, Jalisco"
                        error={errors.estadoRegion}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Sección 3 — Estado (solo en edición) */}
            {isEdit && (
                <div>
                    <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full" />
                        Estado de la Institución
                    </h3>
                    <div className="flex gap-3">
                        {(['activa', 'suspendida', 'inactiva'] as const).map((est) => {
                            const config = {
                                activa:     { color: 'border-emerald-500 bg-emerald-50 text-emerald-700',  dot: 'bg-emerald-500',  label: 'Activa' },
                                suspendida: { color: 'border-red-500 bg-red-50 text-red-700',              dot: 'bg-red-500',      label: 'Suspendida' },
                                inactiva:   { color: 'border-gray-400 bg-gray-50 text-gray-600',           dot: 'bg-gray-400',     label: 'Inactiva' },
                            };
                            const c = config[est];
                            const isSelected = formData.estado === est;
                            return (
                                <button
                                    key={est}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, estado: est }))}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                                        isSelected ? c.color : 'border-[#e3dac9] bg-white text-[#8d6e3f] hover:bg-[#fbf8f1]'
                                    }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? c.dot : 'bg-[#a1887f]'}`} />
                                    {c.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Nota informativa (solo en creación) */}
            {!isEdit && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">Información importante</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Solo el <strong>nombre</strong> y el <strong>nivel educativo</strong> son obligatorios</li>
                                <li>• Puedes agregar el resto de información más tarde desde editar</li>
                                <li>• El director se asigna desde el módulo de usuarios</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#e3dac9]">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    icon={
                        isLoading ? (
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        )
                    }
                >
                    {isLoading ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Escuela'}
                </Button>
            </div>
        </form>
    );
};