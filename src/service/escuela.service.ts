// ============================================================
// SERVICE — Escuelas
// src/service/escuela.service.ts
// ============================================================

import api from '../utils/api';
import type {
    CreateEscuelaDTO,
    UpdateEscuelaDTO,
    EscuelasListResponse,
    EscuelaDetalleResponse,
    EscuelaStatsResponse,
    EscuelaBusquedaResponse,
} from '../types/admin/escuelas/escuela';

export class EscuelaService {

    // ── Estadísticas (tarjetas superiores) ──────────────────
    /**
     * GET /escuelas/stats
     */
    static async getStats(): Promise<EscuelaStatsResponse> {
        try {
            const response = await api.get('/escuelas/stats');
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener estadísticas:', error.response?.data || error);
            throw error;
        }
    }

    // ── Listar escuelas ──────────────────────────────────────
    /**
     * GET /escuelas?page=&limit=
     * ⚠️ El backend solo acepta page y limit.
     * El filtrado por search y estado se hace en el cliente (page.tsx).
     */
    static async getAll(page: number = 1, limit: number = 100): Promise<EscuelasListResponse> {
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

    // ── Ver detalle de una escuela ───────────────────────────
    /**
     * GET /escuelas/:id
     */
    static async getById(id: number): Promise<EscuelaDetalleResponse> {
        try {
            const response = await api.get(`/escuelas/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener escuela:', error.response?.data || error);
            throw error;
        }
    }

    // ── Crear escuela ────────────────────────────────────────
    /**
     * POST /escuelas
     */
    static async create(data: CreateEscuelaDTO): Promise<any> {
        try {
            const payload: Record<string, any> = {
                nombre: data.nombre.trim(),
                nivel:  data.nivel.trim(),
            };

            if (data.clave?.trim())        payload.clave        = data.clave.trim();
            if (data.direccion?.trim())    payload.direccion    = data.direccion.trim();
            if (data.telefono?.trim())     payload.telefono     = data.telefono.trim();
            if (data.ciudad?.trim())       payload.ciudad       = data.ciudad.trim();
            if (data.estadoRegion?.trim()) payload.estadoRegion = data.estadoRegion.trim();
            if (data.estado)               payload.estado       = data.estado;

            const response = await api.post('/escuelas', payload);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al crear escuela:', error.response?.data || error);
            throw error;
        }
    }

    // ── Actualizar escuela ───────────────────────────────────
    /**
     * PUT /escuelas/:id
     */
    static async update(id: number, data: UpdateEscuelaDTO): Promise<any> {
        try {
            const payload: Record<string, any> = {};

            if (data.nombre?.trim())       payload.nombre       = data.nombre.trim();
            if (data.nivel?.trim())        payload.nivel        = data.nivel.trim();
            if (data.clave?.trim())        payload.clave        = data.clave.trim();
            if (data.direccion?.trim())    payload.direccion    = data.direccion.trim();
            if (data.telefono?.trim())     payload.telefono     = data.telefono.trim();
            if (data.ciudad?.trim())       payload.ciudad       = data.ciudad.trim();
            if (data.estadoRegion?.trim()) payload.estadoRegion = data.estadoRegion.trim();
            if (data.estado)               payload.estado       = data.estado;

            const response = await api.put(`/escuelas/${id}`, payload);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al actualizar escuela:', error.response?.data || error);
            throw error;
        }
    }

    // ── Eliminar escuela ─────────────────────────────────────
    /**
     * DELETE /escuelas/:id
     */
    static async delete(id: number): Promise<any> {
        try {
            const response = await api.delete(`/escuelas/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al eliminar escuela:', error.response?.data || error);
            throw error;
        }
    }

    // ── Búsqueda rápida (EscuelaSelector) ───────────────────
    /**
     * Trae todas y filtra en el cliente.
     * Mantiene compatibilidad con EscuelaBusquedaResponse.
     */
    static async search(searchTerm: string): Promise<EscuelaBusquedaResponse> {
        try {
            const response = await api.get('/escuelas', {
                params: { page: 1, limit: 100 },
            });

            const raw = response.data;
            let data  = Array.isArray(raw) ? raw : (raw.data ?? []);

            if (searchTerm.trim()) {
                data = data.filter((e: any) =>
                    e.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
                );
            }

            return {
                message:     raw.message,
                description: raw.description,
                total:       data.length,
                data,
            };
        } catch (error: any) {
            console.error('❌ Error al buscar escuelas:', error.response?.data || error);
            throw error;
        }
    }
}