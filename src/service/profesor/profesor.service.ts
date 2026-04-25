import api from '../../utils/api';
import { GrupoProfesor, AlumnoGrupo } from '../../types/profesor/profesor';

export class ProfesorService {
    /**
     * Obtener grupos asignados al profesor
     * GET /profesor/grupos
     */
    static async getGrupos(): Promise<GrupoProfesor[]> {
        const response = await api.get('/profesor/grupos');
        return response.data?.data ?? response.data;
    }

    /**
     * Obtener alumnos de un grupo específico
     * GET /profesor/grupos/:grupoId/alumnos
     */
    static async getAlumnos(grupoId: string | number): Promise<AlumnoGrupo[]> {
        const response = await api.get(`/profesor/grupos/${grupoId}/alumnos`);
        return response.data?.data ?? response.data;
    }
}
