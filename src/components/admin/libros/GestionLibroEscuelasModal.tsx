'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { LibrosService } from '../../../service/libros.service';
import { Libro, LibroEscuelaAcceso } from '../../../types/libros/libro';

interface GestionLibroEscuelasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    libro: Libro | null;
}

export const GestionLibroEscuelasModal: React.FC<GestionLibroEscuelasModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    libro,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEscuelas, setIsLoadingEscuelas] = useState(false);
    const [error, setError] = useState<string>('');
    const [escuelas, setEscuelas] = useState<LibroEscuelaAcceso[]>([]);
    const [procesandoEscuelaId, setProcesandoEscuelaId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && libro) {
            loadEscuelas();
            setError('');
        }
    }, [isOpen, libro?.id]);

    const loadEscuelas = async () => {
        if (!libro) return;

        try {
            setIsLoadingEscuelas(true);
            const response = await LibrosService.getEscuelasByLibro(libro.id);
            setEscuelas(response.data || []);
        } catch (err) {
            console.error('Error al cargar escuelas del libro:', err);
            setError('Error al cargar las escuelas del libro');
        } finally {
            setIsLoadingEscuelas(false);
        }
    };

    const handleToggleAcceso = async (escuelaId: number, activoActual: boolean) => {
        if (!libro) return;

        const nuevoActivo = !activoActual;

        try {
            setProcesandoEscuelaId(escuelaId);
            setIsLoading(true);
            setError('');

            await LibrosService.toggleLibroEnEscuelaDesdeLibro(libro.id, escuelaId, nuevoActivo);

            setEscuelas(prev =>
                prev.map(e =>
                    e.escuelaId === escuelaId ? { ...e, activoEnEscuela: nuevoActivo } : e
                )
            );
        } catch (err: any) {
            console.error('Error al actualizar acceso:', err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al cambiar el acceso.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
            setProcesandoEscuelaId(null);
        }
    };

    if (!libro) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gestionar acceso en escuelas">
            <div className="w-full max-w-2xl">
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-semibold">
                        📚 {libro.titulo}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                        Código: <span className="font-mono">{libro.codigo}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {isLoadingEscuelas ? (
                        <div className="flex items-center justify-center py-8">
                            <svg className="animate-spin h-6 w-6 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : escuelas.length === 0 ? (
                        <p className="text-center text-[#8d6e3f] py-8">No hay escuelas asignadas a este libro</p>
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
                                    <div className="mt-2 flex items-center gap-2">
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

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleAcceso(escuela.escuelaId, escuela.activoEnEscuela)}
                                        disabled={isLoading || procesandoEscuelaId === escuela.escuelaId}
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
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-[#d4af37] text-[#2b1b17] font-semibold rounded-lg hover:bg-[#fbf8f1] disabled:opacity-50 transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={() => {
                            onSuccess();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-[#d4af37] hover:bg-[#b8941e] text-[#2b1b17] font-semibold rounded-lg transition-colors"
                    >
                        Hecho
                    </button>
                </div>
            </div>
        </Modal>
    );
};
