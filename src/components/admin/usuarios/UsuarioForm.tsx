'use client';

import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { RoleSelector } from './RoleSelector';
import { AlumnoFields } from './AlumnoFields';
import { ProfesorFields } from './ProfesorFields';
import { TutorFields } from './TutorFields';
import { DirectorFields } from './DirectorFields';
import { isValidEmail, sanitizeText, sanitizeEmail, focusFirstError, hasUppercase } from '../../../utils/formValidation';

type UserRole = 'alumno' | 'profesor' | 'tutor' | 'director' | null;

interface UsuarioFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isLoading?: boolean;
    initialData?: any;
    isEditing?: boolean;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
    onSubmit,
    onCancel,
    isLoading = false,
    initialData = null,
    isEditing = false
}) => {
    const [selectedRole, setSelectedRole] = useState<UserRole>(initialData?.role || null);
    const [formData, setFormData] = useState<any>(initialData || {});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleRoleChange = (role: UserRole) => {
        setSelectedRole(role);
        setFormData({});
        setErrors({});
    };

    const handleFieldChange = (name: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let hasErrors = false;
        const newErrors: Record<string, string> = {};

        if (!selectedRole) {
            newErrors.role = 'Debes seleccionar un rol';
            hasErrors = true;
        }

        // Sanitización y validación de campos comunes
        const sNombre = formData.nombre ? sanitizeText(formData.nombre) : '';
        const sPaterno = formData.apellidoPaterno ? sanitizeText(formData.apellidoPaterno) : '';
        const sMaterno = formData.apellidoMaterno ? sanitizeText(formData.apellidoMaterno) : '';
        const sEmail = formData.email ? sanitizeEmail(formData.email) : '';
        const sTelefono = formData.telefono ? sanitizeText(formData.telefono) : '';

        if (!sNombre) {
            newErrors.nombre = 'El nombre es requerido';
            hasErrors = true;
        }

        if (!sPaterno) {
            newErrors.apellidoPaterno = 'El apellido paterno es requerido';
            hasErrors = true;
        }

        if (!sMaterno) {
            newErrors.apellidoMaterno = 'El apellido materno es requerido';
            hasErrors = true;
        }

        if (!sEmail) {
            newErrors.email = 'El correo electrónico es requerido';
            hasErrors = true;
        } else if (hasUppercase(formData.email || '')) {
            newErrors.email = 'El correo electrónico debe escribirse solo con minúsculas';
            hasErrors = true;
        } else if (!isValidEmail(sEmail)) {
            newErrors.email = 'El formato del correo es inválido';
            hasErrors = true;
        }

        // ✅ Validación de contraseña:
        // - Al CREAR: obligatoria (mínimo 6 caracteres)
        // - Al EDITAR: solo validar si escribió algo
        const passwordValue = formData.password || '';
        if (!isEditing && passwordValue.trim().length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            hasErrors = true;
        }
        if (isEditing && passwordValue.trim().length > 0 && passwordValue.trim().length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            hasErrors = true;
        }

        // ✅ Validación de campos específicos por rol
        if (!isEditing) {
            if (['alumno', 'director', 'profesor'].includes(selectedRole as string)) {
                if (!formData.idEscuela) {
                    newErrors.idEscuela = 'Debes seleccionar una escuela';
                    hasErrors = true;
                }
            }
        }

        if (hasErrors) {
            setErrors(newErrors);
            focusFirstError(newErrors);
            return;
        }

        // ✅ Construir payload con TODOS los campos que se hayan llenado en los subformularios
        const dataToSubmit: any = {
            ...formData, // Asegurar que todo lo capturado en los subformularios (como idEscuela, grado, etc) se incluya
            role: selectedRole,
            nombre: sNombre,
            apellidoPaterno: sPaterno,
            apellidoMaterno: sMaterno,
            email: sEmail,
            telefono: sTelefono,
        };

        if (isEditing && passwordValue.trim() === '') {
            delete dataToSubmit.password;
        }

        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#c19a2e] rounded-full"></div>
                    Tipo de Usuario
                </h3>

                {isEditing ? (
                    <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-2">Tipo de usuario (no editable):</p>
                        <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold">
                                {selectedRole === 'alumno' && '📚 Alumno'}
                                {selectedRole === 'profesor' && '👨‍🏫 Profesor'}
                                {selectedRole === 'tutor' && '👥 Tutor'}
                                {selectedRole === 'director' && '⭐ Director'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <RoleSelector
                        selectedRole={selectedRole}
                        onRoleChange={handleRoleChange}
                        error={errors.role}
                    />
                )}
            </div>

            {/* ✅ Se pasa isEditing a cada *Fields para que ajusten su comportamiento */}
            {selectedRole === 'alumno' && (
                <AlumnoFields
                    data={formData}
                    onChange={handleFieldChange}
                    errors={errors}
                    isEditing={isEditing}
                />
            )}

            {selectedRole === 'profesor' && (
                <ProfesorFields
                    data={formData}
                    onChange={handleFieldChange}
                    errors={errors}
                    isEditing={isEditing}
                />
            )}

            {selectedRole === 'tutor' && (
                <TutorFields
                    data={formData}
                    onChange={handleFieldChange}
                    errors={errors}
                    isEditing={isEditing}
                />
            )}

            {selectedRole === 'director' && (
                <DirectorFields
                    data={formData}
                    onChange={handleFieldChange}
                    errors={errors}
                    isEditing={isEditing}
                />
            )}

            {selectedRole && (
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
                        {isLoading
                            ? (isEditing ? 'Guardando...' : 'Registrando...')
                            : (isEditing ? 'Guardar Cambios' : 'Registrar Usuario')
                        }
                    </Button>
                </div>
            )}
        </form>
    );
};