'use client';

import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { EscuelaSelector } from './Escuelaselector';
import { EscuelaBusqueda } from '../../../types/admin/escuelas/escuela';

interface AlumnoFieldsProps {
    data: any;
    onChange: (name: string, value: any) => void;
    errors: Record<string, string>;
    isEditing?: boolean;
}

export const AlumnoFields: React.FC<AlumnoFieldsProps> = ({
    data,
    onChange,
    errors,
    isEditing = false,
}) => {
    const [selectedEscuela, setSelectedEscuela] = useState<EscuelaBusqueda | null>(null);

    const handleEscuelaSelect = (escuela: EscuelaBusqueda | null) => {
        setSelectedEscuela(escuela);
        onChange('idEscuela', escuela ? escuela.id : null);
    };

    return (
        <div className="space-y-6">
            {/* Información Personal del Alumno */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    Información del Alumno
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        name="nombre"
                        value={data.nombre || ''}
                        onChange={(e) => onChange('nombre', e.target.value)}
                        placeholder="Ej: Juan"
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
                        placeholder="Ej: Pérez"
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
                        placeholder="Ej: García"
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
                        placeholder="alumno@correo.com"
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

                    <Input
                        label="Grado"
                        name="grado"
                        type="number"
                        value={data.grado || ''}
                        onChange={(e) => onChange('grado', e.target.value ? parseInt(e.target.value) : '')}
                        placeholder="Ej: 1"
                        error={errors.grado}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Grupo"
                        name="grupo"
                        value={data.grupo || ''}
                        onChange={(e) => onChange('grupo', e.target.value)}
                        placeholder="Ej: A, B, C"
                        error={errors.grupo}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Ciclo Escolar"
                        name="cicloEscolar"
                        value={data.cicloEscolar || ''}
                        onChange={(e) => onChange('cicloEscolar', e.target.value)}
                        placeholder="2024-2025"
                        error={errors.cicloEscolar}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Solo mostrar selector de escuela al CREAR */}
            {!isEditing && (
                <>
                    <div className="border-t-2 border-[#e3dac9]"></div>
                    <div>
                        <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                            Asignar Escuela
                        </h3>
                        <p className="text-sm text-[#8d6e3f] mb-4">
                            Selecciona la escuela donde estudiará este alumno
                        </p>
                        <EscuelaSelector
                            onSelect={handleEscuelaSelect}
                            selectedEscuela={selectedEscuela}
                            error={errors.idEscuela}
                        />
                    </div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-1">Sobre el registro de alumnos</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• La asignación de escuela es <strong>obligatoria</strong></li>
                                    <li>• El alumno podrá acceder a los recursos de su escuela</li>
                                    <li>• Los campos de grado, grupo y ciclo escolar son opcionales</li>
                                    <li>• Se generará automáticamente una matrícula única</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};