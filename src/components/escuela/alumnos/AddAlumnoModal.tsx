'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { AlumnoForm } from './AlumnoForm';
import { alumnoService } from '../../../service/escuela/alumnos/alumno.service';
import { toast } from '../../../utils/toast';
import { AlumnoFormData } from '../../../types/escuela/alumnos/alumno.types';


interface AddAlumnoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddAlumnoModal: React.FC<AddAlumnoModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: AlumnoFormData) => {
        setIsLoading(true);
        
        try {
            // Preparar payload para la API
            const payload = {
                nombre: data.nombre.trim(),
                apellidoPaterno: data.apellidoPaterno.trim(),
                apellidoMaterno: data.apellidoMaterno.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
                ...(data.telefono && { telefono: data.telefono.trim() }),
                ...(data.fechaNacimiento && { fechaNacimiento: data.fechaNacimiento }),
                ...(data.grado && { grado: data.grado }),
                ...(data.grupo && { grupo: data.grupo }),
                ...(data.cicloEscolar && { cicloEscolar: data.cicloEscolar }),
            };

            console.log('📤 Enviando datos al backend:', payload);

            // Llamar al servicio
            const response = await alumnoService.registrarAlumno(payload);
            
            console.log('✅ Respuesta del backend:', response);

            // Mostrar notificación de éxito
            toast.success(
                `¡Alumno ${response.data.nombre} ${response.data.apellido} registrado exitosamente!`,
                5000
            );

            // Cerrar modal
            onClose();
            
            // Ejecutar callback de éxito (refrescar lista)
            onSuccess();

        } catch (error: any) {
            console.error('❌ Error al crear alumno:', error);
            
            // Mostrar notificación de error
            toast.error(
                error.message || 'Error al registrar el alumno. Por favor, intenta nuevamente.',
                6000
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Agregar Nuevo Alumno"
            size="lg"
        >
            <AlumnoForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isLoading={isLoading}
            />
        </Modal>
    );
};