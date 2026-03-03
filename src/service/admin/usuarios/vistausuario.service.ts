import api from '../../../utils/api';
import { UsuariosResponse } from '../../../types/admin/usuarios/vistausuario';

export class UsuarioService {
    /**
     * Obtener todos los usuarios (solo Admin)
     * GET /admin/usuarios
     */
    static async getAll(): Promise<UsuariosResponse> {
        try {
            const response = await api.get('/admin/usuarios');
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al obtener usuarios:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener un usuario por ID
     * GET /admin/usuarios/:id
     */
    static async getById(id: number): Promise<any> {
        try {
            const response = await api.get(`/admin/usuarios/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener usuario:', error);
            throw error;
        }
    }

    /**
     * Actualizar usuario (campos básicos, no cambia el rol)
     * PATCH /admin/usuarios/:id
     */
    static async update(id: number, data: Partial<{
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        correo: string;
        telefono: string;
        fechaNacimiento: string;
        genero: string;
        password: string;
        activo: boolean;
    }>): Promise<any> {
        try {
            const response = await api.patch(`/admin/usuarios/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error al actualizar usuario:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Eliminar usuario
     * DELETE /admin/usuarios/:id
     */
    static async delete(id: number): Promise<any> {
        try {
            const response = await api.delete(`/admin/usuarios/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al eliminar usuario:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Activar/Desactivar usuario
     * PATCH /admin/usuarios/:id/toggle-status
     */
    static async toggleStatus(id: number): Promise<any> {
        try {
            const response = await api.patch(`/admin/usuarios/${id}/toggle-status`);
            return response.data;
        } catch (error: any) {
            console.error('Error al cambiar estado del usuario:', error.response?.data || error);
            throw error;
        }
    }
}