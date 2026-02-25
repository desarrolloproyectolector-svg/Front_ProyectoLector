import api from '../utils/api';
import {
    ListLibrosResponse,
    CreateLibroResponse,
    LibroDetail,
    EscuelaLibrosResponse,
    LibroEscuelasResponse,
    CreateLibroPendienteResponse,
    CanjeLibroResponse,
} from '../types/libros/libro';

export class LibrosService {
    /**
     * Obtener todos los libros (Admin)
     * GET /libros
     */
    static async getAll(): Promise<ListLibrosResponse> {
        try {
            const response = await api.get('/libros');
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener libros:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener detalle de un libro por ID (con unidades y segmentos)
     * GET /libros/:id
     */
    static async getById(id: number): Promise<{ message: string; data: LibroDetail }> {
        try {
            const response = await api.get(`/libros/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener libro por ID:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Cargar un libro con PDF (Admin)
     * POST /libros/cargar (multipart/form-data)
     */
    static async uploadLibro(
        pdfFile: File,
        titulo: string,
        grado: number,
        materiaId?: number,
        codigo?: string,
        descripcion?: string
    ): Promise<CreateLibroResponse> {
        try {
            const formData = new FormData();
            formData.append('pdf', pdfFile);
            formData.append('titulo', titulo);
            formData.append('grado', grado.toString());

            if (materiaId) {
                formData.append('materiaId', materiaId.toString());
            }
            if (codigo) {
                formData.append('codigo', codigo);
            }
            if (descripcion) {
                formData.append('descripcion', descripcion);
            }

            const response = await api.post('/libros/cargar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al cargar libro:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Descargar PDF del libro (Admin)
     * GET /libros/:id/pdf
     */
    static async downloadPdf(id: number): Promise<Blob> {
        try {
            const response = await api.get(`/libros/${id}/pdf`, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al descargar PDF:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Eliminar un libro (Admin)
     * DELETE /libros/:id
     */
    static async deleteLibro(id: number): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/libros/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al eliminar libro:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener libros activos de una escuela (Admin)
     * GET /escuelas/:id/libros
     */
    static async getLibrosByEscuela(escuelaId: number): Promise<EscuelaLibrosResponse> {
        try {
            const response = await api.get(`/escuelas/${escuelaId}/libros`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener libros de escuela:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener libros pendientes de canjear en una escuela (Admin)
     * GET /escuelas/:id/libros/pendientes
     */
    static async getLibrosPendientesByEscuela(escuelaId: number): Promise<any> {
        try {
            const response = await api.get(`/escuelas/${escuelaId}/libros/pendientes`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener libros pendientes:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Otorgar libro a una escuela (Paso 1)
     * POST /escuelas/:id/libros
     */
    static async asignarLibroAEscuela(
        escuelaId: number,
        codigo: string
    ): Promise<CreateLibroPendienteResponse> {
        try {
            const response = await api.post(`/escuelas/${escuelaId}/libros`, {
                codigo,
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al asignar libro a escuela:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Canjear libro en una escuela (Paso 2)
     * POST /escuelas/:id/libros/canjear
     */
    static async canjeLibroEnEscuela(escuelaId: number, codigo: string): Promise<CanjeLibroResponse> {
        try {
            const response = await api.post(`/escuelas/${escuelaId}/libros/canjear`, {
                codigo,
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al canjear libro:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Activar/Desactivar libro en una escuela específica
     * PATCH /escuelas/:id/libros/:libroId/activo
     */
    static async toggleLibroEnEscuela(
        escuelaId: number,
        libroId: number,
        activo: boolean
    ): Promise<{ message: string; data: { escuelaId: number; libroId: number; activo: boolean; titulo: string } }> {
        try {
            const response = await api.patch(`/escuelas/${escuelaId}/libros/${libroId}/activo`, {
                activo,
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al cambiar estado del libro en escuela:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Ver escuelas de un libro (admin)
     * GET /libros/:id/escuelas
     */
    static async getEscuelasByLibro(libroId: number): Promise<LibroEscuelasResponse> {
        try {
            const response = await api.get(`/libros/${libroId}/escuelas`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener escuelas del libro:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Activar/Desactivar libro en una escuela desde libros
     * PATCH /libros/:id/escuelas/:escuelaId/activo
     */
    static async toggleLibroEnEscuelaDesdeLibro(
        libroId: number,
        escuelaId: number,
        activo: boolean
    ): Promise<{
        message: string;
        data: {
            libroId: number;
            escuelaId: number;
            activo: boolean;
            tituloLibro: string;
            nombreEscuela: string;
        };
    }> {
        try {
            const response = await api.patch(`/libros/${libroId}/escuelas/${escuelaId}/activo`, {
                activo,
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al cambiar acceso del libro en escuela:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Activar/Desactivar libro globalmente en todo el sistema
     * PATCH /libros/:id/activo
     */
    static async toggleLibroGlobal(
        id: number,
        activo: boolean
    ): Promise<{ message: string; data: { id: number; titulo: string; activo: boolean } }> {
        try {
            const response = await api.patch(`/libros/${id}/activo`, {
                activo,
            });
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al cambiar estado global del libro:', error.response?.data || error);
            throw error;
        }
    }
}
