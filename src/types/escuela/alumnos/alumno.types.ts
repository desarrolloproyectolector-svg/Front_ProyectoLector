// types/escuela/alumnos/alumno.types.ts

/**
 * TIPOS CONSOLIDADOS PARA GESTIÓN DE ALUMNOS
 * Incluye tipos para: Registro, Edición, Eliminación y Listado
 */

// ============================================================================
// TIPOS PARA REGISTRO DE ALUMNO (POST /personas/registro-alumno)
// ============================================================================

/**
 * Datos del formulario de registro de alumno
 */
export interface AlumnoFormData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    password: string;
    telefono?: string;
    fechaNacimiento?: string; // YYYY-MM-DD
    grado?: number;
    grupo?: string; // Solo la letra: "A", "B", "C"
    cicloEscolar?: string; // Ej: "2024-2025"
}

/**
 * Payload que se envía a la API para registrar alumno
 */
export interface RegistroAlumnoPayload {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    password: string;
    telefono?: string;
    fechaNacimiento?: string;
    grado?: number;
    grupo?: string;
    cicloEscolar?: string;
    // idEscuela NO se envía - se toma del token
}

/**
 * Estructura de la respuesta de la API al registrar alumno
 */
export interface RegistroAlumnoResponse {
    message: string;
    description: string;
    data: {
        id: number;
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string | null;
        fechaNacimiento: string | null;
        genero: string | null;
        alumno: {
            id: number;
            personaId: number;
            escuelaId: number;
            grado: number | null;
            grupo: string | null;
            cicloEscolar: string | null;
            escuela: {
                id: number;
                nombre: string;
                nivel: string;
            };
        };
    };
}

/**
 * Errores de validación del formulario de registro
 */
export interface AlumnoFormErrors {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    email?: string;
    password?: string;
    telefono?: string;
    fechaNacimiento?: string;
    grado?: string;
    grupo?: string;
    cicloEscolar?: string;
}

// ============================================================================
// TIPOS PARA LISTADO DE ALUMNOS (GET /director/alumnos)
// ============================================================================

/**
 * Estructura de una persona (datos básicos del alumno)
 */
export interface PersonaAlumno {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    fechaNacimiento?: string | null;
    genero?: string | null;
}

/**
 * Estructura del padre/tutor del alumno
 */
export interface PadreAlumno {
    id: number;
    parentesco: string;
    persona: {
        id: number;
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string | null;
    };
}

/**
 * Estructura completa de un alumno según GET /director/alumnos
 */
export interface AlumnoEscuela {
    id: number;
    personaId: number;
    escuelaId: number;
    padreId: number | null;
    grado: number | null;
    grupo: string | null;
    cicloEscolar: string | null;
    persona: PersonaAlumno;
    padre: PadreAlumno | null;
}

/**
 * Respuesta de GET /director/alumnos
 */
export interface AlumnosResponse {
    message: string;
    description: string;
    total: number;
    data: AlumnoEscuela[];
}

// ============================================================================
// TIPOS PARA EDICIÓN DE ALUMNO (PATCH /personas/alumnos/:id)
// ============================================================================

/**
 * Datos para el formulario de edición de alumno
 */
export interface AlumnoEditFormData {
    nombre: string;
    apellido: string; // Apellido completo
    correo: string;
    telefono?: string;
    fechaNacimiento?: string; // YYYY-MM-DD
    genero?: string;
    password?: string; // Nueva contraseña (opcional)
    grado?: number;
    grupo?: string;
    cicloEscolar?: string;
}

/**
 * Payload para PATCH /personas/alumnos/:id
 */
export interface EditAlumnoPayload {
    nombre?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
    activo?: boolean;
}

/**
 * Respuesta de PATCH /personas/alumnos/:id
 */
export interface EditAlumnoResponse {
    message: string;
    data: {
        id: number;
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string | null;
        fechaNacimiento: string | null;
        genero: string | null;
        tipoPersona: string;
        activo: boolean;
        alumno: {
            id: number;
            personaId: number;
            escuelaId: number;
            grado: number | null;
            grupo: string | null;
            cicloEscolar: string | null;
        };
    };
}

/**
 * Errores de validación del formulario de edición
 */
export interface AlumnoEditFormErrors {
    nombre?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
}

// ============================================================================
// TIPOS PARA ELIMINACIÓN DE ALUMNO (DELETE /personas/alumnos/:id)
// ============================================================================

/**
 * Respuesta de DELETE /personas/alumnos/:id
 */
export interface DeleteAlumnoResponse {
    message: string;
    description: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper para obtener el nombre completo del alumno
 */
export const getNombreCompletoAlumno = (alumno: AlumnoEscuela): string => {
    return `${alumno.persona.nombre} ${alumno.persona.apellido}`.trim();
};

/**
 * Helper para formatear el grupo (ej: "5-A")
 */
export const formatGrupo = (grado: number | null, grupo: string | null): string => {
    if (!grado || !grupo) return 'Sin asignar';
    return `${grado}-${grupo}`;
};