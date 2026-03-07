'use client';

import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { AlumnoSelector } from './AlumnoSelector';
import { AlumnoBusqueda } from '../../../types/admin/usuarios/alumno';

interface TutorFieldsProps {
    data: any;
    onChange: (name: string, value: any) => void;
    errors: Record<string, string>;
    isEditing?: boolean;
}

export const TutorFields: React.FC<TutorFieldsProps> = ({
    data,
    onChange,
    errors,
    isEditing = false,
}) => {
    const [selectedAlumno, setSelectedAlumno] = useState<AlumnoBusqueda | null>(null);

    const handleAlumnoSelect = (alumno: AlumnoBusqueda | null) => {
        setSelectedAlumno(alumno);
        onChange('alumnoId', alumno ? alumno.id : null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Información del Padre/Tutor
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        name="nombre"
                        value={data.nombre || ''}
                        onChange={(e) => onChange('nombre', e.target.value)}
                        placeholder="Ej: María"
                        error={errors.nombre}
                        required
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Apellido Paterno"
                        name="apellidoPaterno"
                        value={data.apellidoPaterno || ''}
                        onChange={(e) => onChange('apellidoPaterno', e.target.value)}
                        placeholder="Ej: López"
                        error={errors.apellidoPaterno}
                        required
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Apellido Materno"
                        name="apellidoMaterno"
                        value={data.apellidoMaterno || ''}
                        onChange={(e) => onChange('apellidoMaterno', e.target.value)}
                        placeholder="Ej: Martínez"
                        error={errors.apellidoMaterno}
                        required
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
                        value={data.email || ''}
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="padre@example.com"
                        error={errors.email}
                        required
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        }
                    />

                    {/* ✅ Contraseña: obligatoria solo al CREAR, opcional al EDITAR */}
                    <Input
                        label={isEditing ? 'Nueva Contraseña' : 'Contraseña'}
                        name="password"
                        type="password"
                        value={data.password || ''}
                        onChange={(e) => onChange('password', e.target.value)}
                        placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
                        error={errors.password}
                        required={!isEditing}
                        helperText={isEditing ? 'Solo completa este campo si deseas cambiar la contraseña' : undefined}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        value={data.telefono || ''}
                        onChange={(e) => onChange('telefono', e.target.value)}
                        placeholder="+52 55 1234 5678"
                        error={errors.telefono}
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
                        value={data.fechaNacimiento || ''}
                        onChange={(e) => onChange('fechaNacimiento', e.target.value)}
                        error={errors.fechaNacimiento}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Solo mostrar vinculación de alumno al CREAR */}
            {!isEditing && (
                <>
                    <div className="border-t-2 border-[#e3dac9]"></div>
                    <div>
                        <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Vincular con Alumno
                        </h3>
                        <p className="text-sm text-[#8d6e3f] mb-4">
                            Opcional: Asocia este padre/tutor con un alumno existente en el sistema
                        </p>
                        <AlumnoSelector
                            onSelect={handleAlumnoSelect}
                            selectedAlumno={selectedAlumno}
                            error={errors.alumnoId}
                        />
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-1">Sobre la vinculación de alumnos</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• La vinculación con un alumno es <strong>opcional</strong></li>
                                    <li>• Puedes registrar al padre/tutor sin vincularlo y hacerlo después</li>
                                    <li>• Si vinculas ahora, el padre tendrá acceso inmediato a la información del alumno</li>
                                    <li>• Un padre puede estar asociado con múltiples alumnos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};