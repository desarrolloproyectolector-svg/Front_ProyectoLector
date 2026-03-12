// ============================================================
// TYPES — Grupos del Director
// src/types/director/grupos/grupo.ts
// ============================================================

// ── Grupo en lista (GET /director/grupos) ────────────────────
export interface GrupoListItem {
    id: number;
    escuelaId: number;
    grado: number;
    nombre: string;
    activo: boolean;
}

// ── Respuesta GET /director/grupos ───────────────────────────
export type GruposListResponse = GrupoListItem[];

// ── DTO Crear grupo (POST /director/grupos) ──────────────────
export interface CreateGrupoDTO {
    grado: number;   // entero ≥ 1
    nombre: string;  // máx. 20 caracteres
}

// ── DTO Actualizar grupo (PATCH /director/grupos/:id) ────────
export interface UpdateGrupoDTO {
    grado?: number;
    nombre?: string;
    activo?: boolean;
}

// ── Filtro local ─────────────────────────────────────────────
export type FiltroGrado = 'todos' | number;