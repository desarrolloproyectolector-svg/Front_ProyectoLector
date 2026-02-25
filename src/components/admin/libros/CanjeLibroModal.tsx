'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { LibrosService } from '../../../service/libros.service';
import { EscuelasService, Escuela } from '../../../service/admin/usuarios/escuelas.service';
import { LibroEscuela } from '../../../types/libros/libro';

interface CanjeLibroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    libro: LibroEscuela | null;
}

export const CanjeLibroModal: React.FC<CanjeLibroModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    libro,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEscuelas, setIsLoadingEscuelas] = useState(false);
    const [error, setError] = useState<string>('');
    const [escuelas, setEscuelas] = useState<Escuela[]>([]);
    const [selectedEscuelaId, setSelectedEscuelaId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadEscuelas();
            setSelectedEscuelaId(null);
            setError('');
        }
    }, [isOpen]);

    const loadEscuelas = async () => {
        try {
            setIsLoadingEscuelas(true);
            const response = await EscuelasService.getAll(1, 100);
            setEscuelas(response.data);
        } catch (err) {
            console.error('Error al cargar escuelas:', err);
            setError('Error al cargar las escuelas');
        } finally {
            setIsLoadingEscuelas(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!libro) return;

        if (!selectedEscuelaId) {
            setError('Por favor selecciona una escuela');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            await LibrosService.canjeLibroEnEscuela(selectedEscuelaId, libro.codigo);

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error al canjear libro:', err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al canjear el libro.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!libro) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Canjear libro">
            <div className="w-full max-w-md">
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                        <strong>Libro:</strong> {libro.titulo}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                        <strong>Código:</strong> {libro.codigo}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#2b1b17] mb-2">
                            Selecciona una escuela <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedEscuelaId || ''}
                            onChange={e => setSelectedEscuelaId(Number(e.target.value))}
                            disabled={isLoading || isLoadingEscuelas}
                            className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] disabled:opacity-50"
                        >
                            <option value="">
                                {isLoadingEscuelas ? 'Cargando escuelas...' : '-- Selecciona una escuela --'}
                            </option>
                            {escuelas.map(escuela => (
                                <option key={escuela.id} value={escuela.id}>
                                    {escuela.nombre} ({escuela.nivel})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedEscuelaId && (
                        <div className="p-3 bg-[#fbf8f1] rounded-lg border border-[#d4af37] text-sm">
                            <p className="text-[#2b1b17]">
                                {escuelas.find(e => e.id === selectedEscuelaId)?.nombre}
                            </p>
                            <p className="text-[#8d6e3f] text-xs mt-1">
                                {escuelas.find(e => e.id === selectedEscuelaId)?.direccion}
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-[#5d4037]">
                        Al canjear este libro, se activará en la escuela y los alumnos podrán acceder a su contenido.
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-[#d4af37] text-[#2b1b17] font-semibold rounded-lg hover:bg-[#fbf8f1] disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !selectedEscuelaId || isLoadingEscuelas}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Canjeando...
                                </>
                            ) : (
                                'Canjear libro'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
