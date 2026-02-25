export interface Tutor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    parentesco: string;
    ocupacion: string;
    telefonoEmergencia: string;
    alumnosAsociados: string[];
    estado: 'activo' | 'inactivo';
    fechaRegistro: string;
}

export interface CreateTutorDTO {
    nombre: string;
    email: string;
    password?: string; // Añadido para la API
    telefono: string;
    direccion: string;
    parentesco: string;
    ocupacion: string;
    telefonoEmergencia: string;
    fechaNacimiento?: string; // Añadido para la API
}

export interface UpdateTutorDTO extends Partial<CreateTutorDTO> {
    id: number;
}

export interface TutorStats {
    totalTutores: number;
    tutoresActivos: number;
    alumnosAsociados: number;
}