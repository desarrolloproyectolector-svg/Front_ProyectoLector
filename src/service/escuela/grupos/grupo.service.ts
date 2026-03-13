// ============================================================
// SERVICE — Grupos del Director
// src/service/director/grupo.service.ts
// ============================================================

import api from '../../../utils/api';
import type {
    GrupoListItem,
    MaestroListItem,
    CreateGrupoDTO,
    UpdateGrupoDTO,
    AsignarGrupoDTO,
} from '../../../types/escuela/grupos/grupo';

export class GrupoService {

    // GET /director/grupos — incluye maestros[] en cada grupo
    static async getAll(): Promise<GrupoListItem[]> {
        try {
            const response = await api.get('/director/grupos');
            console.log('🔍 [GrupoService.getAll] Raw API Response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener grupos:', error.response?.data || error);
            throw error;
        }
    }

    // GET /director/maestros — para el selector de profesor
    static async getMaestros(): Promise<MaestroListItem[]> {
        try {
            const response = await api.get('/director/maestros');
            const raw: any[] = Array.isArray(response.data) ? response.data : response.data.data ?? [];

            // Normalizar: el backend puede devolver nombre plano o anidado en persona
            return raw.map((m: any) => ({
                id: m.id,
                personaId: m.personaId ?? m.persona?.id ?? m.id,
                nombre: m.nombre
                    ?? (m.persona
                        ? [m.persona.nombre, m.persona.apellidoPaterno, m.persona.apellidoMaterno]
                            .filter(Boolean).join(' ')
                        : null)
                    ?? m.correo
                    ?? 'Sin nombre',
                correo: m.correo ?? m.persona?.correo ?? '',
            }));
        } catch (error: any) {
            console.error('❌ Error al obtener maestros:', error.response?.data || error);
            throw error;
        }
    }

    // POST /director/grupos
    static async create(data: CreateGrupoDTO): Promise<GrupoListItem> {
        try {
            const response = await api.post('/director/grupos', data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al crear grupo:', error.response?.data || error);
            throw error;
        }
    }

    // PATCH /director/grupos/:id
    static async update(id: number, data: UpdateGrupoDTO): Promise<GrupoListItem> {
        try {
            const response = await api.patch(`/director/grupos/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al actualizar grupo:', error.response?.data || error);
            throw error;
        }
    }

    // DELETE /director/grupos/:id
    static async delete(id: number): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/director/grupos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al eliminar grupo:', error.response?.data || error);
            throw error;
        }
    }

    // POST /director/maestros/asignar-grupo
    static async asignarMaestro(data: AsignarGrupoDTO): Promise<void> {
        const payload = {
            maestroId: parseInt(String(data.maestroId), 10),
            grupoId: parseInt(String(data.grupoId), 10),
        };
        console.log('📤 asignarMaestro payload:', payload, typeof payload.maestroId, typeof payload.grupoId);
        try {
            await api.post('/director/maestros/asignar-grupo', payload);
        } catch (error: any) {
            console.error('❌ Error al asignar maestro:', error.response?.status, error.response?.data);
            throw error;
        }
    }

    // DELETE /director/maestros/desasignar-grupo/:maestroId/:grupoId
    static async desasignarMaestro(maestroId: number, grupoId: number): Promise<void> {
        try {
            await api.delete(`/director/maestros/desasignar-grupo/${maestroId}/${grupoId}`);
        } catch (error: any) {
            console.error('❌ Error al desasignar maestro:', error.response?.data || error);
            throw error;
        }
    }
}