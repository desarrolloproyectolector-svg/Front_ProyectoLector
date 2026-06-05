// ── Grupos y alumnos (Profesor) ───────────────────────────────────────────

export interface GrupoProfesor {
  id: string;
  nombre: string;
  grado: string;
  seccion: string;
  totalAlumnos: number;
  alumnosPendientesEvaluacion: number;
}

export interface AlumnoGrupo {
  alumnoId: string;
  nombre: string;
  progresoPromedio: number;
  ultimaActividad: string;
  estadoActividad: 'active' | 'warning' | 'alert';
  librosAsignados: number;
  librosCompletados: number;
}

// ── Progreso de un alumno en un libro ─────────────────────────────────────

export interface AlumnoLibroProgreso {
  alumnoId: number;
  nombre: string;
  progreso: number;
  ultimaLectura: string | null;
  segmentosAprobados: number;
  totalSegmentos: number;
  scorePromedio: number;
}

// ── Detalle libro por libro de un alumno ──────────────────────────────────

export interface AlumnoLibroDetalle {
  libroId: number;
  titulo: string;
  autor: string | null;
  materia: { id: number; nombre: string };
  progreso: number;
  ultimoSegmentoId: number | null;
  ultimaLectura: string | null;
  fechaAsignacion: string;
}

// ── Evaluaciones de un alumno agrupadas por libro ─────────────────────────

export interface IntentoEvaluacion {
  segmentoId: number;
  nivelPregunta: string;
  intento: number;
  score: number;
  aprobado: boolean;
  tiposError: string[];
  tiempoRespuestaMs: number;
  fecha: string;
}

export interface AlumnoEvaluaciones {
  libroId: number;
  titulo: string;
  segmentosAprobados: number;
  totalIntentos: number;
  intentos: IntentoEvaluacion[];
}

// ── Dashboard director ────────────────────────────────────────────────────

export interface AgregadosDashboard {
  progresoPromedio: number;
  tiempoTotalMinutos: number;
  porcentajeAprobacion: number;
  evaluacionesRealizadas: number;
}

export interface DashboardDirector {
  escuela: {
    id: number;
    nombre: string;
    nivel: string;
    clave: string;
    direccion: string;
    telefono: string;
  };
  totalEstudiantes: number;
  totalProfesores: number;
  librosDisponibles: number;
  agregados: AgregadosDashboard;
}

// ── Alumno de escuela (Director) ──────────────────────────────────────────

export interface PersonaInfo {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
}

export interface AlumnoEscuela {
  id: string;
  grado: string;
  grupo: string;
  grupoId: string;
  cicloEscolar: string;
  persona: PersonaInfo;
  padre?: {
    parentesco: string;
    persona: Pick<PersonaInfo, 'nombre' | 'correo'>;
  };
}