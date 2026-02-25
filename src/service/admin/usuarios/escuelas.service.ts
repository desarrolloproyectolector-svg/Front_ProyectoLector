import api from '../../../utils/api';

export interface Escuela {
    id: number;
    nombre: string;
    nivel: string;
    clave: string;
    direccion: string;
    telefono: string;
}

export interface EscuelasResponse {
    message: string;
    description: string;
    total: number;
    data: Escuela[];
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class EscuelasService {
    /**
     * Obtener todas las escuelas (Admin)
     * GET /escuelas
     */
    static async getAll(page: number = 1, limit: number = 100): Promise<EscuelasResponse> {
        try {
            const response = await api.get('/escuelas', {
                params: { page, limit },
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener escuelas:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener una escuela por ID
     * GET /escuelas/:id
     */
    static async getById(id: number): Promise<any> {
        try {
            const response = await api.get(`/escuelas/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener escuela:', error.response?.data || error);
            throw error;
        }
    }
}
