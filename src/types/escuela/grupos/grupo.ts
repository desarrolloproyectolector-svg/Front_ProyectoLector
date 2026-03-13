// ============================================================
// TYPES — Grupos del Director
// src/types/director/grupos/grupo.ts
// ============================================================

// ── Maestro embebido en cada grupo ───────────────────────────
export interface MaestroEnGrupo {
    id: number;
    personaId: number;
    nombre: string;
    correo: string;
}

// ── Maestro en lista (GET /director/maestros) ────────────────
export interface MaestroListItem {
    id: number;
    personaId: number;
    nombre: string;
    correo: string;
}

export type MaestrosListResponse = MaestroListItem[];

// ── Grupo en lista (GET /director/grupos) ────────────────────
export interface GrupoListItem {
    id: number;
    escuelaId: number;
    grado: number;
    nombre: string;
    activo: boolean;
    maestros: MaestroEnGrupo[];
    alumnos?: string[];
}

export type GruposListResponse = GrupoListItem[];

// ── DTO Crear grupo (POST /director/grupos) ──────────────────
export interface CreateGrupoDTO {
    grado: number;
    nombre: string;
}

// ── DTO Actualizar grupo (PATCH /director/grupos/:id) ────────
export interface UpdateGrupoDTO {
    grado?: number;
    nombre?: string;
    activo?: boolean;
    maestroIds?: number[]; // [] quita todos, [5] asigna maestro con id 5
}

// ── DTO Asignar maestro a grupo ──────────────────────────────
export interface AsignarGrupoDTO {
    maestroId: number;
    grupoId: number;
}

// ── Filtro local ─────────────────────────────────────────────
export type FiltroGrado = 'todos' | number;