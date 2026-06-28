// ─────────────────────────────────────────────────────────────────────────────
// Configuración de los 10 niveles del sistema de gamificación
// Los primeros niveles usan tonos fríos (teal→azul) y los últimos cálidos
// NOTA: icono = nombre de icono Heroicon, renderizado con GamificacionIcon
// ─────────────────────────────────────────────────────────────────────────────

export const NIVEL_CONFIG = [
  { nivel: 1,  nombre: 'Principiante',  color: '#20b2aa', icono: 'book-open' },
  { nivel: 2,  nombre: 'Aprendiz',      color: '#3b82f6', icono: 'book' },
  { nivel: 3,  nombre: 'En práctica',   color: '#0ea5e9', icono: 'search' },
  { nivel: 4,  nombre: 'Constante',     color: '#6366f1', icono: 'zap' },
  { nivel: 5,  nombre: 'Comprometido',  color: '#8b5cf6', icono: 'target' },
  { nivel: 6,  nombre: 'Avanzado',      color: '#a855f7', icono: 'rocket' },
  { nivel: 7,  nombre: 'Experto',       color: '#ec4899', icono: 'sparkles' },
  { nivel: 8,  nombre: 'Destacado',     color: '#f97316', icono: 'trophy' },
  { nivel: 9,  nombre: 'Élite',         color: '#ef4444', icono: 'award' },
  { nivel: 10, nombre: 'Leyenda',       color: '#d4af37', icono: 'crown' },
] as const;

export type NivelConfig = (typeof NIVEL_CONFIG)[number];

export const getNivelConfig = (nivel: number): NivelConfig =>
  (NIVEL_CONFIG.find(n => n.nivel === nivel) ?? NIVEL_CONFIG[0]) as NivelConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Tabla de XP por acción
// ─────────────────────────────────────────────────────────────────────────────

export const XP_ACTIONS = [
  { clave: 'fragmento_completo',     label: 'Completar fragmento sin saltar',      xp: 10  },
  { clave: 'evaluacion_aprobada',    label: 'Evaluación aprobada',                 xp: 20  },
  { clave: 'evaluacion_perfecta',    label: 'Evaluación perfecta (adicional)',      xp: 50  },
  { clave: 'anotacion_subrayado',    label: 'Anotación o subrayado por fragmento', xp: 5   },
  { clave: 'glosario',               label: 'Consultar glosario (máx 3/sesión)',    xp: 2   },
  { clave: 'entrada_diaria',         label: 'Entrar a la plataforma el día',        xp: 15  },
  { clave: 'racha_3',                label: 'Racha de 3 días seguidos',             xp: 30  },
  { clave: 'racha_7',                label: 'Racha de 7 días seguidos',             xp: 100 },
  { clave: 'racha_30',               label: 'Racha de 30 días seguidos',            xp: 500 },
  { clave: 'libro_completo',         label: 'Terminar un libro completo',           xp: 300 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Configuración de las 24 insignias en 5 categorías
// NOTA: icono = nombre de icono Heroicon (sin emojis)
// ─────────────────────────────────────────────────────────────────────────────

export const BADGE_CONFIG = [
  // ── Primeros pasos ───────────────────────────────────────────────────────
  { clave: 'primer_fragmento',          nombre: 'Primer Paso',       icono: 'document',       categoria: 'primeros_pasos', criterio: 'Completa tu primer fragmento de lectura',              rareza: 'comun'     },
  { clave: 'primera_evaluacion',        nombre: 'Primera Prueba',    icono: 'check-circle',   categoria: 'primeros_pasos', criterio: 'Aprueba tu primera evaluación',                        rareza: 'comun'     },
  { clave: 'primera_anotacion',         nombre: 'Tus Palabras',      icono: 'pen',            categoria: 'primeros_pasos', criterio: 'Escribe tu primera anotación en un texto',             rareza: 'comun'     },
  { clave: 'primer_glosario',           nombre: 'Curioso',           icono: 'search',         categoria: 'primeros_pasos', criterio: 'Consulta el glosario por primera vez',                rareza: 'comun'     },

  // ── Constancia ───────────────────────────────────────────────────────────
  { clave: 'racha_3_dias',              nombre: 'Tres en Raya',      icono: 'fire',           categoria: 'constancia',     criterio: '3 días de lectura seguidos',                          rareza: 'comun'     },
  { clave: 'racha_7_dias',              nombre: 'Semana Completa',   icono: 'calendar',       categoria: 'constancia',     criterio: '7 días de lectura seguidos',                          rareza: 'raro'      },
  { clave: 'racha_30_dias',             nombre: 'Imparable',         icono: 'sparkles',       categoria: 'constancia',     criterio: '30 días de lectura seguidos',                         rareza: 'epico'     },
  { clave: 'madrugador',                nombre: 'Madrugador',        icono: 'clock',          categoria: 'constancia',     criterio: 'Inicia una sesión antes de las 8am',                  rareza: 'comun'     },
  { clave: 'fin_de_semana',             nombre: 'Sin Descanso',      icono: 'calendar',       categoria: 'constancia',     criterio: 'Lee sábado y domingo en la misma semana',             rareza: 'raro'      },

  // ── Comprensión ──────────────────────────────────────────────────────────
  { clave: 'evaluacion_perfecta',       nombre: 'Sin Errores',       icono: 'star',           categoria: 'comprension',    criterio: 'Obtén 100% en una evaluación',                        rareza: 'raro'      },
  { clave: 'tres_perfectas',            nombre: 'Racha Perfecta',    icono: 'target',         categoria: 'comprension',    criterio: '3 evaluaciones perfectas consecutivas',               rareza: 'epico'     },
  { clave: 'sin_apoyos',               nombre: 'Solo y Fuerte',      icono: 'shield-check',   categoria: 'comprension',    criterio: 'Evaluación perfecta sin usar glosario ni anotaciones',rareza: 'epico'     },
  { clave: 'deduccion_master',          nombre: 'Entre Líneas',      icono: 'eye',            categoria: 'comprension',    criterio: '5 preguntas de deducción correctas en una sesión',    rareza: 'raro'      },
  { clave: 'analisis_master',           nombre: 'Analítico',         icono: 'light-bulb',     categoria: 'comprension',    criterio: '5 preguntas de análisis correctas seguidas',          rareza: 'raro'      },

  // ── Exploración ──────────────────────────────────────────────────────────
  { clave: 'diez_subrayados',           nombre: 'Subrayador',        icono: 'highlighter',    categoria: 'exploracion',    criterio: 'Realiza 10 subrayados en total',                      rareza: 'comun'     },
  { clave: 'veinticinco_anotaciones',   nombre: 'Anotador',          icono: 'pencil',         categoria: 'exploracion',    criterio: 'Escribe 25 anotaciones en total',                     rareza: 'raro'      },
  { clave: 'cincuenta_glosario',        nombre: 'Lexicólogo',        icono: 'book-open',      categoria: 'exploracion',    criterio: 'Consulta el glosario 50 veces en total',              rareza: 'raro'      },
  { clave: 'cuatro_generos',            nombre: 'Explorador',        icono: 'globe',          categoria: 'exploracion',    criterio: 'Lee textos de 4 géneros distintos',                   rareza: 'epico'     },

  // ── Logros mayores ───────────────────────────────────────────────────────
  { clave: 'primer_libro',              nombre: 'Un Libro Menos',    icono: 'award',          categoria: 'logros_mayores', criterio: 'Completa tu primer libro',                            rareza: 'raro'      },
  { clave: 'cinco_libros',              nombre: 'Lector Habitual',   icono: 'bookmark',       categoria: 'logros_mayores', criterio: 'Completa 5 libros en total',                          rareza: 'epico'     },
  { clave: 'diez_libros',               nombre: 'Gran Lector',       icono: 'trophy',         categoria: 'logros_mayores', criterio: 'Completa 10 libros en total',                         rareza: 'legendario'},
  { clave: 'lector_paciente',           nombre: 'Paciente',          icono: 'turtle',         categoria: 'logros_mayores', criterio: '10 fragmentos largos sin lectura rápida detectada',   rareza: 'epico'     },
  { clave: 'maestro_cognitivo',         nombre: 'Maestro Cognitivo', icono: 'beaker',         categoria: 'logros_mayores', criterio: 'Alcanza 70+ puntos en las 5 dimensiones cognitivas', rareza: 'legendario'},
  { clave: 'nivel_maximo',              nombre: 'Leyenda Viviente',  icono: 'crown',          categoria: 'logros_mayores', criterio: 'Llega al nivel 10 (Leyenda)',                         rareza: 'legendario'},
] as const;

export type BadgeConfig = (typeof BADGE_CONFIG)[number];

export const getBadgeConfig = (clave: string): BadgeConfig | undefined =>
  BADGE_CONFIG.find(b => b.clave === clave) as BadgeConfig | undefined;

// Etiquetas y nombres de ícono para cada categoría (sin emojis)
export const CATEGORIA_LABELS: Record<string, { label: string; icono: string }> = {
  primeros_pasos: { label: 'Primeros Pasos',  icono: 'rocket'     },
  constancia:     { label: 'Constancia',       icono: 'fire'       },
  comprension:    { label: 'Comprensión',      icono: 'light-bulb' },
  exploracion:    { label: 'Exploración',      icono: 'globe'      },
  logros_mayores: { label: 'Logros Mayores',   icono: 'trophy'     },
};

// Colores de rareza
export const RAREZA_COLORS: Record<string, string> = {
  comun:      '#6b8cba',
  raro:       '#3b82f6',
  epico:      '#a855f7',
  legendario: '#d4af37',
};
