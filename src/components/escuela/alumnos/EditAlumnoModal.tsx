'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { AlumnoFormEdit } from './AlumnoFormEdit';
import { alumnoService } from '../../../service/escuela/alumnos/alumno.service';
import { toast } from '@/utils/toast';
import { AlumnoEscuela, AlumnoEditFormData } from '../../../types/escuela/alumnos/alumno.types';

interface EditAlumnoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    alumno: AlumnoEscuela;
}

export const EditAlumnoModal: React.FC<EditAlumnoModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    alumno
}) => {
    const [isLoading, setIsLoading] = useState(false);

    // Preparar datos iniciales del formulario
    const initialData: AlumnoEditFormData = {
        nombre: alumno.persona.nombre,
        apellido: alumno.persona.apellido,
        correo: alumno.persona.correo,
        telefono: alumno.persona.telefono || '',
        fechaNacimiento: alumno.persona.fechaNacimiento || '',
        genero: alumno.persona.genero || '',
        password: '', // Siempre vacío al inicio
        grado: alumno.grado || undefined,
        grupo: alumno.grupo || '',
        cicloEscolar: alumno.cicloEscolar || ''
    };

    const handleSubmit = async (data: AlumnoEditFormData) => {
        setIsLoading(true);
        
        try {
            // Preparar payload para la API
            // Solo incluir campos que han sido modificados o que tienen valor
            const payload: any = {};

            // Campos básicos (siempre se envían si tienen valor)
            if (data.nombre.trim()) payload.nombre = data.nombre.trim();
            if (data.apellido.trim()) payload.apellido = data.apellido.trim();
            if (data.correo.trim()) payload.correo = data.correo.trim().toLowerCase();
            
            // Campos opcionales (solo si tienen valor)
            if (data.telefono && data.telefono.trim()) {
                payload.telefono = data.telefono.trim();
            }
            if (data.fechaNacimiento) {
                payload.fechaNacimiento = data.fechaNacimiento;
            }
            if (data.genero) {
                payload.genero = data.genero;
            }
            
            // Contraseña (solo si se ingresó una nueva)
            if (data.password && data.password.length > 0) {
                payload.password = data.password;
            }

            console.log('📤 Enviando actualización del alumno:', payload);

            // Llamar al servicio
            const response = await alumnoService.editarAlumno(alumno.id, payload);
            
            console.log('✅ Respuesta del backend:', response);

            // Mostrar notificación de éxito
            toast.success(
                `¡Alumno ${response.data.nombre} ${response.data.apellido} actualizado exitosamente!`,
                5000
            );

            // Cerrar modal
            onClose();
            
            // Ejecutar callback de éxito (refrescar lista)
            onSuccess();

        } catch (error: any) {
            console.error('❌ Error al editar alumno:', error);
            
            // Mostrar notificación de error
            toast.error(
                error.message || 'Error al actualizar el alumno. Por favor, intenta nuevamente.',
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
            title={`Editar Alumno: ${alumno.persona.nombre} ${alumno.persona.apellido}`}
            size="lg"
        >
            <AlumnoFormEdit
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isLoading={isLoading}
            />
        </Modal>
    );
};