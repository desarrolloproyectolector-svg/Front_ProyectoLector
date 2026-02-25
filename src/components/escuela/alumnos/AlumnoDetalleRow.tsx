'use client';

import React, { useState } from 'react';
import { AlumnoEscuela, getNombreCompletoAlumno, formatGrupo } from '../../../types/escuela/alumnos/alumno.types';

interface AlumnoDetalleRowProps {
    alumno: AlumnoEscuela;
    onEdit: (alumno: AlumnoEscuela) => void;
    onDelete: (alumno: AlumnoEscuela) => void;
}

export const AlumnoDetalleRow: React.FC<AlumnoDetalleRowProps> = ({
    alumno,
    onEdit,
    onDelete
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const nombreCompleto = getNombreCompletoAlumno(alumno);
    const grupo = formatGrupo(alumno.grado, alumno.grupo);

    // Separar apellido en partes si es necesario
    const getApellidosSeparados = () => {
        const partes = alumno.persona.apellido.trim().split(' ');
        return {
            paterno: partes[0] || '',
            materno: partes.slice(1).join(' ') || ''
        };
    };

    const { paterno, materno } = getApellidosSeparados();

    return (
        <>
            {/* Fila principal */}
            <tr className={`hover:bg-[#fbf8f1] transition-colors duration-200 ${isExpanded ? 'bg-[#fbf8f1]' : ''}`}>
                {/* Columna: Alumno */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                            {alumno.persona.nombre.charAt(0)}
                        </div>
                        <div>
                            <div className="font-playfair font-bold text-[#2b1b17]">{nombreCompleto}</div>
                            <div className="text-sm text-[#8d6e3f]">{alumno.persona.correo}</div>
                        </div>
                    </div>
                </td>

                {/* Columna: Grupo */}
                <td className="px-6 py-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                        📚 {grupo}
                    </span>
                </td>

                {/* Columna: Contacto */}
                <td className="px-6 py-4">
                    <div className="text-sm text-[#5d4037] flex items-center gap-1">
                        {alumno.persona.telefono ? (
                            <>
                                <span className="text-[#d4af37]">📞</span> {alumno.persona.telefono}
                            </>
                        ) : (
                            <span className="text-[#a1887f] italic">Sin teléfono</span>
                        )}
                    </div>
                </td>

                {/* Columna: Tutor */}
                <td className="px-6 py-4">
                    {alumno.padre ? (
                        <div className="text-sm">
                            <div className="font-bold text-[#2b1b17]">
                                {alumno.padre.persona.nombre} {alumno.padre.persona.apellido}
                            </div>
                            <div className="text-xs text-[#8d6e3f] capitalize">{alumno.padre.parentesco}</div>
                        </div>
                    ) : (
                        <span className="text-sm text-[#a1887f]">Sin tutor asignado</span>
                    )}
                </td>

                {/* Columna: Ciclo Escolar */}
                <td className="px-6 py-4">
                    <span className="text-sm text-[#5d4037]">
                        {alumno.cicloEscolar || <span className="text-[#a1887f] italic">N/A</span>}
                    </span>
                </td>

                {/* Columna: Acciones */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {/* Botón expandir/contraer */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                isExpanded 
                                    ? 'bg-[#d4af37] text-white' 
                                    : 'hover:bg-[#d4af37]/10 text-[#8d6e3f]'
                            }`}
                            title={isExpanded ? 'Contraer' : 'Expandir detalles'}
                        >
                            <svg 
                                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Botón editar */}
                        <button 
                            onClick={() => onEdit(alumno)} 
                            className="p-2 hover:bg-blue-50 rounded-lg text-[#8d6e3f] hover:text-blue-600 transition-colors"
                            title="Editar alumno"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>

                        {/* Botón eliminar */}
                        <button 
                            onClick={() => onDelete(alumno)} 
                            className="p-2 hover:bg-red-50 rounded-lg text-[#8d6e3f] hover:text-red-600 transition-colors"
                            title="Eliminar alumno"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>

            {/* Fila expandible con detalles */}
            {isExpanded && (
                <tr className="bg-[#fbf8f1]/30">
                    <td colSpan={6} className="px-8 py-6">
                        <div className="bg-white rounded-xl border border-[#e3dac9] shadow-sm overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e3dac9]">
                                
                                {/* Grupo 1: Información Personal */}
                                <div className="p-5">
                                    <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                                        👤 Datos Personales
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Nombre(s)</p>
                                            <p className="text-sm text-[#2b1b17]">{alumno.persona.nombre}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">A. Paterno</p>
                                                <p className="text-sm text-[#2b1b17]">{paterno || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">A. Materno</p>
                                                <p className="text-sm text-[#2b1b17]">{materno || '—'}</p>
                                            </div>
                                        </div>
                                        {alumno.persona.fechaNacimiento && (
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Fecha de Nacimiento</p>
                                                <p className="text-sm text-[#2b1b17]">
                                                    {new Date(alumno.persona.fechaNacimiento).toLocaleDateString('es-MX')}
                                                </p>
                                            </div>
                                        )}
                                        {alumno.persona.genero && (
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Género</p>
                                                <p className="text-sm text-[#2b1b17] capitalize">{alumno.persona.genero}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Grupo 2: Información Académica */}
                                <div className="p-5 bg-[#fbf8f1]/20">
                                    <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                                        📚 Información Académica
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Grado</p>
                                                <p className="text-sm text-[#2b1b17]">{alumno.grado || '—'}°</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Grupo</p>
                                                <p className="text-sm text-[#2b1b17]">{alumno.grupo || '—'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Ciclo Escolar</p>
                                            <p className="text-sm text-[#2b1b17]">{alumno.cicloEscolar || '—'}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">ID Alumno</p>
                                                <p className="text-sm text-[#2b1b17]">#{alumno.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">ID Persona</p>
                                                <p className="text-sm text-[#2b1b17]">#{alumno.personaId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grupo 3: Información del Tutor */}
                                <div className="p-5">
                                    <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                                        👨‍👩‍👧 Tutor / Padre de Familia
                                    </h4>
                                    {alumno.padre ? (
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Nombre Completo</p>
                                                <p className="text-sm text-[#2b1b17]">
                                                    {alumno.padre.persona.nombre} {alumno.padre.persona.apellido}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Parentesco</p>
                                                <p className="text-sm text-[#2b1b17] capitalize">{alumno.padre.parentesco}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Correo</p>
                                                <p className="text-sm text-[#2b1b17] break-all">{alumno.padre.persona.correo}</p>
                                            </div>
                                            {alumno.padre.persona.telefono && (
                                                <div>
                                                    <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Teléfono</p>
                                                    <p className="text-sm text-[#2b1b17]">{alumno.padre.persona.telefono}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#a1887f] italic">
                                            No hay un tutor asignado a este alumno.
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};