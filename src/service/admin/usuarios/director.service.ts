import api from '../../../utils/api';

export class DirectorService {
    /**
     * Registrar nuevo director
     * POST /personas/registro-director
     */
    static async create(data: any): Promise<any> {
        try {
            const payload: any = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                email: data.email,
                password: data.password,
                idEscuela: data.idEscuela, // OBLIGATORIO
            };

            // Agregar campos opcionales solo si tienen valor
            if (data.telefono) payload.telefono = data.telefono;
            if (data.fechaNacimiento) payload.fechaNacimiento = data.fechaNacimiento;
            if (data.fechaNombramiento) payload.fechaNombramiento = data.fechaNombramiento;

            console.log('📤 Enviando a la API (Director):', payload);

            const response = await api.post('/personas/registro-director', payload);
            
            console.log('✅ Respuesta de la API (Director):', response.data);
            
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al registrar director:', error.response?.data || error);
            throw error;
        }
    }

    static async getAll(): Promise<any[]> {
        try {
            const response = await api.get('/personas/directores');
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener directores:', error);
            throw error;
        }
    }

    static async getById(id: number): Promise<any> {
        try {
            const response = await api.get(`/personas/directores/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener director:', error);
            throw error;
        }
    }
}