import api from '../../utils/api';
import {
    EvaluacionData,
    EnviarRespuestasPayload,
    EvaluacionResultado,
    ReintentoData,
    NivelPregunta,
} from '../../types/alumno/evaluacion';

export class EvaluacionService {
    /**
     * Obtener preguntas de evaluación para un segmento
     * GET /escuelas/mis-libros/:libroId/segmentos/:segmentoId/evaluacion
     */
    static async getEvaluacion(
        libroId: number,
        segmentoId: number,
        nivel?: NivelPregunta
    ): Promise<EvaluacionData> {
        const params = nivel ? { nivel } : {};
        const response = await api.get(
            `/escuelas/mis-libros/${libroId}/segmentos/${segmentoId}/evaluacion`,
            { params }
        );
        return response.data?.data ?? response.data;
    }

    /**
     * Enviar respuestas del alumno
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
     * Solicitar nueva variación de preguntas (reintento)
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
}
