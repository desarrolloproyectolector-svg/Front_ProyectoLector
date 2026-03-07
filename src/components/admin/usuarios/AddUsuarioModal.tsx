'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { UsuarioForm } from './UsuarioForm';
import { AlumnoService } from '../../../service/admin/usuarios/alumno.service';
import { ProfesorService } from '../../../service/admin/usuarios/profesor.service';
import { TutorService } from '../../../service/admin/usuarios/tutor.service';
import { DirectorService } from '../../../service/admin/usuarios/director.service';
import { toast } from '../../../utils/toast';

interface AddUsuarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddUsuarioModal: React.FC<AddUsuarioModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);

        try {
            const { role, ...userData } = data;

            // Llamar al servicio correspondiente según el rol
            switch (role) {
                case 'alumno':
                    await AlumnoService.create(userData);
                    break;
                case 'profesor':
                    await ProfesorService.create(userData);
                    break;
                case 'tutor':
                    await TutorService.create(userData);
                    break;
                case 'director':
                    await DirectorService.create(userData);
                    break;
                default:
                    throw new Error('Rol no válido');
            }

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error al crear usuario:', error);
            // 🛑 Extraer mensaje preciso de error
            const apiMessage = error.response?.data?.message || error.response?.data?.description;
            if (Array.isArray(apiMessage)) {
                toast.error(`Error en los datos: ${apiMessage.join(' | ')}`);
            } else if (typeof apiMessage === 'string') {
                toast.error(`Aviso: ${apiMessage}`);
            } else {
                toast.error('Ocurrió un error inesperado al registrar el usuario.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Registrar Nuevo Usuario"
            size="xl"
        >
            <UsuarioForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                isLoading={isLoading}
            />
        </Modal>
    );
};