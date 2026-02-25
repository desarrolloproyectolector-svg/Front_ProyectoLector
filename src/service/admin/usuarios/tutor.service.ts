import api from '../../../utils/api';

export class TutorService {
    /**
     * Registrar nuevo padre/tutor
     * POST /personas/registro-padre
     */
    static async create(data: any): Promise<any> {
        try {
            const payload: any = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                email: data.email,
                password: data.password,
            };

            if (data.telefono) {
                payload.telefono = data.telefono;
            }
            
            if (data.fechaNacimiento) {
                payload.fechaNacimiento = data.fechaNacimiento;
            }
            
            if (data.alumnoId !== null && data.alumnoId !== undefined && data.alumnoId !== '') {
                const alumnoIdNum = typeof data.alumnoId === 'string' 
                    ? parseInt(data.alumnoId) 
                    : data.alumnoId;
                payload.alumnoId = alumnoIdNum;
            }

            const response = await api.post('/personas/registro-padre', payload);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al registrar tutor:', error.response?.data || error);
            throw error;
        }
    }

    static async getAll(): Promise<any[]> {
        try {
            const response = await api.get('/personas/padres');
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener tutores:', error);
            throw error;
        }
    }

    static async getById(id: number): Promise<any> {
        try {
            const response = await api.get(`/personas/padres/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener tutor:', error);
            throw error;
        }
    }

    static async getAlumnos(id: number): Promise<any[]> {
        try {
            const response = await api.get(`/personas/padres/${id}/alumnos`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener alumnos del tutor:', error);
            throw error;
        }
    }

    static async update(id: number, data: any): Promise<any> {
        try {
            const response = await api.put(`/personas/padres/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error al actualizar tutor:', error);
            throw error;
        }
    }

    static async delete(id: number): Promise<any> {
        try {
            const response = await api.delete(`/personas/padres/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al eliminar tutor:', error);
            throw error;
        }
    }
}