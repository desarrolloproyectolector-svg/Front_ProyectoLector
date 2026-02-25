'use client';

import React, { useState, useEffect } from 'react';
import { AlumnoEditFormData, AlumnoEditFormErrors } from '../../../types/escuela/alumnos/alumno.types';

interface AlumnoFormEditProps {
    initialData?: AlumnoEditFormData;
    onSubmit: (data: AlumnoEditFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AlumnoFormEdit: React.FC<AlumnoFormEditProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<AlumnoEditFormData>(
        initialData || {
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            fechaNacimiento: '',
            genero: '',
            password: '',
            grado: undefined,
            grupo: '',
            cicloEscolar: ''
        }
    );

    const [errors, setErrors] = useState<AlumnoEditFormErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Si es grado, convertir a número
        const finalValue = name === 'grado' ? (value ? parseInt(value) : undefined) : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
        
        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name as keyof AlumnoEditFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validate = (): boolean => {
        const newErrors: AlumnoEditFormErrors = {};

        // Validaciones obligatorias
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es requerido';
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Correo inválido';
        }

        // Validación de contraseña (opcional, pero si se ingresa debe ser válida)
        if (formData.password && formData.password.length > 0) {
            if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
        }

        // Validación de teléfono (opcional pero si se ingresa debe ser válido)
        if (formData.telefono && formData.telefono.trim()) {
            const phoneRegex = /^[0-9+\s()-]{10,}$/;
            if (!phoneRegex.test(formData.telefono)) {
                newErrors.telefono = 'Formato de teléfono inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validate()) {
            onSubmit(formData);
        }
    };

    const inputClass = (field: keyof AlumnoEditFormErrors) =>
        `w-full px-4 py-3 rounded-xl border-2 bg-white font-lora text-sm transition-all duration-300 focus:outline-none ${
            errors[field]
                ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                : 'border-[#e3dac9] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10'
        }`;

    const labelClass = 'block text-sm font-bold text-[#2b1b17] mb-2';

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Información Personal */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full"></div>
                    Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div>
                        <label className={labelClass}>
                            Nombre(s)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Carlos"
                            disabled={isLoading}
                            className={inputClass('nombre')}
                        />
                        {errors.nombre && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    {/* Apellido completo */}
                    <div>
                        <label className={labelClass}>
                            Apellido(s)
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            placeholder="Ej: González López"
                            disabled={isLoading}
                            className={inputClass('apellido')}
                        />
                        {errors.apellido && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {errors.apellido}
                            </p>
                        )}
                    </div>

                    {/* Correo */}
                    <div>
                        <label className={labelClass}>
                            Correo Electrónico
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="Ej: carlos@escuela.edu"
                            disabled={isLoading}
                            className={inputClass('correo')}
                        />
                        {errors.correo && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {errors.correo}
                            </p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className={labelClass}>
                            Teléfono
                            <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono || ''}
                            onChange={handleChange}
                            placeholder="Ej: +52 55 1234 5678"
                            disabled={isLoading}
                            className={inputClass('telefono')}
                        />
                        {errors.telefono && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {errors.telefono}
                            </p>
                        )}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                        <label className={labelClass}>
                            Fecha de Nacimiento
                            <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                        </label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={inputClass('fechaNacimiento')}
                        />
                    </div>

                    {/* Género */}
                    <div>
                        <label className={labelClass}>
                            Género
                            <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                        </label>
                        <select
                            name="genero"
                            value={formData.genero || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={inputClass('genero')}
                        >
                            <option value="">Sin especificar</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Información Académica */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full"></div>
                    Información Académica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Grado */}
                    <div>
                        <label className={labelClass}>Grado</label>
                        <select
                            name="grado"
                            value={formData.grado || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm transition-all duration-300 focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10"
                        >
                            <option value="">Selecciona un grado</option>
                            <option value="1">1° (Primero)</option>
                            <option value="2">2° (Segundo)</option>
                            <option value="3">3° (Tercero)</option>
                            <option value="4">4° (Cuarto)</option>
                            <option value="5">5° (Quinto)</option>
                            <option value="6">6° (Sexto)</option>
                        </select>
                    </div>

                    {/* Grupo */}
                    <div>
                        <label className={labelClass}>Grupo</label>
                        <select
                            name="grupo"
                            value={formData.grupo || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm transition-all duration-300 focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10"
                        >
                            <option value="">Selecciona un grupo</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>

                    {/* Ciclo Escolar */}
                    <div>
                        <label className={labelClass}>Ciclo Escolar</label>
                        <input
                            type="text"
                            name="cicloEscolar"
                            value={formData.cicloEscolar || ''}
                            onChange={handleChange}
                            placeholder="Ej: 2024-2025"
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm transition-all duration-300 focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10"
                        />
                    </div>
                </div>
            </div>

            {/* Contraseña (opcional) */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full"></div>
                    Seguridad
                </h3>
                
                <div className="bg-[#fbf8f1] rounded-xl p-4 mb-4">
                    <p className="text-sm text-[#8d6e3f] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Deja este campo en blanco si no deseas cambiar la contraseña
                    </p>
                </div>

                <div className="relative">
                    <label className={labelClass}>
                        Nueva Contraseña
                        <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        disabled={isLoading}
                        className={inputClass('password')}
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[42px] text-[#a1887f] hover:text-[#2b1b17] transition-colors"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        )}
                    </button>
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {errors.password}
                        </p>
                    )}
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#e3dac9]">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl border-2 border-[#e3dac9] text-[#5d4037] font-bold hover:bg-[#fbf8f1] transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};