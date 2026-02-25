import type { Alumno } from './admin/usuarios/alumno';
import type { Profesor } from './admin/usuarios/profesor';
import type { Tutor } from './admin/usuarios/tutor';
import type { Director } from './admin/usuarios/director';

// Union type para cualquier tipo de usuario
export type UsuarioTipo = Alumno | Profesor | Tutor | Director;

// Tipo para el rol de usuario
export type UserRole = 'alumno' | 'profesor' | 'tutor' | 'director';

// Interfaz base que comparten todos los usuarios
export interface UsuarioBase {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    estado: 'activo' | 'inactivo';
    fechaRegistro: string;
}

// Estadísticas generales de usuarios
export interface UsuarioStats {
    totalUsuarios: number;
    totalAlumnos: number;
    totalProfesores: number;
    totalTutores: number;
    totalDirectores: number;
    usuariosActivos: number;
    usuariosInactivos: number;
}

// Filtros para usuarios
export interface UsuarioFilters {
    role?: UserRole | 'todos';
    estado?: 'activo' | 'inactivo' | 'todos';
    searchTerm?: string;
    grupo?: string;
    especialidad?: string;
}

// Para la tabla de usuarios (vista simplificada)
export interface UsuarioListItem {
    id: number;
    nombre: string;
    email: string;
    role: UserRole;
    telefono: string;
    estado: 'activo' | 'inactivo';
    fechaRegistro: string;
}

// ==========================================
// INTERFACES PARA LA API DE ADMIN
// ==========================================

/**
 * Tipo de persona/rol en el sistema según la API
 */
export type TipoPersona = 'administrador' | 'director' | 'maestro' | 'alumno' | 'padre';

/**
 * Usuario retornado por la API
 * GET /admin/usuarios
 */
export interface Usuario {
    id: number;
    nombre: string;
    apellido: string; 
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    correo: string;
    telefono: string | null;
    tipoPersona: TipoPersona;
    activo: boolean;
    rolId: number;
    escuela?: {
        id: number;
        nombre: string;
        nivel: string;
    };
}

/**
 * Totales por rol
 */
export interface TotalesPorRol {
    administrador: number;
    director: number;
    maestro: number;
    alumno: number;
    padre: number;
    total: number;
}

/**
 * Respuesta del endpoint GET /admin/usuarios
 */
export interface UsuariosResponse {
    message: string;
    totalesPorRol: TotalesPorRol;
    total: number;
    data: Usuario[];
}

/**
 * Mapeo de tipoPersona a rol de UI
 */
export const mapTipoPersonaToRole = (tipoPersona: TipoPersona): 'alumno' | 'profesor' | 'tutor' | 'director' => {
    const mapping: Record<TipoPersona, 'alumno' | 'profesor' | 'tutor' | 'director'> = {
        'administrador': 'director', // Mostrar como director en UI
        'director': 'director',
        'maestro': 'profesor',
        'alumno': 'alumno',
        'padre': 'tutor'
    };
    return mapping[tipoPersona];
};

/**
 * Obtener nombre completo del usuario de la API
 */
export const getNombreCompleto = (usuario: Usuario): string => {
    return `${usuario.nombre} ${usuario.apellido}`.trim();
};