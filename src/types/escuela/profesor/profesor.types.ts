// types/escuela/profesores/profesor.types.ts

// ============================================================================
// REGISTRO (POST /personas/registro-maestro)
// ============================================================================

export interface ProfesorFormData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    password: string;
    telefono?: string;
    fechaNacimiento?: string;
    especialidad?: string;
    fechaIngreso?: string;
}

export interface RegistroProfesorPayload {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    password: string;
    telefono?: string;
    fechaNacimiento?: string;
    especialidad?: string;
    fechaIngreso?: string;
}

export interface RegistroProfesorResponse {
    message: string;
    description?: string;
    data: {
        id: number;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        correo: string;
        telefono: string | null;
        fechaNacimiento: string | null;
        genero: string | null;
        activo: boolean;
        maestro: {
            id: number;
            personaId: number;
            escuelaId: number;
            especialidad: string | null;
            fechaIngreso: string | null;
            escuela: {
                id: number;
                nombre: string;
                nivel: string;
            };
        };
    };
}

export interface ProfesorFormErrors {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    email?: string;
    password?: string;
    telefono?: string;
    fechaNacimiento?: string;
    especialidad?: string;
    fechaIngreso?: string;
}

// ============================================================================
// LISTADO (GET /escuelas/:id/maestros)
// ============================================================================

export interface PersonaProfesor {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
    correo: string;
    telefono: string | null;
    fechaNacimiento?: string | null;
    genero?: string | null;
    activo?: boolean;
}

export interface ProfesorEscuela {
    id: number;
    personaId: number;
    escuelaId: number;
    especialidad: string | null;
    fechaIngreso: string | null;
    persona: PersonaProfesor;
    gruposAsignados?: string[];
    alumnosTotales?: number;
}

export interface ProfesoresResponse {
    message: string;
    description?: string;
    total?: number;
    data: ProfesorEscuela[];
}

// ============================================================================
// EDICIÓN (PATCH /personas/maestros/:id)
// ============================================================================

export interface ProfesorEditFormData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
    activo?: boolean;
}

export interface EditProfesorPayload {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string | null;  // ✅ null permitido para borrar el valor
    correo?: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
    activo?: boolean;
}

export interface EditProfesorResponse {
    message: string;
    data: {
        id: number;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        correo: string;
        telefono: string | null;
        fechaNacimiento: string | null;
        genero: string | null;
        activo: boolean;
    };
}

export interface ProfesorEditFormErrors {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    correo?: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
}

// ============================================================================
// ELIMINACIÓN
// ============================================================================

export interface DeleteProfesorResponse {
    message: string;
    description?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

export const getNombreCompletoProfesor = (profesor: ProfesorEscuela): string => {
    const mat = profesor.persona.apellidoMaterno ? ` ${profesor.persona.apellidoMaterno}` : '';
    return `${profesor.persona.nombre} ${profesor.persona.apellidoPaterno}${mat}`.trim();
};

export const getEstadoProfesor = (profesor: ProfesorEscuela): 'activo' | 'inactivo' =>
    profesor.persona.activo !== false ? 'activo' : 'inactivo';