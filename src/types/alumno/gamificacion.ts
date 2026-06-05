// ── Nivel ─────────────────────────────────────────────────────────────────

export interface NivelInfo {
  nivel: number;
  nombre: string;
  puntosMin: number;
  puntosMax: number;
  icono: string;
  color: string;
}

// ── Progreso dentro del nivel actual ──────────────────────────────────────

export interface ProgresoActualGamificacion {
  puntosTotales: number;
  nivelActual: number;
  rachaActual: number;
  porcentajeNivel: number;
}

// ── Objeto gamificacion que viene embebido en evaluación y progreso ────────

export interface GamificacionEvento {
  puntosGanados: number;
  subioNivel: boolean;
  nivelNuevo: number | null;
  insigniasNuevas: string[];         // claves de insignia, ej: "racha_7_dias"
  progresoActual: ProgresoActualGamificacion;
}

// ── Insignia completa (GET /gamificacion/insignias) ───────────────────────

export interface Insignia {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: string;
  obtenida: boolean;
  obtenidaEn: string | null;
  visto: boolean;
}

// ── Progreso general (GET /gamificacion/progreso) ─────────────────────────

export interface ProgresoGamificacion {
  alumnoId: number;
  puntosTotales: number;
  nivelActual: number;
  librosCompletados: number;
  segmentosLeidos: number;
  evaluacionesOk: number;
  rachaActual: number;
  rachaMasLarga: number;
  ultimaActividad: string;
  nivel: NivelInfo;
  nivelSiguiente: NivelInfo | null;
  puntosParaSiguienteNivel: number;
  porcentajeNivel: number;
}

// ── Nodo del mapa de lectura ──────────────────────────────────────────────

export interface MapaLibro {
  libroId: number;
  totalSegmentos: number;
  segmentosIds: number[];
  completados: number[];
  porcentaje: number;
  actualizadoEn: string;
}