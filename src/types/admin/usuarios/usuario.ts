import type { Alumno } from './alumno';
import type { Profesor } from './profesor';
import type { Tutor } from './tutor';
import type { Director } from './director';

// Union type para cualquier tipo de usuario
export type Usuario = Alumno | Profesor | Tutor | Director;

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