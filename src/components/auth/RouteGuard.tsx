'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
  /** Roles permitidos para esta ruta, ej: ['administrador'] */
  allowedRoles: string[];
}

/**
 * Envuelve el layout de cada sección para:
 * 1. Redirigir a /login si no hay sesión activa.
 * 2. Redirigir a su ruta propia si el rol no coincide con la sección.
 */
export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { isAuthenticated, user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    // Si no está autenticado → login
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const tipoPersona = user?.tipoPersona?.toLowerCase().trim() ?? '';

    // Si el rol no está en los permitidos → redirigir a su home
    if (!allowedRoles.includes(tipoPersona)) {
      router.replace(getRoleHome(tipoPersona));
    }
  }, [isInitialized, isAuthenticated, user, router, allowedRoles]);

  // Mientras valida, no renderizar nada (evita parpadeo de UI y redirecciones erróneas)
  if (!isInitialized || !isAuthenticated) return null;

  const tipoPersona = user?.tipoPersona?.toLowerCase().trim() ?? '';
  if (!allowedRoles.includes(tipoPersona)) return null;

  return <>{children}</>;
}

function getRoleHome(tipoPersona: string): string {
  switch (tipoPersona) {
    case 'administrador': return '/admin';
    case 'director':      return '/escuela';
    case 'maestro':       return '/profesor';
    case 'padre':         return '/tutor';
    case 'alumno':        return '/alumno/store';
    default:              return '/login';
  }
}
