'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { EscuelaForm } from './EscuelaForm';
import { EscuelaService } from '../../../service/escuela.service';
import type { CreateEscuelaDTO } from '../../../types/admin/escuelas/escuela';

interface AddEscuelaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddEscuelaModal: React.FC<AddEscuelaModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: CreateEscuelaDTO) => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('📋 Datos del formulario:', data);
            
            const response = await EscuelaService.create(data);
            
            console.log('✅ Escuela creada exitosamente:', response);
            
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('❌ Error al crear escuela:', error);
            
            // Manejar errores de validación de la API
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).join(', ');
                setError(`Error de validación: ${errorMessages}`);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Error al crear la escuela. Por favor, intenta de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Registrar Nueva Escuela"
            size="xl"
        >
            {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h4 className="font-bold text-red-900 mb-1">Error</h4>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <EscuelaForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                isLoading={isLoading}
            />
        </Modal>
    );
};