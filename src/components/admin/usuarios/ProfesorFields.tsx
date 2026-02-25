'use client';

import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { EscuelaSelector } from './Escuelaselector';
import { EscuelaBusqueda } from '../../../types/admin/escuelas/escuela';

interface ProfesorFieldsProps {
    data: any;
    onChange: (name: string, value: any) => void;
    errors: Record<string, string>;
    isEditing?: boolean;
}

export const ProfesorFields: React.FC<ProfesorFieldsProps> = ({
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
            {/* Información Personal del Profesor */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Información del Profesor
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        name="nombre"
                        value={data.nombre || ''}
                        onChange={(e) => onChange('nombre', e.target.value)}
                        placeholder="Ej: Carlos"
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
                        placeholder="Ej: Ramírez"
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
                        placeholder="profesor@correo.com"
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
                        label="Especialidad"
                        name="especialidad"
                        value={data.especialidad || ''}
                        onChange={(e) => onChange('especialidad', e.target.value)}
                        placeholder="Ej: Matemáticas"
                        error={errors.especialidad}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        }
                    />

                    <Input
                        label="Fecha de Ingreso"
                        name="fechaIngreso"
                        type="date"
                        value={data.fechaIngreso || ''}
                        onChange={(e) => onChange('fechaIngreso', e.target.value)}
                        error={errors.fechaIngreso}
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
                            Selecciona la escuela donde trabajará este profesor
                        </p>
                        <EscuelaSelector
                            onSelect={handleEscuelaSelect}
                            selectedEscuela={selectedEscuela}
                            error={errors.idEscuela}
                        />
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h4 className="font-bold text-purple-900 mb-1">Sobre la asignación de escuela</h4>
                                <ul className="text-sm text-purple-800 space-y-1">
                                    <li>• La asignación de escuela es <strong>obligatoria</strong> para profesores</li>
                                    <li>• El profesor podrá gestionar alumnos de la escuela asignada</li>
                                    <li>• Puedes cambiar la escuela después desde la edición del perfil</li>
                                    <li>• Un profesor solo puede estar asignado a una escuela a la vez</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};