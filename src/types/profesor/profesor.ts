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
