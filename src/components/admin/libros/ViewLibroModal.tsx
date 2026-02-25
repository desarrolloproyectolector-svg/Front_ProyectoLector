'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { LibrosService } from '../../../service/libros.service';
import { LibroDetail, LibroEscuelaAcceso } from '../../../types/libros/libro';

interface ViewLibroModalProps {
    isOpen: boolean;
    onClose: () => void;
    libroId: number | null;
}

export const ViewLibroModal: React.FC<ViewLibroModalProps> = ({
    isOpen,
    onClose,
    libroId,
}) => {
    const [libro, setLibro] = useState<LibroDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [expandedUnitId, setExpandedUnitId] = useState<number | null>(null);
    const [escuelas, setEscuelas] = useState<LibroEscuelaAcceso[]>([]);
    const [isLoadingEscuelas, setIsLoadingEscuelas] = useState(false);
    const [errorEscuelas, setErrorEscuelas] = useState<string>('');
    const [procesandoEscuelaId, setProcesandoEscuelaId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && libroId) {
            loadLibro();
            loadEscuelas();
        }
    }, [isOpen, libroId]);

    const loadLibro = async () => {
        if (!libroId) return;

        try {
            setIsLoading(true);
            setError('');
            const response = await LibrosService.getById(libroId);
            setLibro(response.data);
        } catch (err: any) {
            console.error('Error al cargar detalle del libro:', err);
            setError('Error al cargar el detalle del libro');
        } finally {
            setIsLoading(false);
        }
    };

    const loadEscuelas = async () => {
        if (!libroId) return;

        try {
            setIsLoadingEscuelas(true);
            setErrorEscuelas('');
            const response = await LibrosService.getEscuelasByLibro(libroId);
            setEscuelas(response.data || []);
        } catch (err: any) {
            console.error('Error al cargar escuelas del libro:', err);
            setErrorEscuelas('Error al cargar las escuelas del libro');
        } finally {
            setIsLoadingEscuelas(false);
        }
    };

    const handleToggleAcceso = async (escuelaId: number, activoActual: boolean) => {
        if (!libroId) return;

        const nuevoActivo = !activoActual;

        try {
            setProcesandoEscuelaId(escuelaId);
            await LibrosService.toggleLibroEnEscuelaDesdeLibro(libroId, escuelaId, nuevoActivo);

            setEscuelas(prev =>
                prev.map(e =>
                    e.escuelaId === escuelaId ? { ...e, activoEnEscuela: nuevoActivo } : e
                )
            );
        } catch (err: any) {
            console.error('Error al cambiar acceso:', err);
            setErrorEscuelas(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al cambiar el acceso'
            );
        } finally {
            setProcesandoEscuelaId(null);
        }
    };

    if (!libro && !isLoading) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalle del libro">
            <div className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                ) : libro ? (
                    <div className="space-y-6">
                        {/* Información básica */}
                        <div>
                            <h2 className="font-playfair text-2xl font-bold text-[#2b1b17] mb-4">{libro.titulo}</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-[#fbf8f1] p-3 rounded-lg border border-[#d4af37]">
                                    <p className="text-xs text-[#8d6e3f] font-semibold">Código</p>
                                    <p className="text-sm font-mono text-[#2b1b17] mt-1">{libro.codigo}</p>
                                </div>
                                <div className="bg-[#fbf8f1] p-3 rounded-lg border border-[#d4af37]">
                                    <p className="text-xs text-[#8d6e3f] font-semibold">Grado</p>
                                    <p className="text-sm text-[#2b1b17] mt-1">{libro.grado}°</p>
                                </div>
                                <div className="bg-[#fbf8f1] p-3 rounded-lg border border-[#d4af37]">
                                    <p className="text-xs text-[#8d6e3f] font-semibold">Páginas</p>
                                    <p className="text-sm text-[#2b1b17] mt-1">{libro.numPaginas}</p>
                                </div>
                                <div className="bg-[#fbf8f1] p-3 rounded-lg border border-[#d4af37]">
                                    <p className="text-xs text-[#8d6e3f] font-semibold">Estado</p>
                                    <p className="text-sm text-[#2b1b17] mt-1">
                                        {libro.estado === 'listo' && (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                                                Listo
                                            </span>
                                        )}
                                        {libro.estado === 'procesando' && (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                                                Procesando
                                            </span>
                                        )}
                                        {libro.estado === 'error' && (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                                                Error
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {libro.materia && (
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-[#8d6e3f]">Materia:</p>
                                    <p className="text-sm text-[#2b1b17] mt-1">{libro.materia.nombre}</p>
                                </div>
                            )}

                            {libro.descripcion && (
                                <div>
                                    <p className="text-sm font-semibold text-[#8d6e3f]">Descripción:</p>
                                    <p className="text-sm text-[#5d4037] mt-1">{libro.descripcion}</p>
                                </div>
                            )}
                        </div>

                        {/* Unidades y segmentos */}
                        {libro.unidades && libro.unidades.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-[#2b1b17] mb-3">Contenido ({libro.unidades.length} unidades)</h3>
                                <div className="space-y-2">
                                    {libro.unidades.map(unidad => (
                                        <div key={unidad.id} className="border border-[#e3dac9] rounded-lg overflow-hidden">
                                            <button
                                                onClick={() =>
                                                    setExpandedUnitId(expandedUnitId === unidad.id ? null : unidad.id)
                                                }
                                                className="w-full px-4 py-3 bg-[#f9f7f4] hover:bg-[#f0e6d2] transition-colors flex items-center justify-between"
                                            >
                                                <span className="font-semibold text-[#2b1b17] text-left">
                                                    Unidad {unidad.orden}: {unidad.nombre}
                                                </span>
                                                <span className="text-xs text-[#8d6e3f] bg-white px-2 py-1 rounded">
                                                    {unidad.segmentos.length} segmentos
                                                </span>
                                                <svg
                                                    className={`w-5 h-5 text-[#8d6e3f] transition-transform ${
                                                        expandedUnitId === unidad.id ? 'rotate-180' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                    />
                                                </svg>
                                            </button>

                                            {expandedUnitId === unidad.id && (
                                                <div className="bg-white border-t border-[#e3dac9] divide-y divide-[#e3dac9]">
                                                    {unidad.segmentos.map(segmento => (
                                                        <div key={segmento.id} className="p-4">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <p className="text-xs font-semibold text-[#8d6e3f] text-uppercase">
                                                                    Segmento {segmento.orden} · Página {segmento.numeroPagina}
                                                                </p>
                                                                {segmento.preguntas && (
                                                                    <span className="text-xs text-[#d4af37] bg-[#fbf8f1] px-2 py-1 rounded">
                                                                        {Object.values(segmento.preguntas).flat().length} preguntas
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-[#5d4037] line-clamp-3">
                                                                {segmento.contenido} </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Escuelas con acceso */}
                        <div>
                            <h3 className="font-semibold text-[#2b1b17] mb-3">Escuelas con este libro</h3>
                            {errorEscuelas && (
                                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{errorEscuelas}</p>
                                </div>
                            )}

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {isLoadingEscuelas ? (
                                    <div className="flex items-center justify-center py-6">
                                        <svg className="animate-spin h-6 w-6 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                ) : escuelas.length === 0 ? (
                                    <p className="text-center text-[#8d6e3f] py-6">No hay escuelas con este libro</p>
                                ) : (
                                    escuelas.map(escuela => (
                                        <div
                                            key={escuela.escuelaId}
                                            className="flex items-center justify-between p-4 border border-[#e3dac9] rounded-lg hover:bg-[#f9f7f4] transition-colors"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-[#2b1b17]">{escuela.nombreEscuela}</p>
                                                <p className="text-sm text-[#8d6e3f] mt-1">
                                                    {(escuela.ciudad || '—')} • {(escuela.estadoRegion || '—')}
                                                </p>
                                                <div className="mt-2">
                                                    {escuela.activoEnEscuela ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleToggleAcceso(escuela.escuelaId, escuela.activoEnEscuela)}
                                                disabled={procesandoEscuelaId === escuela.escuelaId}
                                                className={`px-4 py-2 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2 ${
                                                    escuela.activoEnEscuela
                                                        ? 'bg-red-500 hover:bg-red-600'
                                                        : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                            >
                                                {procesandoEscuelaId === escuela.escuelaId && (
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                )}
                                                {escuela.activoEnEscuela ? 'Quitar acceso' : 'Dar acceso'}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#d4af37] hover:bg-[#b8941e] text-[#2b1b17] font-semibold rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};
