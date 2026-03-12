// ============================================================
// TYPES — Escuelas (alineados con API real)
// src/types/admin/escuelas/escuela.ts
// ============================================================

// ── Director embebido en la lista ────────────────────────────
export interface DirectorResumen {
    nombre: string;
    apellido: string;
    correo: string;
}

// ── Director completo (viene en GET /escuelas/:id) ───────────
export interface DirectorDetalle {
    id: number;
    personaId: number;
    persona: {
        id: number;
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string | null;
    };
}

// ── Estadísticas embebidas en cada escuela ───────────────────
export interface EscuelaEstadisticas {
    alumnos: number;
    profesores: number;
    grupos: number;
}

// ── Escuela en la tabla (GET /escuelas) ──────────────────────
export interface EscuelaListItem {
    id: number | string;
    nombre: string;
    nivel: string;
    clave: string | null;
    direccion: string | null;
    telefono: string | null;
    estado: 'activa' | 'suspendida' | 'inactiva';
    ciudad: string | null;
    estadoRegion: string | null;
    director?: DirectorResumen | null;
    ubicacion?: {
        ciudad: string | null;
        estadoRegion: string | null;
    };
    estadisticas?: EscuelaEstadisticas;
    directores?: string[];
    alumnosRegistrados?: number;
    profesores?: number;
    grupos?: number;
}

// ── Escuela detalle (GET /escuelas/:id) ──────────────────────
export interface EscuelaDetalle extends Omit<EscuelaListItem, 'director' | 'directores'> {
    directores: DirectorDetalle[];
}

// ── Respuesta GET /escuelas ──────────────────────────────────
export interface EscuelasListResponse {
    message: string;
    description: string;
    total: number;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    data: EscuelaListItem[];
}

// ── Respuesta GET /escuelas/:id ──────────────────────────────
export interface EscuelaDetalleResponse {
    message: string;
    description: string;
    data: EscuelaDetalle;
}

// ── Respuesta GET /escuelas/stats ────────────────────────────
export interface EscuelaStats {
    totalEscuelas: number;
    escuelasActivas: number;
    totalAlumnos: number;
    totalProfesores: number;
    licencias: number;
}

export interface EscuelaStatsResponse {
    message: string;
    data: EscuelaStats;
}

// ── DTO Crear escuela (POST /escuelas) ───────────────────────
export interface CreateEscuelaDTO {
    nombre: string;           // requerido, max 150
    nivel: string;            // requerido, max 50
    clave?: string;           // opcional, max 50
    direccion?: string;       // opcional, max 200
    telefono?: string;        // opcional, max 20
    estado?: 'activa' | 'suspendida' | 'inactiva'; // default: activa
    ciudad?: string;          // opcional, max 100
    estadoRegion?: string;    // opcional, max 100
}

// ── DTO Actualizar escuela (PUT /escuelas/:id) ───────────────
export type UpdateEscuelaDTO = Partial<CreateEscuelaDTO>;

// ── Filtros para el listado ──────────────────────────────────
export interface EscuelaFiltros {
    search?: string;
    estado?: 'activa' | 'suspendida' | 'inactiva';
    page?: number;
    limit?: number;
}

// ── Para el EscuelaSelector (búsqueda rápida) ────────────────
// Mantener compatibilidad con EscuelasService (plural) que usa otro equipo
export interface EscuelaBusqueda {
    id: string | number;
    nombre: string;
    nivel: string;
    clave?: string | null;
    direccion?: string | null;
    telefono?: string | null;
}

export interface EscuelaBusquedaResponse {
    message?: string;
    description?: string;
    total?: number;
    data: EscuelaBusqueda[];
}

// ── Tipo legacy (mantener para no romper EscuelaTable actual) ─
// Usar EscuelaListItem en código nuevo
export type Escuela = EscuelaListItem;