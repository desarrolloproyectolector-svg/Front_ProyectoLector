
import api from '../../../utils/api';
import { AlumnoBusquedaResponse, AlumnoBusquedaParams } from '../../../types/admin/usuarios/alumno';

export class AlumnoService {
    /**
     * Registrar nuevo alumno
     * POST /personas/registro-alumno
     */
    static async create(data: any): Promise<any> {
        try {
            // Enviar los datos EXACTAMENTE como vienen del formulario
            const payload: any = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                email: data.email,
                password: data.password,
                idEscuela: data.idEscuela, // OBLIGATORIO para Admin
            };

            // Agregar campos opcionales solo si tienen valor
            if (data.telefono) payload.telefono = data.telefono;
            if (data.fechaNacimiento) payload.fechaNacimiento = data.fechaNacimiento;
            if (data.grado) payload.grado = data.grado;
            if (data.grupo) payload.grupo = data.grupo;
            if (data.cicloEscolar) payload.cicloEscolar = data.cicloEscolar;

            console.log('📤 Enviando a la API (Alumno):', payload);

            const response = await api.post('/personas/registro-alumno', payload);
            
            console.log('✅ Respuesta de la API (Alumno):', response.data);
            
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al registrar alumno:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener todos los alumnos (con filtro opcional por escuela)
     * GET /personas/alumnos
     * GET /personas/alumnos?escuelaId=1
     */
    static async getAll(escuelaId?: number): Promise<any[]> {
        try {
            const url = escuelaId 
                ? `/personas/alumnos?escuelaId=${escuelaId}`
                : '/personas/alumnos';
            
            const response = await api.get(url);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener alumnos:', error);
            throw error;
        }
    }

    /**
     * Buscar alumnos por campo
     * GET /personas/alumnos/buscar?campo=nombre&valor=Juan
     * 
     * @param campo - Campo por el cual buscar: 'nombre', 'apellido', 'correo', 'telefono', 'grado', 'grupo', 'cicloEscolar', 'escuelaId'
     * @param valor - Valor a buscar (texto parcial o número)
     * @param escuelaId - Filtrar por escuela (opcional)
     * @param page - Página (opcional)
     * @param limit - Cantidad por página (opcional)
     */
    static async search(
        campo: AlumnoBusquedaParams['campo'],
        valor: string,
        escuelaId?: number,
        page?: number,
        limit?: number
    ): Promise<AlumnoBusquedaResponse> {
        try {
            // Construir query params
            const params = new URLSearchParams({
                campo,
                valor,
            });

            if (escuelaId) params.append('escuelaId', escuelaId.toString());
            if (page) params.append('page', page.toString());
            if (limit) params.append('limit', limit.toString());

            console.log('🔍 Buscando alumnos:', { campo, valor, escuelaId });

            // ← AQUÍ ESTABA EL ERROR: Usar paréntesis (), no template literals ``
            const response = await api.get(`/personas/alumnos/buscar?${params.toString()}`);
            
            console.log('✅ Resultados de búsqueda:', response.data);
            
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al buscar alumnos:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * Obtener un alumno por ID
     * GET /personas/alumnos/:id
     */
    static async getById(id: number): Promise<any> {
        try {
            const response = await api.get(`/personas/alumnos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener alumno:', error);
            throw error;
        }
    }

    /**
     * Actualizar alumno
     * PUT /personas/alumnos/:id
     */
    static async update(id: number, data: any): Promise<any> {
        try {
            const response = await api.put(`/personas/alumnos/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error al actualizar alumno:', error);
            throw error;
        }
    }

    /**
     * Eliminar alumno
     * DELETE /personas/alumnos/:id
     */
    static async delete(id: number): Promise<any> {
        try {
            const response = await api.delete(`/personas/alumnos/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al eliminar alumno:', error);
            throw error;
        }
    }
}