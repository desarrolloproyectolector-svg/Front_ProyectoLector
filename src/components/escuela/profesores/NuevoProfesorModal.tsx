'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { profesorService } from '../../../service/escuela/profesor/profesor.service';
import { ProfesorFormData, ProfesorFormErrors, RegistroProfesorPayload } from '../../../types/escuela/profesor/profesor.types';
import { toast } from '@/utils/toast';
import { sanitizeText, sanitizeEmail, isValidEmail, focusFirstError, hasUppercase } from '../../../utils/formValidation';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ESPECIALIDADES = [
    'Matemáticas',
    'Literatura',
    'Español',
    'Ciencias Naturales',
    'Historia',
    'Geografía',
    'Inglés',
    'Educación Física',
    'Artes',
    'Música',
    'Tecnología',
    'Otra',
];

export default function NuevoProfesorModal({ open, onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState<ProfesorFormData>({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        password: '',
        telefono: '',
        fechaNacimiento: '',
        especialidad: '',
        fechaIngreso: '',
    });

    const [errors, setErrors] = useState<ProfesorFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field: keyof ProfesorFormData) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
        };

    const validate = (): boolean => {
        const newErrors: ProfesorFormErrors = {};

        const sNombre = sanitizeText(formData.nombre);
        const sPaterno = sanitizeText(formData.apellidoPaterno);
        const sMaterno = sanitizeText(formData.apellidoMaterno);
        const sEmail = sanitizeEmail(formData.email);

        if (!sNombre) newErrors.nombre = 'El nombre es requerido';
        if (!sPaterno) newErrors.apellidoPaterno = 'El apellido paterno es requerido';
        if (!sMaterno) newErrors.apellidoMaterno = 'El apellido materno es requerido';

        if (!sEmail) {
            newErrors.email = 'El correo es requerido';
        } else if (hasUppercase(formData.email)) {
            newErrors.email = 'Escribe tu correo electrónico solo con minúsculas';
        } else if (!isValidEmail(sEmail)) {
            newErrors.email = 'Correo inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
        }

        if (formData.telefono && formData.telefono.trim()) {
            if (!/^[0-9+\s()-]{10,}$/.test(formData.telefono)) {
                newErrors.telefono = 'Formato de teléfono inválido';
            }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            focusFirstError(newErrors as Record<string, string | undefined>);
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setIsLoading(true);

            // Construir payload — solo campos con valor
            const payload: RegistroProfesorPayload = {
                nombre: sanitizeText(formData.nombre),
                apellidoPaterno: sanitizeText(formData.apellidoPaterno),
                apellidoMaterno: sanitizeText(formData.apellidoMaterno),
                email: sanitizeEmail(formData.email),
                password: formData.password,
            };

            if (formData.telefono?.trim()) payload.telefono = sanitizeText(formData.telefono);
            if (formData.fechaNacimiento) payload.fechaNacimiento = formData.fechaNacimiento;
            if (formData.especialidad) payload.especialidad = formData.especialidad;
            if (formData.fechaIngreso) payload.fechaIngreso = formData.fechaIngreso;

            const response = await profesorService.registrarProfesor(payload);

            toast.success(
                `¡Profesor ${response.data.nombre} ${response.data.apellidoPaterno} registrado exitosamente!`,
                5000
            );

            handleClose();
            onSuccess?.();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.response?.data?.description;
            let displayMessage = error.message || 'Error al registrar el profesor.';

            if (Array.isArray(errorMsg)) {
                displayMessage = `Faltan datos o son incorrectos: ${errorMsg.join(' | ')}`;
            } else if (typeof errorMsg === 'string') {
                displayMessage = errorMsg;
            }

            toast.error(displayMessage, 6000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isLoading) return;
        setFormData({
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            email: '',
            password: '',
            telefono: '',
            fechaNacimiento: '',
            especialidad: '',
            fechaIngreso: '',
        });
        setErrors({});
        setShowPassword(false);
        onClose();
    };

    const inputClass = (field: keyof ProfesorFormErrors) =>
        `w-full px-4 py-3 rounded-xl border-2 bg-white font-lora text-sm transition-all duration-300 focus:outline-none ${errors[field]
            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'border-[#e3dac9] focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10'
        }`;

    const labelClass = 'block text-sm font-bold text-[#2b1b17] mb-2';

    const ErrorMsg = ({ field }: { field: keyof ProfesorFormErrors }) =>
        errors[field] ? (
            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors[field]}
            </p>
        ) : null;

    return (
        <Modal isOpen={open} onClose={handleClose} title="Registrar Nuevo Profesor" size="lg">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                {/* ── Información Personal ───────────────────────────────── */}
                <div>
                    <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full" />
                        Información Personal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                Nombre(s) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Ej: Ana"
                                value={formData.nombre}
                                onChange={handleChange('nombre')}
                                disabled={isLoading}
                                className={inputClass('nombre')}
                            />
                            <ErrorMsg field="nombre" />
                        </div>

                        {/* Apellido Paterno */}
                        <div>
                            <label className={labelClass}>
                                Apellido Paterno <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="apellidoPaterno"
                                placeholder="Ej: Rodríguez"
                                value={formData.apellidoPaterno}
                                onChange={handleChange('apellidoPaterno')}
                                disabled={isLoading}
                                className={inputClass('apellidoPaterno')}
                            />
                            <ErrorMsg field="apellidoPaterno" />
                        </div>

                        {/* Apellido Materno */}
                        <div>
                            <label className={labelClass}>
                                Apellido Materno <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="apellidoMaterno"
                                placeholder="Ej: Fernández"
                                value={formData.apellidoMaterno}
                                onChange={handleChange('apellidoMaterno')}
                                disabled={isLoading}
                                className={inputClass('apellidoMaterno')}
                            />
                            <ErrorMsg field="apellidoMaterno" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClass}>
                                Correo Electrónico <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Ej: ana@escuela.edu"
                                value={formData.email}
                                onChange={handleChange('email')}
                                disabled={isLoading}
                                className={inputClass('email')}
                            />
                            <ErrorMsg field="email" />
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
                                placeholder="Ej: +52 55 1234 5678"
                                value={formData.telefono || ''}
                                onChange={handleChange('telefono')}
                                disabled={isLoading}
                                className={inputClass('telefono')}
                            />
                            <ErrorMsg field="telefono" />
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
                                onChange={handleChange('fechaNacimiento')}
                                disabled={isLoading}
                                className={inputClass('fechaNacimiento')}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Información Académica ──────────────────────────────── */}
                <div>
                    <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full" />
                        Información Académica
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Especialidad */}
                        <div>
                            <label className={labelClass}>
                                Especialidad
                                <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                            </label>
                            <select
                                name="especialidad"
                                value={formData.especialidad || ''}
                                onChange={handleChange('especialidad')}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 transition-all"
                            >
                                <option value="">Sin especificar</option>
                                {ESPECIALIDADES.map(e => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha de Ingreso */}
                        <div>
                            <label className={labelClass}>
                                Fecha de Ingreso
                                <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                            </label>
                            <input
                                type="date"
                                name="fechaIngreso"
                                value={formData.fechaIngreso || ''}
                                onChange={handleChange('fechaIngreso')}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Seguridad ──────────────────────────────────────────── */}
                <div>
                    <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full" />
                        Acceso al Sistema
                    </h3>

                    <div className="relative">
                        <label className={labelClass}>
                            Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleChange('password')}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                        <ErrorMsg field="password" />
                    </div>
                </div>

                {/* ── Botones ────────────────────────────────────────────── */}
                <div className="flex gap-3 pt-6 border-t border-[#e3dac9]">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-[#e3dac9] text-[#5d4037] font-bold hover:bg-[#fbf8f1] transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Registrando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Registrar Profesor
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}