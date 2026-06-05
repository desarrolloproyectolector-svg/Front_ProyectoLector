import api from '../../utils/api';
import {
  DiagnosticoResponse,
  DiagnosticoResultado,
  EvaluacionData,
  EnviarRespuestasPayload,
  EvaluacionResultado,
  ReintentoData,
  EstadoAprendizaje,
  ApoioEvaluacion,
} from '../../types/alumno/evaluacion';

export class EvaluacionService {

  // ── Diagnóstico inicial ────────────────────────────────────────────────────

  /**
   * Verifica si el alumno necesita diagnóstico para este libro.
   * GET /evaluacion/diagnostico/:libroId
   */
  static async checkDiagnostico(libroId: number): Promise<DiagnosticoResponse> {
    const response = await api.get(`/evaluacion/diagnostico/${libroId}`);
    return response.data?.data ?? response.data;
  }

  /**
   * Envía las respuestas del diagnóstico inicial.
   * POST /evaluacion/diagnostico/:libroId
   */
  static async enviarDiagnostico(
    libroId: number,
    respuestas: Array<{ preguntaId: number; respuesta: string }>
  ): Promise<DiagnosticoResultado> {
    const response = await api.post(`/evaluacion/diagnostico/${libroId}`, { respuestas });
    return response.data?.data ?? response.data;
  }

  // ── Evaluación de segmento (flujo oficial — dispara gamificación) ──────────

  /**
   * Obtiene las preguntas de evaluación para un segmento.
   * GET /escuelas/mis-libros/:libroId/segmentos/:segmentoId/evaluacion
   */
  static async getEvaluacion(
    libroId: number,
    segmentoId: number
  ): Promise<EvaluacionData> {
    const response = await api.get(
      `/escuelas/mis-libros/${libroId}/segmentos/${segmentoId}/evaluacion`
    );
    return response.data?.data ?? response.data;
  }

  /**
   * Envía las respuestas del alumno para un segmento.
   * POST /escuelas/mis-libros/:libroId/segmentos/:segmentoId/evaluacion
   */
  static async enviarRespuestas(
    libroId: number,
    segmentoId: number,
    payload: EnviarRespuestasPayload
  ): Promise<EvaluacionResultado> {
    const response = await api.post(
      `/escuelas/mis-libros/${libroId}/segmentos/${segmentoId}/evaluacion`,
      payload
    );
    return response.data?.data ?? response.data;
  }

  /**
   * Solicita una variación de preguntas para reintento (sin body).
   * POST /escuelas/mis-libros/:libroId/segmentos/:segmentoId/evaluacion/reintento
   */
  static async solicitarReintento(
    libroId: number,
    segmentoId: number
  ): Promise<ReintentoData> {
    const response = await api.post(
      `/escuelas/mis-libros/${libroId}/segmentos/${segmentoId}/evaluacion/reintento`
    );
    return response.data?.data ?? response.data;
  }

  // ── Estado de aprendizaje ──────────────────────────────────────────────────

  /**
   * Consulta el perfil adaptativo y progreso del alumno en un libro.
   * GET /evaluacion/:libroId/estado
   */
  static async getEstado(libroId: number): Promise<EstadoAprendizaje> {
    const response = await api.get(`/evaluacion/${libroId}/estado`);
    return response.data?.data ?? response.data;
  }

  // ── Apoyos pedagógicos ─────────────────────────────────────────────────────

  /**
   * Consulta los apoyos pedagógicos de un segmento de forma independiente.
   * GET /evaluacion/:libroId/segmento/:segmentoId/apoyos
   */
  static async getApoyos(
    libroId: number,
    segmentoId: number
  ): Promise<ApoioEvaluacion[]> {
    const response = await api.get(
      `/evaluacion/${libroId}/segmento/${segmentoId}/apoyos`
    );
    const data = response.data?.data ?? response.data;
    return data?.apoyos ?? [];
  }
}