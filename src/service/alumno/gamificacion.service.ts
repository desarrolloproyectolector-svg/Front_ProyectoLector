import api from '../../utils/api';
import {
  ProgresoGamificacion,
  Insignia,
  MapaLibro,
  NivelInfo,
} from '../../types/alumno/gamificacion';
import { BADGE_CONFIG } from '../../utils/gamificacion.constants';

// ── Mock de insignias (mientras el backend no tiene el módulo implementado) ──
// Marca las 3 primeras insignias de "primeros_pasos" como obtenidas.
// Los filtros de estado y categoría funcionan correctamente con estos datos.
function buildInsigniasMock(): {
  total: number;
  obtenidas: number;
  noVistas: number;
  data: Insignia[];
} {
  // Claves que simulamos como obtenidas
  const OBTENIDAS_SIMULADAS = new Set([
    'primer_fragmento',   // "Primer Paso"   — Primeros Pasos
    'primera_evaluacion', // "Primera Prueba" — Primeros Pasos
    'primera_anotacion',  // "Tus Palabras"   — Primeros Pasos
  ]);

  const data: Insignia[] = BADGE_CONFIG.map((cfg, idx) => ({
    id:          idx + 1,
    clave:       cfg.clave,
    nombre:      cfg.nombre,
    descripcion: cfg.criterio,
    icono:       cfg.icono,
    categoria:   cfg.categoria,
    obtenida:    OBTENIDAS_SIMULADAS.has(cfg.clave),
    obtenidaEn:  OBTENIDAS_SIMULADAS.has(cfg.clave) ? '2026-06-01T00:00:00Z' : null,
    visto:       true,
  }));

  return {
    total:    BADGE_CONFIG.length,
    obtenidas: OBTENIDAS_SIMULADAS.size,
    noVistas: 0,
    data,
  };
}


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
   *
   * NOTA: El backend aún no tiene este módulo completamente implementado.
   * Si las claves devueltas no coinciden con BADGE_CONFIG, se usan datos
   * simulados coherentes para que los filtros funcionen correctamente.
   */
  static async getInsignias(): Promise<{
    total: number;
    obtenidas: number;
    noVistas: number;
    data: Insignia[];
  }> {
    // TODO: descomentar cuando el backend implemente el módulo de insignias
    // try {
    //   const response = await api.get('/gamificacion/insignias');
    //   const raw: Insignia[] = response.data?.data ?? [];
    //   const clavesValidas = new Set(BADGE_CONFIG.map(b => b.clave as string));
    //   const rawConClavesValidas = raw.filter((i: Insignia) => clavesValidas.has(i.clave));
    //   if (rawConClavesValidas.length > 0) {
    //     const obtenidas = rawConClavesValidas.filter((i: Insignia) => i.obtenida).length;
    //     return { total: BADGE_CONFIG.length, obtenidas, noVistas: response.data?.noVistas ?? 0, data: rawConClavesValidas };
    //   }
    // } catch { /* continúa al mock */ }

    // Mientras el backend no esté listo → datos simulados coherentes
    return buildInsigniasMock();
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