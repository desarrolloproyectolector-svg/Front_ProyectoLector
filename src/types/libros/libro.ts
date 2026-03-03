// ======================================================
// =================== TIPOS BASE =======================
// ======================================================

// Tipo para Materia
export interface Materia {
    id: number;
    nombre: string;
    descripcion?: string | null;
    nivel?: string | null;
}

// Tipo para Pregunta en segmento
export interface Pregunta {
    id: number;
    textoPregunta: string;
    nivel: 'basico' | 'intermedio' | 'avanzado';
    orden: number;
}

// ======================================================
// =================== UNIDADES =========================
// ======================================================

export interface LibroUnidadSegmento {
    id: number;
    libroId: number;
    unidadId: number;
    contenido: string;
    numeroPagina: number;
    orden: number;
    idExterno?: string;
    preguntas?: {
        basico: Pregunta[];
        intermedio: Pregunta[];
        avanzado: Pregunta[];
    };
}

export interface LibroUnidad {
    id: number;
    libroId: number;
    nombre: string;
    orden: number;
    segmentos: LibroUnidadSegmento[];
}

// ======================================================
// =================== LIBRO BASE =======================
// ======================================================

export interface Libro {
    id: number;
    titulo: string;
    codigo: string;
    grado: number;
    descripcion?: string | null; // ← UNIFICADO (evita conflicto)
    estado: 'listo' | 'procesando' | 'error';
    numPaginas: number;
    rutaPdf?: string | null;
    materiaId?: number | null;
    materia?: Materia | null;
    activo?: boolean;
}

// ======================================================
// =================== DETALLE LIBRO ====================
// ======================================================

export interface LibroDetail extends Libro {
    unidades: LibroUnidad[];
}

// ======================================================
// =================== DTOs =============================
// ======================================================

export interface CreateLibroDTO {
    titulo: string;
    grado: number;
    descripcion?: string;
    codigo?: string;
    materiaId?: number;
    pdf?: File;
}

export interface AssignLibroToEscuelaDTO {
    codigo: string;
}

export interface CanjeLibroDTO {
    codigo: string;
}

// ======================================================
// =================== RESPUESTAS API ===================
// ======================================================

export interface ListLibrosResponse {
    message: string;
    total: number;
    data: Libro[];
}

export interface CreateLibroResponse {
    message: string;
    description?: string;
    data: LibroDetail;
}

export interface LibroEscuelasResponse {
    message: string;
    libro: {
        id: number;
        titulo: string;
        codigo: string;
    };
    total: number;
    data: LibroEscuelaAcceso[];
}

export interface EscuelaLibrosResponse {
    message: string;
    description?: string;
    total: number;
    data: LibroEscuela[];
}

export interface EscuelaLibrosPendientesResponse {
    message: string;
    description?: string;
    total: number;
    data: LibroPendiente[];
}

export interface CreateLibroPendienteResponse {
    message: string;
    description?: string;
    data: {
        pendienteId: number;
        escuelaId: number;
        libroId: number;
        codigo: string;
        titulo: string;
        estado: 'pendiente_de_canje';
    };
}

export interface CanjeLibroResponse {
    message: string;
    description?: string;
    data: {
        escuelaLibroId: number;
        escuelaId: number;
        libroId: number;
        codigo: string;
        titulo: string;
        fechaInicio: string;
    };
}

// ======================================================
// =================== RELACIONES =======================
// ======================================================

export interface LibroEscuela extends Libro {
    fechaInicio?: string;
    fechaFin?: string | null;
    escuelaLibroId?: number;
}

export interface LibroEscuelaAcceso {
    escuelaLibroId: number;
    escuelaId: number;
    nombreEscuela: string;
    ciudad?: string | null;
    estadoRegion?: string | null;
    activoEnEscuela: boolean;
    fechaInicio?: string | null;
    fechaFin?: string | null;
}

export interface LibroPendiente extends Libro {
    fechaOtorgado?: string;
    pendienteId?: number;
}

// ======================================================
// =================== TIPOS OPCIONALES =================
// ======================================================

// Si aún usas estos en algún lado del proyecto:
export interface LibroApiItem {
    id: number;
    title: string;
    author: string;
    synopsis: string;
    publisher: string;
    pages: number;
    year: number;
    price: number;
    coverColor: string;
    owned: boolean;
    progress: number;
    sample: string;
}

export interface LibraryBook {
    id: number;
    title: string;
    author: string;
}