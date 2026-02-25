export interface Director {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    telefonoMovil: string;
    gradoAcademico: string;
    aniosExperiencia: number;
    cedulaProfesional: string;
    institucion: string;
    fechaNombramiento: string;
    areaResponsabilidad: 'Director General' | 'Director Académico' | 'Director Administrativo' | 'Subdirector';
    estado: 'activo' | 'inactivo';
    fechaRegistro: string;
}

export interface CreateDirectorDTO {
    nombre: string;
    email: string;
    password?: string; // Añadido para la API
    telefono: string;
    telefonoMovil: string;
    gradoAcademico: string;
    aniosExperiencia: number;
    cedulaProfesional: string;
    institucion: string;
    fechaNombramiento: string;
    areaResponsabilidad: 'Director General' | 'Director Académico' | 'Director Administrativo' | 'Subdirector';
    idEscuela?: number; // Añadido para la API
    fechaNacimiento?: string; // Añadido para la API
}

export interface UpdateDirectorDTO extends Partial<CreateDirectorDTO> {
    id: number;
}

export interface DirectorStats {
    totalDirectores: number;
    directoresActivos: number;
    aniosPromedioExperiencia: number;
}