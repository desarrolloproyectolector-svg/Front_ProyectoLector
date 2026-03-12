// ============================================================
// SERVICE — Grupos del Director
// src/service/director/grupo.service.ts
// ============================================================

import api from '../../../utils/api';
import type {
    GrupoListItem,
    CreateGrupoDTO,
    UpdateGrupoDTO,
} from '../../../types/escuela/grupos/grupo';

export class GrupoService {
    /**
     * Lista todos los grupos de la escuela del director.
     * GET /director/grupos
     */
    static async getAll(): Promise<GrupoListItem[]> {
        try {
            const response = await api.get('/director/grupos');
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener grupos:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Crea un grupo en la escuela del director.
     * POST /director/grupos
     */
    static async create(data: CreateGrupoDTO): Promise<GrupoListItem> {
        try {
            const response = await api.post('/director/grupos', data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al crear grupo:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Actualiza un grupo de la escuela del director.
     * PATCH /director/grupos/:id
     */
    static async update(id: number, data: UpdateGrupoDTO): Promise<GrupoListItem> {
        try {
            const response = await api.patch(`/director/grupos/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al actualizar grupo:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Elimina un grupo de la escuela del director.
     * DELETE /director/grupos/:id
     */
    static async delete(id: number): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/director/grupos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al eliminar grupo:', error.response?.data || error);
            throw error;
        }
    }
}