// types/escuela/alumnos/alumno.types.ts

// ============================================================================
// TIPOS PARA REGISTRO DE ALUMNO (POST /personas/registro-alumno)
// ============================================================================

export interface AlumnoFormData {
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
}

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
}

export interface RegistroAlumnoResponse {
    message: string;
    description: string;
    data: {
        id: number;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
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

export interface PersonaAlumno {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
    correo: string;
    telefono: string | null;
    fechaNacimiento?: string | null;
    genero?: string | null;
}

export interface PadreAlumno {
    id: number;
    parentesco: string;
    persona: {
        id: number;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        correo: string;
        telefono: string | null;
    };
}

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

export interface AlumnosResponse {
    message: string;
    description: string;
    total: number;
    data: AlumnoEscuela[];
}

// ============================================================================
// TIPOS PARA EDICIÓN DE ALUMNO (PATCH /personas/alumnos/:id)
// ============================================================================

export interface AlumnoEditFormData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
    grado?: number;
    grupo?: string;
    cicloEscolar?: string;
}

export interface EditAlumnoPayload {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string | null;
    correo?: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: string;
    password?: string;
    activo?: boolean;
}

export interface EditAlumnoResponse {
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

export interface AlumnoEditFormErrors {
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
// TIPOS PARA ELIMINACIÓN DE ALUMNO
// ============================================================================

export interface DeleteAlumnoResponse {
    message: string;
    description: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getNombreCompletoAlumno = (alumno: AlumnoEscuela): string => {
    const mat = alumno.persona.apellidoMaterno ? ` ${alumno.persona.apellidoMaterno}` : '';
    return `${alumno.persona.nombre} ${alumno.persona.apellidoPaterno}${mat}`.trim();
};

export const formatGrupo = (grado: number | null, grupo: string | null): string => {
    if (!grado || !grupo) return 'Sin asignar';
    return `${grado}-${grupo}`;
};