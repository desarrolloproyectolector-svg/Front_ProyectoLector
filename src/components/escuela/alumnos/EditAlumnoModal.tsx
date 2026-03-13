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

    const initialData: AlumnoEditFormData = {
        nombre:          alumno.persona.nombre,
        apellidoPaterno: alumno.persona.apellidoPaterno,
        apellidoMaterno: alumno.persona.apellidoMaterno ?? '',
        correo:          alumno.persona.correo,
        telefono:        alumno.persona.telefono        ?? '',
        fechaNacimiento: alumno.persona.fechaNacimiento ?? '',
        genero:          alumno.persona.genero          ?? '',
        password:        '',
        grado:           alumno.grado                  ?? undefined,
        grupo:           alumno.grupo                  ?? '',
        grupoId:         alumno.grupoId                ?? null,
        cicloEscolar:    alumno.cicloEscolar            ?? '',
    };

    const handleSubmit = async (data: AlumnoEditFormData) => {
        setIsLoading(true);
        try {
            // ✅ El endpoint PATCH /personas/alumnos/:id SOLO acepta datos de persona.
            // grado, grupo y cicloEscolar NO deben enviarse — el backend retorna 400.
            const payload: any = {
                nombre:          data.nombre.trim(),
                apellidoPaterno: data.apellidoPaterno.trim(),
                apellidoMaterno: data.apellidoMaterno?.trim() || null,
                correo:          data.correo.trim().toLowerCase(),
            };

            if (data.telefono?.trim())        payload.telefono        = data.telefono.trim();
            if (data.fechaNacimiento?.trim()) payload.fechaNacimiento = data.fechaNacimiento.trim();
            if (data.genero?.trim())          payload.genero          = data.genero.trim();
            if (data.password?.trim().length) payload.password        = data.password.trim();
            if (data.grupoId !== undefined)   payload.grupoId         = data.grupoId;

            const response = await alumnoService.editarAlumno(alumno.id, payload);

            toast.success(
                `¡Alumno ${response.data.nombre} ${response.data.apellidoPaterno} actualizado exitosamente!`,
                5000
            );

            onClose();
            onSuccess();
        } catch (error: any) {
            toast.error(
                error.message || 'Error al actualizar el alumno. Por favor, intenta nuevamente.',
                6000
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) onClose();
    };

    const nombreCompleto = `${alumno.persona.nombre} ${alumno.persona.apellidoPaterno}`.trim();

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Editar Alumno: ${nombreCompleto}`}
            size="lg"
        >
            <AlumnoFormEdit
                key={alumno.id}
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isLoading={isLoading}
            />
        </Modal>
    );
};