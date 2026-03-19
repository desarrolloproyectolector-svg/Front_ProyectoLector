import api from '../utils/api';
import { 
    CanjearLicenciaDto, 
    CrearLicenciasDto, 
    FiltrosLicencia, 
    Licencia, 
    LicenciaTotales 
} from '../types/licencias';

export class LicenciaService {
    /**
     * Generar licencias (Admin)
     * POST /licencias/generar
     */
    static async generarLicencias(dto: CrearLicenciasDto) {
        const response = await api.post('/licencias/generar', dto);
        return response.data;
    }

    /**
     * Listar licencias con filtros (Admin)
     * GET /licencias
     */
    static async listLicencias(filtros?: FiltrosLicencia) {
        const response = await api.get('/licencias', { params: filtros });
        return response.data;
    }

    /**
     * Listar licencias por escuela (Admin/Director)
     * GET /licencias/escuela/:id
     */
    static async listLicenciasEscuela(escuelaId: number, filtros?: FiltrosLicencia) {
        const response = await api.get(`/licencias/escuela/${escuelaId}`, { params: filtros });
        return response.data;
    }

    /**
     * Totales por escuela y desglose por libro (Admin/Director)
     * GET /licencias/escuela/:id/totales
     */
    static async getTotalesEscuela(escuelaId: number): Promise<{ message: string; data: LicenciaTotales }> {
        const response = await api.get(`/licencias/escuela/${escuelaId}/totales`);
        return response.data;
    }

    /**
     * Exportar licencias a PDF (Admin)
     * GET /licencias/exportar-pdf
     */
    static async exportarPDF(params: { escuelaId: number; libroId?: number; estado?: string }) {
        const response = await api.get('/licencias/exportar-pdf', {
            params,
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Canjear licencia (Alumno)
     * POST /licencias/canjear
     */
    static async canjearLicencia(dto: CanjearLicenciaDto): Promise<{ message: string; description: string; data: { libroId: number; titulo: string; alumnoId: number } }> {
        const response = await api.post('/licencias/canjear', dto);
        return response.data;
    }

    /**
     * Activar/desactivar licencia (Admin)
     * PATCH /licencias/:id/activa
     */
    static async toggleActiva(id: number, activa: boolean) {
        const response = await api.patch(`/licencias/${id}/activa`, { activa });
        return response.data;
    }
}
