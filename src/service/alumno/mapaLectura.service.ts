import api from '../../utils/api';
import { MapaTextoDetalle } from '../../types/alumno/gamificacion';

export class MapaLecturaService {
  /**
   * Mapa de lectura del alumno.
   * Une /gamificacion/mapa (progreso) con /escuelas/mis-libros (catálogo completo)
   * para mostrar todos los libros del perfil con su estado de avance.
   */
  static async getMapa(): Promise<MapaTextoDetalle[]> {
    try {
      const [mapaRes, librosRes] = await Promise.all([
        api.get('/gamificacion/mapa'),
        api.get('/escuelas/mis-libros'),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapaData: any[] = mapaRes.data?.data ?? mapaRes.data ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const librosData: any[] = librosRes.data?.data ?? librosRes.data ?? [];

      return librosData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((libro: any): MapaTextoDetalle => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const m = mapaData.find((p: any) => Number(p.libroId) === Number(libro.id));
          const pct = Math.round(m?.porcentaje ?? 0);
          const completados: number[] = m?.completados ?? [];
          const totalSeg: number = m?.totalSegmentos ?? 10;

          return {
            libroId:              Number(libro.id),
            titulo:               libro.titulo ?? `Libro #${libro.id}`,
            autor:                libro.autor ?? null,
            materia:              libro.materia?.nombre ?? libro.materia ?? undefined,
            comprensionPromedio:  pct,
            xpGanados:            m?.xpGanados ?? 0,
            tiempoLecturaMinutos: m?.tiempoLecturaMinutos ?? 0,
            fechaInicio:          m?.actualizadoEn ?? null,
            fechaFin:             pct >= 100 ? m?.actualizadoEn : null,
            enCurso:              pct > 0 && pct < 100,
            nivelDificultad:      3,
            insigniasObtenidas:   [],
            anotaciones:          0,
            segmentosCompletados: completados.length,
            totalSegmentos:       totalSeg,
          };
        })
        .sort((a, b) => {
          // Libros con actividad primero, sin iniciar al final
          if (a.comprensionPromedio > 0 && b.comprensionPromedio === 0) return -1;
          if (a.comprensionPromedio === 0 && b.comprensionPromedio > 0) return 1;
          return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();
        });
    } catch {
      return [];
    }
  }
}
