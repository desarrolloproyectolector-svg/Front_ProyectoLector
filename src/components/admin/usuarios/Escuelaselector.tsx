'use client';

import React, { useState, useEffect } from 'react';
import { EscuelaService } from '../../../service/escuela.service';
import { EscuelaBusqueda } from '../../../types/admin/escuelas/escuela';

interface EscuelaSelectorProps {
    onSelect: (escuela: EscuelaBusqueda | null) => void;
    selectedEscuela?: EscuelaBusqueda | null;
    error?: string;
}

export const EscuelaSelector: React.FC<EscuelaSelectorProps> = ({
    onSelect,
    selectedEscuela,
    error
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [escuelas, setEscuelas] = useState<EscuelaBusqueda[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchError, setSearchError] = useState('');

    // Buscar escuelas cuando el usuario escribe (debounce)
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchTerm.trim().length >= 2) {
                handleSearch();
            } else {
                setEscuelas([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const handleSearch = async () => {
        setIsSearching(true);
        setSearchError('');
        
        try {
            const response = await EscuelaService.search(searchTerm.trim());
            
            let escuelasData: EscuelaBusqueda[] = [];
            
            if (response && response.data && Array.isArray(response.data)) {
                escuelasData = response.data;
            } else if (Array.isArray(response)) {
                escuelasData = response;
            }
            
            setEscuelas(escuelasData);
            setShowResults(true);
        } catch (error: any) {
            console.error('❌ Error al buscar escuelas:', error);
            setSearchError('Error al buscar escuelas. Verifica tu conexión.');
            setEscuelas([]);
            setShowResults(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectEscuela = (escuela: EscuelaBusqueda) => {
        const escuelaConIdNumerico = {
            ...escuela,
            id: typeof escuela.id === 'string' ? parseInt(escuela.id) : escuela.id
        };
        onSelect(escuelaConIdNumerico);
        setSearchTerm('');
        setShowResults(false);
        setEscuelas([]);
    };

    const handleClearSelection = () => {
        onSelect(null);
    };

    return (
        <div className="space-y-4">
            {selectedEscuela ? (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                🏫
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-playfair font-bold text-[#2b1b17] text-lg">
                                        {selectedEscuela.nombre}
                                    </h4>
                                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs font-bold rounded-full">
                                        ✓ Seleccionada
                                    </span>
                                </div>
                                <p className="text-sm text-purple-700">
                                    <strong>Nivel:</strong> {selectedEscuela.nivel}
                                </p>
                                {selectedEscuela.clave && (
                                    <p className="text-sm text-purple-700">
                                        <strong>Clave:</strong> {selectedEscuela.clave}
                                    </p>
                                )}
                                {selectedEscuela.direccion && (
                                    <p className="text-sm text-purple-600">
                                        📍 {selectedEscuela.direccion}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleClearSelection}
                            className="p-2 hover:bg-purple-200 rounded-lg transition-colors"
                            title="Quitar selección"
                        >
                            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                            Buscar Escuela
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Escribe el nombre de la escuela..."
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
                            ) : escuelas.length === 0 ? (
                                <div className="p-6 text-center">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-[#a1887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                    <p className="text-sm font-bold text-[#2b1b17] mb-1">No se encontraron escuelas</p>
                                    <p className="text-xs text-[#8d6e3f]">No hay escuelas con el nombre "{searchTerm}"</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#e3dac9]">
                                    {escuelas.map((escuela) => (
                                        <button
                                            key={escuela.id}
                                            onClick={() => handleSelectEscuela(escuela)}
                                            className="w-full p-4 hover:bg-[#fbf8f1] transition-colors text-left flex items-center gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                                                🏫
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-playfair font-bold text-[#2b1b17] truncate">
                                                    {escuela.nombre}
                                                </h4>
                                                <p className="text-xs text-[#8d6e3f]">
                                                    {escuela.nivel}
                                                    {escuela.clave && ` • Clave: ${escuela.clave}`}
                                                </p>
                                                {escuela.direccion && (
                                                    <p className="text-xs text-[#a1887f] truncate">
                                                        📍 {escuela.direccion}
                                                    </p>
                                                )}
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