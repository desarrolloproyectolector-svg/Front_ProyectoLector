import api from '../../utils/api';
import { PreferenciasAlumno, EstadisticasAlumno } from '../../types/alumno/alumno';

export class AlumnoService {
    /**
     * Obtener preferencias del alumno
     * GET /alumno/preferencias
     */
    static async getPreferencias(): Promise<PreferenciasAlumno> {
        const response = await api.get('/alumno/preferencias');
        return response.data?.data ?? response.data;
    }

    /**
     * Actualizar preferencias del alumno
     * PATCH /alumno/preferencias
     */
    static async updatePreferencias(payload: Partial<PreferenciasAlumno>): Promise<PreferenciasAlumno> {
        const response = await api.patch('/alumno/preferencias', payload);
        return response.data?.data ?? response.data;
    }

    /**
     * Obtener estadísticas del alumno
     * GET /alumno/estadisticas
     */
    static async getEstadisticas(): Promise<EstadisticasAlumno> {
        const response = await api.get('/alumno/estadisticas');
        return response.data?.data ?? response.data;
    }
}
