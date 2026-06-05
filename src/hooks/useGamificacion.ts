'use client';

import { useState, useCallback, useEffect } from 'react';
import { GamificacionService } from '../service/alumno/gamificacion.service';
import { ProgresoGamificacion, Insignia, MapaLibro, GamificacionEvento } from '../types/alumno/gamificacion';
import { toast } from '../utils/toast';

export interface UseGamificacionReturn {
  progreso:  ProgresoGamificacion | null;
  insignias: Insignia[];
  noVistas:  number;
  mapa:      MapaLibro[];
  isLoading: boolean;
  refrescar: () => Promise<void>;
  marcarVistas: () => Promise<void>;
  /** Llama esto con el objeto gamificacion que devuelve el back tras evaluar o guardar progreso */
  procesarEvento: (evento: GamificacionEvento) => void;
}

export function useGamificacion(): UseGamificacionReturn {
  const [progreso,  setProgreso]  = useState<ProgresoGamificacion | null>(null);
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [noVistas,  setNoVistas]  = useState(0);
  const [mapa,      setMapa]      = useState<MapaLibro[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refrescar = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prog, insig, mapaData] = await Promise.all([
        GamificacionService.getProgreso(),
        GamificacionService.getInsignias(),
        GamificacionService.getMapa(),
      ]);
      setProgreso(prog);
      setInsignias(insig.data);
      setNoVistas(insig.noVistas);
      setMapa(mapaData);
    } catch (e) {
      console.error('Error cargando gamificación:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const marcarVistas = useCallback(async () => {
    await GamificacionService.marcarInsigniasVistas();
    setNoVistas(0);
    setInsignias(prev => prev.map(i => ({ ...i, visto: true })));
  }, []);

  /**
   * Procesa el objeto `gamificacion` que viene embebido en:
   * - POST /escuelas/mis-libros/.../evaluacion  (EvaluacionResultado)
   * - PATCH /escuelas/mis-libros/:id/progreso   (ProgresoResponse)
   *
   * Muestra toasts y refresca el estado local sin hacer un GET extra.
   */
  const procesarEvento = useCallback((evento: GamificacionEvento) => {
    if (!evento) return;

    // Actualizar progreso local con los datos que ya vienen en el evento
    setProgreso(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        puntosTotales:  evento.progresoActual.puntosTotales,
        nivelActual:    evento.progresoActual.nivelActual,
        rachaActual:    evento.progresoActual.rachaActual,
        porcentajeNivel: evento.progresoActual.porcentajeNivel,
      };
    });

    // Toast de puntos ganados
    if (evento.puntosGanados > 0) {
      toast.success(`+${evento.puntosGanados} puntos 🌟`, 3000);
    }

    // Toast de subida de nivel
    if (evento.subioNivel && evento.nivelNuevo !== null) {
      toast.success(`🎉 ¡Subiste al nivel ${evento.nivelNuevo}!`, 4000);
      // Refrescar completo para obtener el nuevo NivelInfo
      refrescar();
    }

    // Toast por cada insignia nueva
    if (evento.insigniasNuevas?.length > 0) {
      evento.insigniasNuevas.forEach(clave => {
        toast.success(`🏅 ¡Nueva insignia desbloqueada! (${clave})`, 4000);
      });
      // Refrescar insignias para obtener los datos completos
      GamificacionService.getInsignias().then(res => {
        setInsignias(res.data);
        setNoVistas(res.noVistas);
      }).catch(console.error);
    }
  }, [refrescar]);

  // Carga inicial
  useEffect(() => { refrescar(); }, [refrescar]);

  return {
    progreso,
    insignias,
    noVistas,
    mapa,
    isLoading,
    refrescar,
    marcarVistas,
    procesarEvento,
  };
}