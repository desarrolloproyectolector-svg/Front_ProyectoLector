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
    password?: string; // Añadido para la API
    telefono: string;
    fechaNacimiento: string;
    matricula: string;
    grupo: string;
    nombreTutor: string;
    telefonoTutor: string;
    idEscuela?: number; // Añadido para la API
    grado?: string; // Añadido para la API
    cicloEscolar?: string; // Añadido para la API
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

// Interfaz para separar el nombre completo
export interface NombreCompleto {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
}

// Función auxiliar para dividir nombre completo
export function dividirNombreCompleto(nombreCompleto: string): NombreCompleto {
    const partes = nombreCompleto.trim().split(' ');
    
    if (partes.length === 1) {
        return {
            nombre: partes[0],
            apellidoPaterno: '',
            apellidoMaterno: ''
        };
    } else if (partes.length === 2) {
        return {
            nombre: partes[0],
            apellidoPaterno: partes[1],
            apellidoMaterno: ''
        };
    } else {
        return {
            nombre: partes[0],
            apellidoPaterno: partes[1],
            apellidoMaterno: partes.slice(2).join(' ')
        };
    }
}

// ==========================================
// INTERFACES PARA BÚSQUEDA DE ALUMNOS (API)
// ==========================================

/**
 * Interfaz para un alumno retornado por la búsqueda de la API
 * Endpoint: GET /personas/alumnos/buscar
 * 
 * IMPORTANTE: La API devuelve "apellido" en lugar de "apellidoPaterno" y "apellidoMaterno"
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
        apellido: string;  // ⚠️ La API devuelve "apellido" (un solo campo)
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
            apellido: string;
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
 * La API devuelve "apellido" como un solo campo
 */
export function getNombreCompletoAlumno(alumno: AlumnoBusqueda): string {
    const { nombre, apellido } = alumno.persona;
    return `${nombre} ${apellido}`.trim();
}