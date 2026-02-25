import api from '../../../utils/api';

export class ProfesorService {
    /**
     * Registrar nuevo maestro/profesor
     * POST /personas/registro-maestro
     */
    static async create(data: any): Promise<any> {
        try {
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
            if (data.especialidad) payload.especialidad = data.especialidad;
            if (data.fechaIngreso) payload.fechaIngreso = data.fechaIngreso;

            console.log('📤 Enviando a la API (Profesor):', payload);

            const response = await api.post('/personas/registro-maestro', payload);
            
            console.log('✅ Respuesta de la API (Profesor):', response.data);
            
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al registrar profesor:', error.response?.data || error);
            throw error;
        }
    }

    static async getAll(): Promise<any[]> {
        try {
            const response = await api.get('/personas/maestros');
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener profesores:', error);
            throw error;
        }
    }

    static async getById(id: number): Promise<any> {
        try {
            const response = await api.get(`/personas/maestros/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener profesor:', error);
            throw error;
        }
    }

    static async getMisAlumnos(): Promise<any[]> {
        try {
            const response = await api.get('/maestros/mis-alumnos');
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener mis alumnos:', error);
            throw error;
        }
    }

    static async asignarAlumno(alumnoId: number, materiaId: number): Promise<void> {
        try {
            await api.post('/maestros/asignar-alumno', { alumnoId, materiaId });
        } catch (error: any) {
            console.error('Error al asignar alumno:', error);
            throw error;
        }
    }
}