export interface Licencia {
    id: number;
    clave: string;
    libroId: number;
    titulo: string;
    escuelaId: number;
    nombreEscuela: string;
    alumnoId: number | null;
    alumno: string | null;
    fechaVencimiento: string;
    activa: boolean;
    estado: 'disponible' | 'usada' | 'vencida';
    fechaAsignacion: string | null;
    createdAt: string;
}

export interface CrearLicenciasDto {
    escuelaId: number;
    libroId: number;
    cantidad: number;
    fechaVencimiento: string;
}

export interface CanjearLicenciaDto {
    clave: string;
}

export interface FiltrosLicencia {
    escuelaId?: number;
    libroId?: number;
    estado?: 'disponible' | 'usada' | 'vencida';
    page?: number;
    limit?: number;
}

export interface LicenciaTotales {
    escuelaId: number;
    total: number;
    disponibles: number;
    enUso: number;
    vencidas: number;
    porLibro: {
        libroId: number;
        titulo: string;
        total: number;
        disponibles: number;
        enUso: number;
        vencidas: number;
    }[];
}
