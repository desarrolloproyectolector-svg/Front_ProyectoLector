export interface Alumno {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
    matricula: string;
    grupo: string;
    nombreTutor: string;
    telefonoTutor: string;
    librosActivos: number;
    progreso: number;
    estado: 'activo' | 'inactivo';
    fechaRegistro: string;
}

export interface CreateAlumnoDTO {
    nombre: string;
    email: string;
    password?: string;
    telefono: string;
    fechaNacimiento: string;
    matricula: string;
    grupo: string;
    nombreTutor: string;
    telefonoTutor: string;
    idEscuela?: number;
    grado?: string;
    cicloEscolar?: string;
}

export interface UpdateAlumnoDTO extends Partial<CreateAlumnoDTO> {
    id: number;
}

export interface AlumnoStats {
    totalAlumnos: number;
    alumnosActivos: number;
    promedioProgreso: number;
    totalLibrosActivos: number;
}

// ==========================================
// INTERFACES PARA BÚSQUEDA DE ALUMNOS (API)
// ==========================================

/**
 * Interfaz para un alumno retornado por la búsqueda de la API
 * Endpoint: GET /personas/alumnos/buscar
 */
export interface AlumnoBusqueda {
    id: string | number;
    personaId: string | number;
    escuelaId: string | number;
    padreId?: string | number | null;
    grado: string;
    grupo: string | null;
    cicloEscolar: string | null;
    persona: {
        id: string | number;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        correo: string;
        telefono?: string;
    };
    escuela: {
        id: string | number;
        nombre: string;
        nivel: string;
    };
    padre?: {
        id: string | number;
        parentesco: string | null;
        persona: {
            id: string | number;
            nombre: string;
            apellidoPaterno: string;
            apellidoMaterno: string | null;
            correo: string;
            telefono?: string;
        };
    } | null;
}

/**
 * Interfaz para la respuesta completa de búsqueda
 */
export interface AlumnoBusquedaResponse {
    message: string;
    description: string;
    total: number;
    data: AlumnoBusqueda[];
}

/**
 * Parámetros para búsqueda de alumnos
 */
export interface AlumnoBusquedaParams {
    campo: 'nombre' | 'apellido' | 'correo' | 'telefono' | 'grado' | 'grupo' | 'cicloEscolar' | 'escuelaId';
    valor: string;
    escuelaId?: number;
    page?: number;
    limit?: number;
}

/**
 * Función auxiliar para obtener el nombre completo de un alumno de búsqueda
 */
export function getNombreCompletoAlumno(alumno: AlumnoBusqueda): string {
    const { nombre, apellidoPaterno, apellidoMaterno } = alumno.persona;
    return `${nombre} ${apellidoPaterno} ${apellidoMaterno ?? ''}`.trim();
}