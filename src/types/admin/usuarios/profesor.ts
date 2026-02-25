export interface Profesor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    cedulaProfesional: string;
    especialidad: string;
    gradoAcademico: string;
    aniosExperiencia: number;
    gruposAsignados: string[];
    totalAlumnos: number;
    estado: 'activo' | 'inactivo';
    fechaRegistro: string;
}

export interface CreateProfesorDTO {
    nombre: string;
    email: string;
    password?: string; // Añadido para la API
    telefono: string;
    cedulaProfesional: string;
    especialidad: string;
    gradoAcademico: string;
    aniosExperiencia: number;
    gruposAsignados: string[];
    idEscuela?: number; // Añadido para la API
    fechaNacimiento?: string; // Añadido para la API
    fechaIngreso?: string; // Añadido para la API
}

export interface UpdateProfesorDTO extends Partial<CreateProfesorDTO> {
    id: number;
}

export interface ProfesorStats {
    totalProfesores: number;
    profesoresActivos: number;
    totalAlumnosAtendidos: number;
    gruposAsignados: number;
}