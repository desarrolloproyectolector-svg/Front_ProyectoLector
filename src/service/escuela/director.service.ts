import api from '../../utils/api';

export class DirectorService {
    /**
     * Listar libros disponibles para asignar a un alumno
     * GET /director/libros-disponibles-para-asignar?alumnoId=...
     */
    static async getLibrosDisponibles(alumnoId: number) {
        const response = await api.get('/director/libros-disponibles-para-asignar', {
            params: { alumnoId }
        });
        return response.data;
    }

    /**
     * Asignar un libro a un alumno (consume licencia)
     * POST /director/asignar-libro
     */
    static async asignarLibro(alumnoId: number, libroId: number) {
        const response = await api.post('/director/asignar-libro', { alumnoId, libroId });
        return response.data;
    }

    /**
     * Desasignar un libro a un alumno
     * DELETE /director/desasignar-libro/:alumnoId/:libroId
     */
    static async desasignarLibro(alumnoId: number, libroId: number) {
        const response = await api.delete(`/director/desasignar-libro/${alumnoId}/${libroId}`);
        return response.data;
    }
}
