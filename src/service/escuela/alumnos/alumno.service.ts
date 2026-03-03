// services/escuela/alumnos/alumno.service.ts

import api from '../../../utils/api';
import {
    RegistroAlumnoPayload,
    RegistroAlumnoResponse,
    AlumnosResponse,
    AlumnoEscuela,
    EditAlumnoPayload,
    EditAlumnoResponse,
    DeleteAlumnoResponse
} from '../../../types/escuela/alumnos/alumno.types';

class AlumnoService {

    // ========================================================================
    // REGISTRO DE ALUMNO
    // ========================================================================

    async registrarAlumno(data: RegistroAlumnoPayload): Promise<RegistroAlumnoResponse> {
        try {
            const response = await api.post<RegistroAlumnoResponse>(
                '/personas/registro-alumno',
                data
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.description;
                switch (status) {
                    case 403: throw new Error('No tienes permisos para realizar esta acción');
                    case 409: throw new Error('El correo electrónico ya está registrado en el sistema');
                    case 400: throw new Error(message || 'Datos inválidos. Verifica la información ingresada');
                    default:  throw new Error(message || 'Error al registrar el alumno');
                }
            }
            throw new Error('Error de conexión. Verifica tu conexión a internet');
        }
    }

    // ========================================================================
    // LISTADO DE ALUMNOS
    // ========================================================================

    async obtenerAlumnos(): Promise<AlumnosResponse> {
        try {
            const response = await api.get<AlumnosResponse>('/director/alumnos');
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener alumnos:', error);
            throw this.handleError(error, 'Error al cargar la lista de alumnos');
        }
    }

    async obtenerAlumnoPorId(id: number): Promise<AlumnoEscuela> {
        try {
            const response = await api.get<{ data: AlumnoEscuela }>(`/personas/alumnos/${id}`);
            return response.data.data;
        } catch (error: any) {
            console.error('Error al obtener alumno:', error);
            throw this.handleError(error, 'Error al cargar los datos del alumno');
        }
    }

    // ========================================================================
    // EDICIÓN DE ALUMNO
    // ========================================================================

    async editarAlumno(id: number, data: EditAlumnoPayload): Promise<EditAlumnoResponse> {
        try {
            // ✅ FIX: Solo eliminar `undefined` — null es válido (ej: apellidoMaterno: null)
            // y string vacío también se filtra porque no tiene sentido enviarlo
            const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as any);

            console.log('📤 Payload enviado a PATCH /personas/alumnos/' + id + ':', JSON.stringify(cleanedData, null, 2));

            const response = await api.patch<EditAlumnoResponse>(
                `/personas/alumnos/${id}`,
                cleanedData
            );
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al editar alumno:', error.response?.data || error);

            if (error.response?.status === 409) throw new Error('El correo electrónico ya está registrado en el sistema');
            if (error.response?.status === 404) throw new Error('Alumno no encontrado');
            if (error.response?.status === 403) throw new Error('No tienes permisos para editar este alumno');
            if (error.response?.status === 400) {
                const msg = error.response?.data?.message || error.response?.data?.description;
                throw new Error(msg || 'Datos inválidos. Verifica la información ingresada');
            }

            throw this.handleError(error, 'Error al actualizar el alumno');
        }
    }

    // ========================================================================
    // ELIMINACIÓN DE ALUMNO
    // ========================================================================

    async eliminarAlumno(id: number): Promise<DeleteAlumnoResponse> {
        try {
            const response = await api.delete<DeleteAlumnoResponse>(`/personas/alumnos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al eliminar alumno:', error);
            if (error.response?.status === 404) throw new Error('Alumno no encontrado');
            if (error.response?.status === 403) throw new Error('No tienes permisos para eliminar este alumno');
            throw this.handleError(error, 'Error al eliminar el alumno');
        }
    }

    // ========================================================================
    // MANEJO CENTRALIZADO DE ERRORES
    // ========================================================================

    private handleError(error: any, defaultMessage: string): Error {
        const apiMessage = error.response?.data?.message || error.response?.data?.description;
        if (apiMessage) return new Error(apiMessage);
        if (error.message) return new Error(error.message);
        return new Error(defaultMessage);
    }
}

export const alumnoService = new AlumnoService();