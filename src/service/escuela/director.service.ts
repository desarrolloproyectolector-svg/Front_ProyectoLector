import api from '../../utils/api';
import {
  DashboardDirector,
  AlumnoEscuela,
  AlumnoLibroProgreso,
  AlumnoEvaluaciones,
} from '../../types/profesor/profesor';

export class DirectorService {

  /** GET /director/dashboard */
  static async getDashboard(): Promise<DashboardDirector> {
    const response = await api.get('/director/dashboard');
    return response.data?.data ?? response.data;
  }

  /** GET /director/alumnos */
  static async getAlumnos(): Promise<AlumnoEscuela[]> {
    const response = await api.get('/director/alumnos');
    return response.data?.data ?? response.data;
  }

  /** GET /director/libros/:libroId/alumnos */
  static async getAlumnosPorLibro(libroId: number): Promise<{
    libro: { id: number; titulo: string; autor: string };
    totalSegmentos: number;
    totalAlumnos: number;
    data: AlumnoLibroProgreso[];
  }> {
    const response = await api.get(`/director/libros/${libroId}/alumnos`);
    return response.data?.data ?? response.data;
  }

  /** GET /director/alumnos/:alumnoId/evaluaciones */
  static async getEvaluacionesAlumno(alumnoId: string | number): Promise<AlumnoEvaluaciones[]> {
    const response = await api.get(`/director/alumnos/${alumnoId}/evaluaciones`);
    return response.data?.data ?? response.data;
  }

  /** GET /escuelas/alumnos/:alumnoId/libros */
  static async getLibrosAlumno(alumnoId: string | number) {
    const response = await api.get(`/escuelas/alumnos/${alumnoId}/libros`);
    return response.data?.data ?? response.data;
  }

  /** GET /director/maestros */
  static async getMaestros() {
    const response = await api.get('/director/maestros');
    return response.data?.data ?? response.data;
  }

  // ── Helpers previos (asignación de libros) ────────────────────────────────

  static async getLibrosDisponibles(alumnoId: number) {
    const response = await api.get('/director/libros-disponibles-para-asignar', {
      params: { alumnoId },
    });
    return response.data;
  }

  static async asignarLibro(alumnoId: number, libroId: number) {
    const response = await api.post('/director/asignar-libro', { alumnoId, libroId });
    return response.data;
  }

  static async desasignarLibro(alumnoId: number, libroId: number) {
    const response = await api.delete(`/director/desasignar-libro/${alumnoId}/${libroId}`);
    return response.data;
  }
}