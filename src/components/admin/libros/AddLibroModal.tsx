'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { LibroForm } from './LibroForm';
import { LibrosService } from '../../../service/libros.service';
import { CreateLibroDTO } from '../../../types/libros/libro';

interface AddLibroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    materias?: Array<{ id: number; nombre: string }>;
}

export const AddLibroModal: React.FC<AddLibroModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    materias = [],
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (data: CreateLibroDTO & { pdf: File }) => {
        try {
            setIsLoading(true);
            setError('');

            await LibrosService.uploadLibro(
                data.pdf,
                data.titulo,
                data.grado,
                data.materiaId,
                data.codigo,
                data.descripcion
            );

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error al cargar libro:', err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al cargar el libro. Por favor intenta de nuevo.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cargar nuevo libro">
            <div className="w-full max-w-2xl">
                <LibroForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    materias={materias}
                />
            </div>
        </Modal>
    );
};
