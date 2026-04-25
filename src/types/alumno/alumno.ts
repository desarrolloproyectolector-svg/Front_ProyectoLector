export interface PreferenciasAlumno {
    ocultarTutorialLector: boolean;
    temaLector: 'sepia' | 'oscuro' | 'claro';
    idioma: string;
}

export interface EstadisticasAlumno {
    librosLeidos: number;
    librosEnProgreso: number;
    tiempoTotalMinutos: number;
    tiempoEsteMesMinutos: number;
    promedioEvaluaciones: number;
    rachaActualDias: number;
    rachaMaximaDias: number;
    segmentosCompletados: number;
    anotacionesTotales: number;
    ultimaActividad: string;
}
