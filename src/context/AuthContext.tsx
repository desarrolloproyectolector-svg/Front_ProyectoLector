'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// ── Tipos ────────────────────────────────────────────────────
export interface AuthUser {
  id?: number | string;
  nombre?: string;
  apellido?: string;
  email?: string;
  tipoPersona?: string;
  escuelaId?: number | string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  /** Etiqueta legible del rol (ej. "maestro" → "Profesor") */
  roleLabel: string;
  /** Nombre completo o fallback */
  displayName: string;
}

// ── Mapa de roles ─────────────────────────────────────────────
const ROLE_MAP: Record<string, string> = {
  administrador: 'Administrador',
  director: 'Director',
  maestro: 'Profesor',
  padre: 'Tutor',
  alumno: 'Estudiante',
};

// ── Context ───────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      // Si algo falla, limpiar por seguridad
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  /** Llamar al hacer login exitoso */
  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    Cookies.set('token', newToken, { expires: 7 });
  };

  /** Llamar al cerrar sesión */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
    router.refresh();
  };

  const tipo = user?.tipoPersona?.toLowerCase().trim() ?? '';
  const roleLabel = ROLE_MAP[tipo] ?? (user?.tipoPersona ?? 'Usuario');
  const displayName =
    [user?.nombre, user?.apellido].filter(Boolean).join(' ').trim() || 'Usuario';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        roleLabel,
        displayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
