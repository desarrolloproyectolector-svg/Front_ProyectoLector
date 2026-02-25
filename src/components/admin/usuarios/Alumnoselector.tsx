'use client';

import React, { useState, useEffect } from 'react';
import { AlumnoService } from '../../../service/admin/usuarios/alumno.service';
import { AlumnoBusqueda, getNombreCompletoAlumno } from '../../../types/admin/usuarios/alumno';

interface AlumnoSelectorProps {
    onSelect: (alumno: AlumnoBusqueda | null) => void;
    selectedAlumno?: AlumnoBusqueda | null;
    error?: string;
}

export const AlumnoSelector: React.FC<AlumnoSelectorProps> = ({
    onSelect,
    selectedAlumno,
    error
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [alumnos, setAlumnos] = useState<AlumnoBusqueda[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchError, setSearchError] = useState('');

    // Buscar alumnos cuando el usuario escribe (debounce)
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchTerm.trim().length >= 2) {
                handleSearch();
            } else {
                setAlumnos([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const handleSearch = async () => {
        setIsSearching(true);
        setSearchError('');
        
        try {
            console.log('🔍 Buscando alumnos con término:', searchTerm);
            
            const response: any = await AlumnoService.search('nombre', searchTerm.trim());
            
            console.log('📦 Respuesta completa de la API:', response);
            
            // La API devuelve: { message, description, total, data: [...] }
            let alumnosData: AlumnoBusqueda[] = [];
            
            if (response && response.data && Array.isArray(response.data)) {
                console.log('✅ Response.data es un array con', response.data.length, 'alumnos');
                alumnosData = response.data;
            } else if (Array.isArray(response)) {
                console.log('✅ Response es un array directo con', response.length, 'alumnos');
                alumnosData = response;
            } else {
                console.warn('⚠️ Formato de respuesta inesperado:', response);
            }
            
            console.log('📋 Total de alumnos encontrados:', alumnosData.length);
            if (alumnosData.length > 0) {
                console.log('📋 Primer alumno:', alumnosData[0]);
            }
            
            setAlumnos(alumnosData);
            setShowResults(true);
        } catch (error: any) {
            console.error('❌ Error al buscar alumnos:', error);
            console.error('❌ Error response:', error.response?.data);
            
            setSearchError('Error al buscar alumnos. Verifica tu conexión.');
            setAlumnos([]);
            setShowResults(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectAlumno = (alumno: AlumnoBusqueda) => {
        console.log('✅ Alumno seleccionado:', alumno);
        // Convertir id a número si es string
        const alumnoConIdNumerico = {
            ...alumno,
            id: typeof alumno.id === 'string' ? parseInt(alumno.id) : alumno.id
        };
        onSelect(alumnoConIdNumerico);
        setSearchTerm('');
        setShowResults(false);
        setAlumnos([]);
    };

    const handleClearSelection = () => {
        console.log('🗑️ Limpiando selección de alumno');
        onSelect(null);
    };

    return (
        <div className="space-y-4">
            {selectedAlumno ? (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {selectedAlumno.persona.nombre.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-playfair font-bold text-[#2b1b17] text-lg">
                                        {getNombreCompletoAlumno(selectedAlumno)}
                                    </h4>
                                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full">
                                        ✓ Seleccionado
                                    </span>
                                </div>
                                <p className="text-sm text-emerald-700">
                                    <strong>Grado:</strong> {selectedAlumno.grado}
                                    {selectedAlumno.grupo && <> - <strong>Grupo:</strong> {selectedAlumno.grupo}</>}
                                </p>
                                <p className="text-sm text-emerald-700">
                                    <strong>Escuela:</strong> {selectedAlumno.escuela.nombre}
                                </p>
                                <p className="text-sm text-emerald-600">
                                    {selectedAlumno.persona.correo}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearSelection}
                            className="p-2 hover:bg-emerald-200 rounded-lg transition-colors"
                            title="Quitar selección"
                        >
                            <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                            Buscar Alumno (opcional)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Escribe el nombre del alumno..."
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 ${
                                    error ? 'border-red-300' : 'border-[#e3dac9]'
                                } bg-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 font-lora text-sm transition-all duration-300`}
                            />
                            <svg className="w-5 h-5 text-[#a1887f] absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#d4af37]"></div>
                                </div>
                            )}
                        </div>
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                        <p className="mt-1 text-xs text-[#8d6e3f]">
                            Escribe al menos 2 caracteres para buscar
                        </p>
                    </div>

                    {showResults && (
                        <div className="bg-white border-2 border-[#e3dac9] rounded-xl shadow-lg max-h-64 overflow-y-auto">
                            {searchError ? (
                                <div className="p-4 text-center text-red-600">
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p className="text-sm">{searchError}</p>
                                </div>
                            ) : alumnos.length === 0 ? (
                                <div className="p-6 text-center">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-[#a1887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <p className="text-sm font-bold text-[#2b1b17] mb-1">No se encontraron alumnos</p>
                                    <p className="text-xs text-[#8d6e3f]">No hay alumnos con el nombre "{searchTerm}"</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#e3dac9]">
                                    {alumnos.map((alumno) => (
                                        <button
                                            key={alumno.id}
                                            onClick={() => handleSelectAlumno(alumno)}
                                            className="w-full p-4 hover:bg-[#fbf8f1] transition-colors text-left flex items-center gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                                                {alumno.persona.nombre.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-playfair font-bold text-[#2b1b17] truncate">
                                                    {getNombreCompletoAlumno(alumno)}
                                                </h4>
                                                <p className="text-xs text-[#8d6e3f]">
                                                    Grado {alumno.grado}
                                                    {alumno.grupo && ` - Grupo ${alumno.grupo}`} 
                                                    {' | '}{alumno.escuela.nombre}
                                                </p>
                                                <p className="text-xs text-[#a1887f] truncate">
                                                    {alumno.persona.correo}
                                                </p>
                                            </div>
                                            <svg className="w-5 h-5 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};