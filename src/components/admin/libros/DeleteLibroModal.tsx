'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { LibrosService } from '../../../service/libros.service';
import { Libro } from '../../../types/libros/libro';

interface DeleteLibroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    libro: Libro | null;
}

export const DeleteLibroModal: React.FC<DeleteLibroModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    libro,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleDelete = async () => {
        if (!libro) return;

        try {
            setIsLoading(true);
            setError('');

            await LibrosService.deleteLibro(libro.id);

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error al eliminar libro:', err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al eliminar el libro.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!libro) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar eliminación">
            <div className="w-full max-w-md">
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">
                        <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        ¿Estás seguro de que quieres eliminar este libro?
                    </p>
                </div>

                <div className="mb-4 p-3 bg-[#fbf8f1] rounded-lg border border-[#d4af37]">
                    <p className="text-sm font-semibold text-[#2b1b17]">{libro.titulo}</p>
                    <p className="text-xs text-[#8d6e3f] mt-1">Código: {libro.codigo}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <p className="text-sm text-[#5d4037] mb-6">
                    Se eliminará el libro, sus asignaciones a escuelas, el PDF y todos sus contenidos (unidades, segmentos, preguntas). <strong>Esta acción no se puede deshacer.</strong>
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-[#d4af37] text-[#2b1b17] font-semibold rounded-lg hover:bg-[#fbf8f1] disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar libro'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
