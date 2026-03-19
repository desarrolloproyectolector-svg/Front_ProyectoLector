import api from '../../utils/api';

export class MaestroService {
    /**
     * Listar libros disponibles para asignar a un alumno
     * GET /maestros/libros-disponibles-para-asignar?alumnoId=...
     */
    static async getLibrosDisponibles(alumnoId: number) {
        const response = await api.get('/maestros/libros-disponibles-para-asignar', {
            params: { alumnoId }
        });
        return response.data;
    }

    /**
     * Asignar un libro a un alumno (consume licencia)
     * POST /maestros/asignar-libro
     */
    static async asignarLibro(alumnoId: number, libroId: number) {
        const response = await api.post('/maestros/asignar-libro', { alumnoId, libroId });
        return response.data;
    }

    /**
     * Desasignar un libro a un alumno
     * DELETE /maestros/desasignar-libro/:alumnoId/:libroId
     */
    static async desasignarLibro(alumnoId: number, libroId: number) {
        const response = await api.delete(`/maestros/desasignar-libro/${alumnoId}/${libroId}`);
        return response.data;
    }
}
