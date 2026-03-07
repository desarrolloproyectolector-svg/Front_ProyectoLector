'use client';

import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { AlumnoFormData, AlumnoFormErrors } from '../../../types/escuela/alumnos/alumno.types';
import { sanitizeText, sanitizeEmail, isValidEmail, focusFirstError, hasUppercase } from '../../../utils/formValidation';
interface AlumnoFormProps {
    initialData?: AlumnoFormData;
    onSubmit: (data: AlumnoFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AlumnoForm: React.FC<AlumnoFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<AlumnoFormData>(
        initialData || {
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            email: '',
            password: '',
            telefono: '',
            fechaNacimiento: '',
            grado: undefined,
            grupo: '',
            cicloEscolar: ''
        }
    );

    const [errors, setErrors] = useState<AlumnoFormErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Si es grado, convertir a número
        const finalValue = name === 'grado' ? (value ? parseInt(value) : undefined) : value;

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name as keyof AlumnoFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validate = (): boolean => {
        const newErrors: AlumnoFormErrors = {};

        const sNombre = sanitizeText(formData.nombre);
        const sPaterno = sanitizeText(formData.apellidoPaterno);
        const sMaterno = sanitizeText(formData.apellidoMaterno);
        const sEmail = sanitizeEmail(formData.email);

        // Validaciones obligatorias
        if (!sNombre) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!sPaterno) {
            newErrors.apellidoPaterno = 'El apellido paterno es requerido';
        }

        if (!sMaterno) {
            newErrors.apellidoMaterno = 'El apellido materno es requerido';
        }

        if (!sEmail) {
            newErrors.email = 'El email es requerido';
        } else if (hasUppercase(formData.email)) {
            newErrors.email = 'El correo electrónico debe estar en minúsculas';
        } else if (!isValidEmail(sEmail)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validación de teléfono (opcional pero si se ingresa debe ser válido)
        if (formData.telefono && formData.telefono.trim()) {
            const phoneRegex = /^[0-9+\s()-]{10,}$/;
            if (!phoneRegex.test(formData.telefono)) {
                newErrors.telefono = 'Formato de teléfono inválido';
            }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            focusFirstError(newErrors as Record<string, string | undefined>);
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            onSubmit({
                ...formData,
                nombre: sanitizeText(formData.nombre),
                apellidoPaterno: sanitizeText(formData.apellidoPaterno),
                apellidoMaterno: sanitizeText(formData.apellidoMaterno),
                email: sanitizeEmail(formData.email),
                telefono: formData.telefono ? sanitizeText(formData.telefono) : '',
            });
        }
    };

    // Generar ciclo escolar actual automáticamente
    const getCurrentCicloEscolar = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Si estamos entre agosto y diciembre, el ciclo es año-actual/año-siguiente
        // Si estamos entre enero y julio, el ciclo es año-anterior/año-actual
        const startYear = month >= 7 ? year : year - 1;
        const endYear = startYear + 1;

        return `${startYear}-${endYear}`;
    };

    // Auto-completar ciclo escolar si está vacío
    React.useEffect(() => {
        if (!formData.cicloEscolar) {
            setFormData(prev => ({
                ...prev,
                cicloEscolar: getCurrentCicloEscolar()
            }));
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full"></div>
                    Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre(s)"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Carlos"
                        error={errors.nombre}
                        required
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Apellido Paterno"
                        name="apellidoPaterno"
                        value={formData.apellidoPaterno}
                        onChange={handleChange}
                        placeholder="Ej: González"
                        error={errors.apellidoPaterno}
                        required
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Apellido Materno"
                        name="apellidoMaterno"
                        value={formData.apellidoMaterno}
                        onChange={handleChange}
                        placeholder="Ej: Sánchez"
                        error={errors.apellidoMaterno}
                        required
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ej: carlos@escuela.edu"
                        error={errors.email}
                        required
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        }
                    />

                    <div className="w-full">
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                            Contraseña
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1887f]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                                disabled={isLoading}
                                className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 bg-white font-lora text-sm transition-all duration-300 focus:outline-none ${errors.password
                                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : 'border-[#e3dac9] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1887f] hover:text-[#2b1b17] transition-colors"
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
                        </div>
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <Input
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono || ''}
                        onChange={handleChange}
                        placeholder="Ej: +52 55 1234 5678 (opcional)"
                        error={errors.telefono}
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Fecha de Nacimiento"
                        name="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento || ''}
                        onChange={handleChange}
                        error={errors.fechaNacimiento}
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Información Académica */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full"></div>
                    Información Académica
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                            Grado
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1887f]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <select
                                name="grado"
                                value={formData.grado || ''}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm transition-all duration-300 focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10"
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
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                            Grupo
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1887f]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <select
                                name="grupo"
                                value={formData.grupo || ''}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm transition-all duration-300 focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10"
                            >
                                <option value="">Selecciona un grupo</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Ciclo Escolar"
                        name="cicloEscolar"
                        value={formData.cicloEscolar || ''}
                        onChange={handleChange}
                        placeholder="Ej: 2024-2025"
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#e3dac9]">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    icon={
                        isLoading ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        )
                    }
                >
                    {isLoading ? 'Guardando...' : initialData ? 'Actualizar Alumno' : 'Crear Alumno'}
                </Button>
            </div>
        </form>
    );
};