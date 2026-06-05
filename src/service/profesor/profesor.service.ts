import api from '../../utils/api';
import {
  GrupoProfesor,
  AlumnoGrupo,
  AlumnoLibroProgreso,
  AlumnoLibroDetalle,
  AlumnoEvaluaciones,
} from '../../types/profesor/profesor';

export class ProfesorService {

  /** GET /profesor/grupos */
  static async getGrupos(): Promise<GrupoProfesor[]> {
    const response = await api.get('/profesor/grupos');
    return response.data?.data ?? response.data;
  }

  /** GET /profesor/grupos/:grupoId/alumnos */
  static async getAlumnos(grupoId: string | number): Promise<AlumnoGrupo[]> {
    const response = await api.get(`/profesor/grupos/${grupoId}/alumnos`);
    return response.data?.data ?? response.data;
  }

  /** GET /profesor/libros/:libroId/alumnos */
  static async getAlumnosPorLibro(libroId: number): Promise<{
    libro: { id: number; titulo: string; autor: string };
    totalSegmentos: number;
    totalAlumnos: number;
    data: AlumnoLibroProgreso[];
  }> {
    const response = await api.get(`/profesor/libros/${libroId}/alumnos`);
    return response.data?.data ?? response.data;
  }

  /** GET /profesor/alumnos/:alumnoId/libros */
  static async getLibrosAlumno(alumnoId: string | number): Promise<AlumnoLibroDetalle[]> {
    const response = await api.get(`/profesor/alumnos/${alumnoId}/libros`);
    return response.data?.data ?? response.data;
  }

  /** GET /profesor/alumnos/:alumnoId/evaluaciones */
  static async getEvaluacionesAlumno(alumnoId: string | number): Promise<AlumnoEvaluaciones[]> {
    const response = await api.get(`/profesor/alumnos/${alumnoId}/evaluaciones`);
    return response.data?.data ?? response.data;
  }
}