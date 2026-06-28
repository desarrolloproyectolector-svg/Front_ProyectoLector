import api from '../../utils/api';
import { PerfilCognitivo } from '../../types/alumno/gamificacion';

// ── Datos mock coherentes mientras el backend implementa el endpoint ────────
const MOCK_PERFIL: PerfilCognitivo = {
  alumnoId: 0,
  actualizadoEn: new Date().toISOString(),
  dimensiones: [
    {
      clave: 'velocidad',
      nombre: 'Velocidad de lectura',
      valor: 72,
      tendencia: 'stable',
      consejo: 'Tu ritmo de lectura es saludable. Sigue sin apresurarte.',
    },
    {
      clave: 'comprension_directa',
      nombre: 'Comprensión directa',
      valor: 85,
      tendencia: 'up',
      consejo: '¡Excelente! Entiendes muy bien lo que el texto dice directamente.',
    },
    {
      clave: 'comprension_entre_lineas',
      nombre: 'Comprensión entre líneas',
      valor: 58,
      tendencia: 'up',
      consejo: 'Pregúntate qué quiso decir el autor más allá de las palabras.',
    },
    {
      clave: 'vocabulario',
      nombre: 'Vocabulario',
      valor: 64,
      tendencia: 'up',
      consejo: 'Cada palabra nueva que aprendes del glosario suma a tu nivel.',
    },
    {
      clave: 'pensamiento_critico',
      nombre: 'Pensamiento crítico',
      valor: 45,
      tendencia: 'stable',
      consejo: 'Antes de responder, intenta explicar por qué piensas lo que piensas.',
    },
  ],
};

export class PerfilCognitivoService {
  /**
   * Perfil cognitivo del alumno (5 dimensiones)
   * GET /gamificacion/perfil-cognitivo
   * Fallback a datos mock si el endpoint no existe aún.
   */
  static async getPerfil(): Promise<PerfilCognitivo> {
    try {
      const response = await api.get('/gamificacion/perfil-cognitivo', { timeout: 1000 });
      return response.data?.data ?? response.data;
    } catch {
      // El endpoint aún no existe en el backend — usamos datos representativos
      return MOCK_PERFIL;
    }
  }
}
