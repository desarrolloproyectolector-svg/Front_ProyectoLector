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
    fechaNacimiento?: string;   // YYYY-MM-DD
    especialidad?: string;
    fechaIngreso?: string;      // YYYY-MM-DD
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
    // idEscuela NO se envía — el backend lo toma del token del director
}

export interface RegistroProfesorResponse {
    message: string;
    description?: string;
    data: {
        id: number;
        nombre: string;
        apellidoPaterno: string;  // ✅ separado
        apellidoMaterno: string;  // ✅ separado
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
// Los apellidos vienen SEPARADOS desde el backend
// ============================================================================

export interface PersonaProfesor {
    id: number;
    nombre: string;
    apellidoPaterno: string;    // ✅ campo separado
    apellidoMaterno: string;    // ✅ campo separado
    correo: string;
    telefono: string | null;
    fechaNacimiento?: string | null;
    genero?: string | null;
    activo?: boolean;
}

export interface ProfesorEscuela {
    id: number;           // ID de la tabla Maestro — usar para PATCH/DELETE
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
// :id = ID del maestro (tabla Maestro), NO el de persona
// El PATCH recibe apellidoPaterno y apellidoMaterno separados
// ============================================================================

export interface ProfesorEditFormData {
    nombre: string;
    apellidoPaterno: string;    // ✅ separado
    apellidoMaterno: string;    // ✅ separado
    correo: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
    activo?: boolean;
}

export interface EditProfesorPayload {
    nombre?: string;
    apellidoPaterno?: string;   // ✅ separado
    apellidoMaterno?: string;   // ✅ separado
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
        apellidoMaterno: string;
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
// ELIMINACIÓN (DELETE /personas/maestros/:id)
// ============================================================================

export interface DeleteProfesorResponse {
    message: string;
    description?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

export const getNombreCompletoProfesor = (profesor: ProfesorEscuela): string =>
    `${profesor.persona.nombre} ${profesor.persona.apellidoPaterno} ${profesor.persona.apellidoMaterno}`.trim();

export const getEstadoProfesor = (profesor: ProfesorEscuela): 'activo' | 'inactivo' =>
    profesor.persona.activo !== false ? 'activo' : 'inactivo';