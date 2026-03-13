'use client';

import React from 'react';
import { AlumnoDetalleRow } from './AlumnoDetalleRow';
import { AlumnoEscuela } from '../../../types/escuela/alumnos/alumno.types';
import { GrupoListItem } from '../../../types/escuela/grupos/grupo';

interface AlumnoTableProps {
    alumnos: AlumnoEscuela[];
    grupos: GrupoListItem[];
    onEdit: (alumno: AlumnoEscuela) => void;
    onDelete: (alumno: AlumnoEscuela) => void;
}

export const AlumnoTable: React.FC<AlumnoTableProps> = ({
    alumnos,
    grupos,
    onEdit,
    onDelete
}) => {
    if (alumnos.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#fbf8f1] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#a1887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#2b1b17] mb-2">
                    No se encontraron alumnos
                </h3>
                <p className="text-[#8d6e3f]">
                    Intenta con otros términos de búsqueda o agrega un nuevo alumno
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <table className="w-full block md:table">
                <thead className="hidden md:table-header-group bg-gradient-to-r from-[#fbf8f1] to-[#f0e6d2]">
                    <tr className="block md:table-row">
                        <th className="px-6 py-4 text-center text-xs font-bold text-[#2b1b17] uppercase tracking-wider">
                            Alumno
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-[#2b1b17] uppercase tracking-wider">
                            Grupo
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-[#2b1b17] uppercase tracking-wider">
                            Contacto
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-[#2b1b17] uppercase tracking-wider">
                            Tutor
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-[#2b1b17] uppercase tracking-wider">
                            Ciclo Escolar
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-[#2b1b17] uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="block md:table-row-group divide-y md:divide-y md:divide-[#e3dac9] space-y-4 md:space-y-0 p-4 md:p-0">
                    {alumnos.map((alumno) => (
                        <AlumnoDetalleRow
                            key={alumno.id}
                            alumno={alumno}
                            grupos={grupos}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};