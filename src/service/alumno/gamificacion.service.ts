import api from '../../utils/api';
import {
  ProgresoGamificacion,
  Insignia,
  MapaLibro,
  NivelInfo,
} from '../../types/alumno/gamificacion';

export class GamificacionService {

  /**
   * Progreso general del alumno (puntos, nivel, racha, etc.)
   * GET /gamificacion/progreso
   */
  static async getProgreso(): Promise<ProgresoGamificacion> {
    const response = await api.get('/gamificacion/progreso');
    return response.data?.data ?? response.data;
  }

  /**
   * Catálogo completo de niveles
   * GET /gamificacion/niveles
   */
  static async getNiveles(): Promise<NivelInfo[]> {
    const response = await api.get('/gamificacion/niveles');
    return response.data?.data ?? response.data;
  }

  /**
   * Insignias del alumno (obtenidas + pendientes)
   * GET /gamificacion/insignias
   */
  static async getInsignias(): Promise<{
    total: number;
    obtenidas: number;
    noVistas: number;
    data: Insignia[];
  }> {
    const response = await api.get('/gamificacion/insignias');
    return {
      total:     response.data?.total    ?? 0,
      obtenidas: response.data?.obtenidas ?? 0,
      noVistas:  response.data?.noVistas  ?? 0,
      data:      response.data?.data      ?? [],
    };
  }

  /**
   * Marcar insignias como vistas (apaga el badge)
   * PATCH /gamificacion/insignias/marcar-vistas
   */
  static async marcarInsigniasVistas(): Promise<void> {
    await api.patch('/gamificacion/insignias/marcar-vistas');
  }

  /**
   * Mapa de todos los libros del alumno
   * GET /gamificacion/mapa
   */
  static async getMapa(): Promise<MapaLibro[]> {
    const response = await api.get('/gamificacion/mapa');
    return response.data?.data ?? response.data;
  }

  /**
   * Mapa de un libro específico
   * GET /gamificacion/mapa/:libroId
   */
  static async getMapaLibro(libroId: number): Promise<MapaLibro> {
    const response = await api.get(`/gamificacion/mapa/${libroId}`);
    return response.data?.data ?? response.data;
  }
}