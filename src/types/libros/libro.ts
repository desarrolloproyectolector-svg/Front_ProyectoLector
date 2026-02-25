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

// Tipo para Segmento de Unidad
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

// Tipo para Unidad
export interface LibroUnidad {
    id: number;
    libroId: number;
    nombre: string;
    orden: number;
    segmentos: LibroUnidadSegmento[];
}

// Tipo base para libro en listado
export interface Libro {
    id: number;
    titulo: string;
    codigo: string;
    grado: number;
    descripcion?: string | null;
    estado: 'listo' | 'procesando' | 'error';
    numPaginas: number;
    rutaPdf?: string | null;
    materiaId?: number | null;
    materia?: Materia | null;
    activo?: boolean;
}

// Tipo para detalle de libro (con unidades y segmentos)
export interface LibroDetail extends Libro {
    unidades: LibroUnidad[];
}

// Tipo para crear libro (form data)
export interface CreateLibroDTO {
    titulo: string;
    grado: number;
    descripcion?: string;
    codigo?: string;
    materiaId?: number;
    pdf?: File;
}

// Tipo para respuesta al listar libros
export interface ListLibrosResponse {
    message: string;
    total: number;
    data: Libro[];
}

// Tipo para respuesta al crear/cargar libro
export interface CreateLibroResponse {
    message: string;
    description?: string;
    data: LibroDetail;
}

// Tipo para libro asignado a escuela
export interface LibroEscuela extends Libro {
    fechaInicio?: string;
    fechaFin?: string | null;
    escuelaLibroId?: number;
}

// Tipo para respuesta de libros por escuela
export interface EscuelaLibrosResponse {
    message: string;
    description?: string;
    total: number;
    data: LibroEscuela[];
}

// Tipo para escuelas asociadas a un libro (gestion desde libros)
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

// Respuesta al listar escuelas de un libro
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

// Tipo para libro pendiente de canjear
export interface LibroPendiente extends Libro {
    fechaOtorgado?: string;
    pendienteId?: number;
}

// Tipo para respuesta de libros pendientes
export interface EscuelaLibrosPendientesResponse {
    message: string;
    description?: string;
    total: number;
    data: LibroPendiente[];
}

// Tipo para respuesta al otorgar libro a escuela
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

// Tipo para respuesta al canjear libro
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

// Tipo para asignar libro a escuela
export interface AssignLibroToEscuelaDTO {
    codigo: string;
}

// Tipo para canjear libro
export interface CanjeLibroDTO {
    codigo: string;
}

export interface LibroApiItem {// Tipo base para libro en listado (alternativa) - DEPRECATED
}    api?: LibroApiItem;    sample: string;    synopsis: string;    price: number;    publisher: string;    pages: number;    year: number;    owned: boolean;    progress: number;    coverColor: string;    author: string;    title: string;    id: number;export interface LibraryBook {}


























































}    api?: LibroApiItem;    sample: string;    synopsis: string;    price: number;    publisher: string;    pages: number;    year: number;    owned: boolean;    progress: number;    coverColor: string;    author: string;    title: string;    id: number;export interface LibraryBook {}    materiaId?: number;    codigo?: string;    descripcion?: string;    grado: number;    titulo: string;    pdf: File;export interface CreateLibroDTO {}    unidades: LibroUnidad[];export interface LibroDetail extends LibroApiItem {}    segmentos: LibroUnidadSegmento[];    orden: number;    nombre: string;    libroId: number;    id: number;export interface LibroUnidad {}    idExterno: string;    orden: number;    numeroPagina: number;    contenido: string;    unidadId: number;    libroId: number;    id: number;export interface LibroUnidadSegmento {}    materia?: unknown | null;    materiaId?: number | null;    rutaPdf?: string | null;    numPaginas?: number | null;    estado?: string | null;    codigo?: string | null;    descripcion?: string | null;    grado: number;    titulo: string;    id: number;export interface Libro {
    id: number;
    titulo: string;
    codigo: string;
    grado: number;
    descripcion: string;
    estado: 'listo' | 'procesando' | 'error';
    numPaginas: number;
    materiaId: number | null;
    materia: Materia | null;
}

// Tipo para crear libro (form data)
export interface CreateLibroDTO {
    titulo: string;
    grado: number;
    descripcion?: string;
    codigo?: string;
    materiaId?: number;
}

export interface AssignLibroToEscuelaDTO {
    escuelaId: number;
    codigo: string;
}

// Tipo para respuesta de API - listar libros
export interface ListLibrosResponse {
    message: string;
    total: number;
    data: Libro[];
}

// Tipo para respuesta de API - crear libro
export interface CreateLibroResponse {
    message: string;
    data: {
        id: number;
        titulo: string;
        codigo: string;
        grado: number;
        descripcion: string;
        estado: string;
        numPaginas: number;
        unidades: Unidad[];
    };
}

// Tipo para respuesta de API - ver detalle libro
export interface LibroDetailResponse {
    message: string;
    data: Libro & {
        unidades: Unidad[];
    };
}

// Tipo para unidades (capítulos/bloques)
export interface Unidad {
    id: number;
    numero: number;
    titulo: string;
    segmentos: Segmento[];
}

// Tipo para segmento (contenido dentro de unidad)
export interface Segmento {
    id: number;
    numero: number;
    contenido: string;
}

// Tipo para materia
export interface Materia {
    id: number;
    nombre: string;
}
