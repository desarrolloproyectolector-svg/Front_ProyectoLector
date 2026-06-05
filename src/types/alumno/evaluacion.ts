import { GamificacionEvento } from './gamificacion';

export type NivelPregunta = 'basico' | 'intermedio' | 'avanzado';

export type EstadoEvaluacion =
  | 'sin_evaluacion'
  | 'sin_preguntas'
  | 'cargando'
  | 'pendiente'
  | 'enviando'
  | 'aprobado'
  | 'refuerzo'
  | 'intentos_agotados';

// ── Diagnóstico ──────────────────────────────────────────────────────────────

export interface PreguntaDiagnostico {
  preguntaId: number;
  texto: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
}

export interface DiagnosticoCheckResponse {
  necesitaDiagnostico: false;
}

export interface DiagnosticoNecesarioResponse {
  necesitaDiagnostico: true;
  preguntas: PreguntaDiagnostico[];
}

export type DiagnosticoResponse = DiagnosticoCheckResponse | DiagnosticoNecesarioResponse;

export interface DiagnosticoResultado {
  score: number;
  nivelAsignado: NivelPregunta;
  tiempoMinimo: number;
}

// ── Evaluación de segmento ───────────────────────────────────────────────────

export interface PreguntaEvaluacion {
  preguntaId: number;
  texto: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
}

export interface EvaluacionData {
  segmentoId: number;
  nivel: NivelPregunta;
  preguntas: PreguntaEvaluacion[];
  umbralAprobacion: number;
  intentosRestantes: number;
  tiempoMinimoSegundos: number;
}

// ── Respuestas ───────────────────────────────────────────────────────────────

export type LetraRespuesta = 'A' | 'B' | 'C' | 'D';

export interface RespuestaItem {
  preguntaId: number;
  respuesta: LetraRespuesta;
  tiempoMs?: number;
}

export interface EnviarRespuestasPayload {
  respuestas: RespuestaItem[];
}

// ── Apoyos pedagógicos ───────────────────────────────────────────────────────

export interface PalabraGlosario {
  palabra: string;
  definicion: string;
}

export interface ApoioEvaluacion {
  tipo: 'pista' | 'glosario' | 'resumen';
  contenido?: string;
  palabras?: PalabraGlosario[];
}

// ── Resultado de evaluación ──────────────────────────────────────────────────

export interface EvaluacionResultado {
  score: number;
  aprobado: boolean;
  puedeAvanzar: boolean;
  siguienteAccion: 'continuar' | 'refuerzo';
  apoyos: ApoioEvaluacion[];
  tiposError: Record<string, number>;
  gamificacion?: GamificacionEvento;   // ← viene cuando aprobado: true
}

// ── Reintento ────────────────────────────────────────────────────────────────

export interface ReintentoData {
  segmentoId: number;
  nivel: NivelPregunta;
  preguntas: PreguntaEvaluacion[];
  umbralAprobacion: number;
  intentosRestantes: number;
  tiempoMinimoSegundos: number;
}

// ── Estado de aprendizaje ────────────────────────────────────────────────────

export interface PerfilAdaptativo {
  nivelActual: NivelPregunta;
  tiempoMinimoActual: number;
  rachaPosiva: number;
  rachaNegativa: number;
  diagnosticoCompletado: boolean;
}

export interface EstadoAprendizaje {
  perfil: PerfilAdaptativo;
  progreso: {
    porcentaje: number;
    ultimaLectura: string;
  };
}