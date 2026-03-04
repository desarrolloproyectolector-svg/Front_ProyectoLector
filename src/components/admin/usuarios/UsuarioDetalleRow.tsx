'use client';

import React, { useState } from 'react';

interface Usuario {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
    correo: string;
    telefono: string | null;
    ultimaConexion?: string | null;
    tipoPersona: 'administrador' | 'director' | 'maestro' | 'alumno' | 'padre';
    activo: boolean;
    rolId: number;
    escuela?: {
        id: number;
        nombre: string;
        nivel: string;
    };
}

interface UsuarioDetalleRowProps {
    usuario: Usuario;
    badgeColor: string;
    badgeIcon: string;
    badgeLabel: string;
    onEdit: (usuario: Usuario) => void;
    onDelete: (usuario: Usuario) => void;
}

const getNombreCompleto = (usuario: Usuario): string => {
    return `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno ?? ''}`.trim();
};

const formatUltimaConexion = (fecha?: string | null): string => {
    if (!fecha) return 'Sin registro';

    const parsedDate = new Date(fecha);
    if (Number.isNaN(parsedDate.getTime())) return 'Sin registro';

    return parsedDate.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const UsuarioDetalleRow: React.FC<UsuarioDetalleRowProps> = ({
    usuario,
    badgeColor,
    badgeIcon,
    badgeLabel,
    onEdit,
    onDelete,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const nombreCompleto = getNombreCompleto(usuario);

    const paterno = usuario.apellidoPaterno;
    const materno = usuario.apellidoMaterno ?? '';

    return (
        <>
            {/* Fila principal */}
            <tr className={`block md:table-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-xl md:rounded-none shadow-sm md:shadow-none border border-[#e3dac9] md:border-0 hover:bg-[#fbf8f1] transition-colors duration-200 ${isExpanded ? 'bg-[#fbf8f1] md:bg-[#fbf8f1]' : ''}`}>
                <td className="block md:table-cell px-4 md:px-6 py-3 md:py-4 border-b border-[#e3dac9]/30 md:border-0 relative">
                    <span className="md:hidden text-[10px] font-bold uppercase text-[#a1887f] mb-2 block">Usuario</span>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#c19a2e] flex items-center justify-center text-white font-bold shadow-md">
                            {usuario.nombre.charAt(0)}
                        </div>
                        <div>
                            <div className="font-playfair font-bold text-[#2b1b17]">{nombreCompleto}</div>
                            <div className="text-sm text-[#8d6e3f]">{usuario.correo}</div>
                        </div>
                    </div>
                </td>
                <td className="block md:table-cell px-4 md:px-6 py-3 md:py-4 border-b border-[#e3dac9]/30 md:border-0">
                    <span className="md:hidden text-[10px] font-bold uppercase text-[#a1887f] mb-2 block">Rol</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${badgeColor}`}>
                        {badgeIcon} {badgeLabel}
                    </span>
                </td>
                <td className="block md:table-cell px-4 md:px-6 py-3 md:py-4 border-b border-[#e3dac9]/30 md:border-0">
                    <span className="md:hidden text-[10px] font-bold uppercase text-[#a1887f] mb-2 block">Contacto</span>
                    <div className="text-sm text-[#5d4037] flex items-center gap-1">
                        {usuario.telefono ? (
                            <><span className="text-[#d4af37]">📞</span> {usuario.telefono}</>
                        ) : (
                            <span className="text-[#a1887f] italic">Sin teléfono</span>
                        )}
                    </div>
                </td>
                <td className="block md:table-cell px-4 md:px-6 py-3 md:py-4 border-b border-[#e3dac9]/30 md:border-0">
                    <span className="md:hidden text-[10px] font-bold uppercase text-[#a1887f] mb-2 block">Escuela</span>
                    {usuario.escuela ? (
                        <div className="text-sm">
                            <div className="font-bold text-[#2b1b17]">{usuario.escuela.nombre}</div>
                            <div className="text-xs text-[#8d6e3f]">{usuario.escuela.nivel}</div>
                        </div>
                    ) : (
                        <span className="text-sm text-[#a1887f]">N/A</span>
                    )}
                </td>
                <td className="block md:table-cell px-4 md:px-6 py-3 md:py-4 border-b border-[#e3dac9]/30 md:border-0">
                    <span className="md:hidden text-[10px] font-bold uppercase text-[#a1887f] mb-2 block">Estado</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${usuario.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {usuario.activo ? '✓ Activo' : '○ Inactivo'}
                    </span>
                </td>
                <td className="block md:table-cell px-4 md:px-6 py-3 md:py-4 border-b border-[#e3dac9]/30 md:border-0">
                    <span className="md:hidden text-[10px] font-bold uppercase text-[#a1887f] mb-2 block">Últ. Conexión</span>
                    <span className="text-sm text-[#5d4037]">
                        {formatUltimaConexion(usuario.ultimaConexion)}
                    </span>
                </td>
                <td className="block md:table-cell px-4 md:px-6 py-3 md:py-4 flex md:table-cell justify-between items-center bg-[#fbf8f1]/50 md:bg-transparent rounded-b-xl md:rounded-none">
                    <span className="md:hidden text-[10px] font-bold uppercase text-[#a1887f]">Acciones</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`p-2 rounded-lg transition-all duration-200 ${isExpanded ? 'bg-[#d4af37] text-white' : 'hover:bg-[#d4af37]/10 text-[#8d6e3f]'}`}
                        >
                            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <button onClick={() => onEdit(usuario)} className="p-2 hover:bg-blue-50 rounded-lg text-[#8d6e3f] hover:text-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onClick={() => onDelete(usuario)} className="p-2 hover:bg-red-50 rounded-lg text-[#8d6e3f] hover:text-red-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>

            {/* Fila expandible organizada */}
            {isExpanded && (
                <tr className="block md:table-row bg-[#fbf8f1]/30 -mt-2 md:mt-0 relative z-[-1] rounded-b-xl md:rounded-none">
                    <td colSpan={7} className="block md:table-cell px-4 md:px-8 py-4 md:py-6">
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
                                            <p className="text-sm text-[#2b1b17]">{usuario.nombre}</p>
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
                                    </div>
                                </div>

                                {/* Grupo 2: Cuenta y Contacto */}
                                <div className="p-5 bg-[#fbf8f1]/20">
                                    <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                                        📧 Información de Cuenta
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Correo Electrónico</p>
                                            <p className="text-sm text-[#2b1b17] break-all">{usuario.correo}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">ID Usuario</p>
                                                <p className="text-sm text-[#2b1b17]">#{usuario.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Rol ID</p>
                                                <p className="text-sm text-[#2b1b17]">{usuario.rolId}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Tipo</p>
                                                <p className="text-sm text-[#2b1b17] capitalize">{usuario.tipoPersona}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grupo 3: Institución */}
                                <div className="p-5">
                                    <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                                        🏫 Institución
                                    </h4>
                                    {usuario.escuela ? (
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Nombre de Escuela</p>
                                                <p className="text-sm text-[#2b1b17]">{usuario.escuela.nombre}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">Nivel</p>
                                                    <p className="text-sm text-[#2b1b17]">{usuario.escuela.nivel}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-[#8d6e3f] font-bold uppercase">ID escuela</p>
                                                    <p className="text-sm text-[#2b1b17]">#{usuario.escuela.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#a1887f] italic">No hay una escuela vinculada a este perfil.</p>
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