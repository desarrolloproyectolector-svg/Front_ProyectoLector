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

/**
 * SERVICIO CONSOLIDADO PARA GESTIÓN DE ALUMNOS
 * Maneja: Registro, Listado, Edición y Eliminación
 * 
 * Todas las rutas usan el token del director que contiene el idEscuela
 */
class AlumnoService {

    // ========================================================================
    // REGISTRO DE ALUMNO
    // ========================================================================

    /**
     * Registrar un nuevo alumno en la escuela del director
     * POST /personas/registro-alumno
     * 
     * El idEscuela se obtiene automáticamente del token del director
     */
    async registrarAlumno(data: RegistroAlumnoPayload): Promise<RegistroAlumnoResponse> {
        try {
            const response = await api.post<RegistroAlumnoResponse>(
                '/personas/registro-alumno',
                data
            );
            return response.data;
        } catch (error: any) {
            // Manejar errores específicos de la API
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.description;

                switch (status) {
                    case 403:
                        throw new Error('No tienes permisos para realizar esta acción');
                    case 409:
                        throw new Error('El correo electrónico ya está registrado en el sistema');
                    case 400:
                        throw new Error(message || 'Datos inválidos. Verifica la información ingresada');
                    default:
                        throw new Error(message || 'Error al registrar el alumno');
                }
            }

            // Error de red u otro tipo
            throw new Error('Error de conexión. Verifica tu conexión a internet');
        }
    }

    // ========================================================================
    // LISTADO DE ALUMNOS
    // ========================================================================

    /**
     * Obtener todos los alumnos de la escuela del director
     * GET /director/alumnos
     */
    async obtenerAlumnos(): Promise<AlumnosResponse> {
        try {
            const response = await api.get<AlumnosResponse>('/director/alumnos');
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener alumnos:', error);
            throw this.handleError(error, 'Error al cargar la lista de alumnos');
        }
    }

    /**
     * Obtener un alumno específico por ID
     * GET /personas/alumnos/:id
     */
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

    /**
     * Editar un alumno
     * PATCH /personas/alumnos/:id
     * 
     * @param id - ID del alumno (registro alumno, no persona)
     * @param data - Campos a actualizar (todos opcionales)
     */
    async editarAlumno(id: number, data: EditAlumnoPayload): Promise<EditAlumnoResponse> {
        try {
            // Limpiar campos vacíos/undefined antes de enviar
            const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== '' && value !== null) {
                    acc[key] = value;
                }
                return acc;
            }, {} as any);

            const response = await api.patch<EditAlumnoResponse>(
                `/personas/alumnos/${id}`,
                cleanedData
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al editar alumno:', error);

            // Manejo de errores específicos
            if (error.response?.status === 409) {
                throw new Error('El correo electrónico ya está registrado en el sistema');
            }
            if (error.response?.status === 404) {
                throw new Error('Alumno no encontrado');
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para editar este alumno');
            }

            throw this.handleError(error, 'Error al actualizar el alumno');
        }
    }

    // ========================================================================
    // ELIMINACIÓN DE ALUMNO
    // ========================================================================

    /**
     * Eliminar un alumno
     * DELETE /personas/alumnos/:id
     * 
     * @param id - ID del alumno (registro alumno, no persona)
     */
    async eliminarAlumno(id: number): Promise<DeleteAlumnoResponse> {
        try {
            const response = await api.delete<DeleteAlumnoResponse>(`/personas/alumnos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al eliminar alumno:', error);

            // Manejo de errores específicos
            if (error.response?.status === 404) {
                throw new Error('Alumno no encontrado');
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para eliminar este alumno');
            }

            throw this.handleError(error, 'Error al eliminar el alumno');
        }
    }

    // ========================================================================
    // MANEJO CENTRALIZADO DE ERRORES
    // ========================================================================

    /**
     * Manejo centralizado de errores
     */
    private handleError(error: any, defaultMessage: string): Error {
        const apiMessage = error.response?.data?.message || error.response?.data?.description;

        if (apiMessage) {
            return new Error(apiMessage);
        }

        if (error.message) {
            return new Error(error.message);
        }

        return new Error(defaultMessage);
    }
}

// Exportar instancia única del servicio
export const alumnoService = new AlumnoService();