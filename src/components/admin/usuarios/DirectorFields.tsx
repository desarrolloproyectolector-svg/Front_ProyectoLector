'use client';

import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { EscuelaSelector } from './Escuelaselector';
import { EscuelaBusqueda } from '../../../types/admin/escuelas/escuela';

interface DirectorFieldsProps {
    data: any;
    onChange: (name: string, value: any) => void;
    errors: Record<string, string>;
    isEditing?: boolean;
}

export const DirectorFields: React.FC<DirectorFieldsProps> = ({
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
            {/* Información Personal del Director */}
            <div>
                <h3 className="text-lg font-playfair font-bold text-[#2b1b17] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                    Información del Director
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        name="nombre"
                        value={data.nombre || ''}
                        onChange={(e) => onChange('nombre', e.target.value)}
                        placeholder="Ej: Roberto"
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
                        placeholder="Ej: Hernández"
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
                        placeholder="Ej: Silva"
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
                        placeholder="director@correo.com"
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
                        label="Fecha de Nombramiento"
                        name="fechaNombramiento"
                        type="date"
                        value={data.fechaNombramiento || ''}
                        onChange={(e) => onChange('fechaNombramiento', e.target.value)}
                        error={errors.fechaNombramiento}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
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
                            Selecciona la escuela que dirigirá este director
                        </p>
                        <EscuelaSelector
                            onSelect={handleEscuelaSelect}
                            selectedEscuela={selectedEscuela}
                            error={errors.idEscuela}
                        />
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <div>
                                <h4 className="font-bold text-amber-900 mb-1">⚠️ Importante sobre directores</h4>
                                <ul className="text-sm text-amber-800 space-y-1">
                                    <li>• La asignación de escuela es <strong>obligatoria</strong></li>
                                    <li>• <strong>Una escuela solo puede tener un director</strong></li>
                                    <li>• Si la escuela ya tiene director, el registro fallará</li>
                                    <li>• El director tendrá control total sobre su escuela asignada</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};