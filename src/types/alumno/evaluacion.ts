export type NivelPregunta = 'basico' | 'intermedio' | 'avanzado';

export type EstadoEvaluacion =
    | 'sin_evaluacion'    // inicial, aún no se intentó cargar
    | 'sin_preguntas'     // backend no tiene preguntas → puede avanzar libremente
    | 'cargando'          // cargando preguntas del backend
    | 'pendiente'         // preguntas listas, esperando respuesta del alumno
    | 'enviando'          // enviando respuestas
    | 'aprobado'          // score >= 70, puede avanzar
    | 'refuerzo'          // score < 70, puede reintentar
    | 'intentos_agotados'; // 3 intentos usados, puede avanzar de todas formas

export interface PreguntaEvaluacion {
    preguntaId: string;
    texto: string;
}

export interface EvaluacionData {
    segmentoId: number;
    nivel: NivelPregunta;
    preguntas: PreguntaEvaluacion[];
    umbralAprobacion: number;
    intentosRestantes: number;
}

export interface RespuestaItem {
    preguntaId: string;
    respuesta: string;
}

export interface ApoioEvaluacion {
    tipo: 'pista' | 'glosario' | string;
    contenido?: string;
    palabras?: string[];
}

export interface EvaluacionResultado {
    score: number;
    aprobado: boolean;
    puedeAvanzar: boolean;
    siguienteAccion: 'avanzar' | 'refuerzo';
    apoyos?: ApoioEvaluacion[];
}

export interface ReintentoData {
    nivel: NivelPregunta;
    preguntas: PreguntaEvaluacion[];
    intento: number;
}

export interface EnviarRespuestasPayload {
    nivel?: NivelPregunta;
    respuestas: RespuestaItem[];
}
