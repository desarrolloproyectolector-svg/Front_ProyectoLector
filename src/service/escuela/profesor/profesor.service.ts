// service/escuela/profesores/profesor.service.ts

import api from '../../../utils/api';
import {
    RegistroProfesorPayload,
    RegistroProfesorResponse,
    ProfesoresResponse,
    EditProfesorPayload,
    EditProfesorResponse,
    DeleteProfesorResponse,
} from '../../../types/escuela/profesor/profesor.types';

class ProfesorService {

    // ========================================================================
    // REGISTRO (POST /personas/registro-maestro)
    // El director NO envía idEscuela — el backend la toma del token
    // ========================================================================

    async registrarProfesor(data: RegistroProfesorPayload): Promise<RegistroProfesorResponse> {
        try {
            const response = await api.post<RegistroProfesorResponse>(
                '/personas/registro-maestro',
                data
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.description;
                switch (status) {
                    case 400: throw new Error(message || 'Datos inválidos. Verifica la información ingresada.');
                    case 403: throw new Error('No tienes permisos para registrar profesores en esta escuela.');
                    case 404: throw new Error('La escuela no fue encontrada.');
                    case 409: throw new Error('El correo electrónico ya está registrado en el sistema.');
                    default:  throw new Error(message || 'Error al registrar el profesor.');
                }
            }
            throw new Error('Error de conexión. Verifica tu conexión a internet.');
        }
    }

    // ========================================================================
    // LISTADO (GET /escuelas/:id/maestros)
    // ========================================================================

    async obtenerProfesores(escuelaId: number): Promise<ProfesoresResponse> {
        try {
            const response = await api.get<ProfesoresResponse>(
                `/escuelas/${escuelaId}/maestros`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener profesores:', error);
            throw this.handleError(error, 'Error al cargar la lista de profesores.');
        }
    }

    // ========================================================================
    // EDICIÓN (PATCH /personas/maestros/:id)
    // :id = ID del maestro (tabla Maestro), NO el de persona
    // Admin: cualquier maestro | Director: solo de su escuela
    // ========================================================================

    async editarProfesor(
        maestroId: number,
        data: EditProfesorPayload
    ): Promise<EditProfesorResponse> {
        // ⚠️ Declarado FUERA del try para poder acceder en el catch
        const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '' && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {} as any);

        try {
            const response = await api.patch<EditProfesorResponse>(
                `/personas/maestros/${maestroId}`,
                cleanedData
            );
            return response.data;
        } catch (error: any) {
            // 👇 LOGS TEMPORALES — pega esto en el chat para identificar el problema
            console.error('❌ Status:', error.response?.status);
            console.error('❌ Response data:', JSON.stringify(error.response?.data, null, 2));
            console.error('❌ Payload enviado:', JSON.stringify(cleanedData, null, 2));

            if (error.response?.status === 404) throw new Error('Profesor no encontrado.');
            if (error.response?.status === 403) throw new Error('No tienes permisos para editar este profesor.');
            if (error.response?.status === 409) throw new Error('El correo electrónico ya está registrado en el sistema.');
            throw this.handleError(error, 'Error al actualizar el profesor.');
        }
    }

    // ========================================================================
    // ELIMINACIÓN (DELETE /personas/maestros/:id)
    // :id = ID del maestro (tabla Maestro), NO el de persona
    // Admin: cualquier maestro | Director: solo de su escuela
    // ========================================================================

    async eliminarProfesor(maestroId: number): Promise<DeleteProfesorResponse> {
        try {
            const response = await api.delete<DeleteProfesorResponse>(
                `/personas/maestros/${maestroId}`
            );
            return response.data;
        } catch (error: any) {
            console.error('Error al eliminar profesor:', error);
            if (error.response?.status === 404) throw new Error('Profesor no encontrado.');
            if (error.response?.status === 403) throw new Error('No tienes permisos para eliminar este profesor.');
            throw this.handleError(error, 'Error al eliminar el profesor.');
        }
    }

    // ========================================================================
    // MANEJO CENTRALIZADO DE ERRORES
    // ========================================================================

    private handleError(error: any, defaultMessage: string): Error {
        const apiMessage =
            error.response?.data?.message || error.response?.data?.description;
        if (apiMessage) return new Error(apiMessage);
        if (error.message) return new Error(error.message);
        return new Error(defaultMessage);
    }
}

export const profesorService = new ProfesorService();