import api from '../utils/api';
import { VincularAlumnoDTO, VincularAlumnoResponse, CodigoVinculacionResponse } from '../types/vinculacion/vinculacion.types';

export class VinculacionService {
    /**
     * Obtener el código de vinculación del alumno autenticado
     * GET /personas/alumnos/codigo-vinculacion
     */
    static async getMiCodigo(): Promise<CodigoVinculacionResponse> {
        try {
            // Intentamos obtener el ID y posiblemente el código desde el localStorage
            let alumnoId = null;
            if (typeof window !== 'undefined') {
                const userRaw = localStorage.getItem('user');
                if (userRaw) {
                    const user = JSON.parse(userRaw);
                    console.log('👤 Usuario actual en sesión:', user);
                    
                    // Verificamos si el código ya viene en el objeto de usuario (por si el backend lo incluye en el login/registro)
                    if (user.codigoVinculacion) {
                        console.log('✅ Código de vinculación encontrado en sesión local');
                        return {
                            message: 'OK',
                            description: 'Código recuperado de sesión',
                            data: {
                                codigo: user.codigoVinculacion,
                                expiraEn: '',
                                usado: false
                            }
                        };
                    }

                    // El ID puede estar en user.id o user.alumno.id
                    alumnoId = user.alumno?.id || user.id;
                }
            }

            if (!alumnoId) {
                throw new Error('No se pudo identificar la sesión del alumno');
            }

            // IMPORTANTE: El backend reporta que solo Admin/Director pueden acceder aquí.
            // Si el código NO está en el objeto 'user' de arriba, el backend DEBE permitir el rol Alumno en esta ruta.
            const response = await api.get<CodigoVinculacionResponse>(`/personas/alumnos/${alumnoId}/codigo-vinculacion`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error detallado al obtener código:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Vincular un alumno a un padre mediante código
     * POST /personas/padres/vincular-alumno
     */
    static async vincularConCodigo(data: VincularAlumnoDTO): Promise<VincularAlumnoResponse> {
        try {
            const response = await api.post<VincularAlumnoResponse>('/personas/padres/vincular-alumno', data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al vincular alumno:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener los alumnos vinculados al tutor autenticado
     * Se asume que el backend identifica al tutor por el token
     * GET /personas/padres/mis-alumnos
     */
    static async getMisAlumnos(): Promise<any> {
        try {
            // Intentamos obtener el ID del padre desde el localStorage
            let padreId = null;
            if (typeof window !== 'undefined') {
                const userRaw = localStorage.getItem('user');
                if (userRaw) {
                    const user = JSON.parse(userRaw);
                    padreId = user.id; // En el caso de padre, suele ser el ID directo de la persona/usuario
                    console.log('🆔 ID de tutor detectado:', padreId);
                }
            }

            // Si hay ID de padre, usamos el endpoint que ya existe en el sistema
            // Basado en TutorService.getAlumnos(id) que llama a /personas/padres/${id}/alumnos
            if (padreId) {
                const response = await api.get(`/personas/padres/${padreId}/alumnos`);
                return response.data;
            }

            // Fallback al endpoint genérico por si acaso
            const response = await api.get('/personas/padres/mis-alumnos');
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener alumnos vinculados:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Desvincular un alumno del tutor autenticado
     * POST /personas/padres/desvincular-alumno
     * { "alumnoId": 123 }
     */
    static async desvincular(alumnoId: number | string): Promise<any> {
        try {
            const response = await api.post('/personas/padres/desvincular-alumno', { alumnoId });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al desvincular alumno:', error.response?.data || error);
            throw error;
        }
    }
}
