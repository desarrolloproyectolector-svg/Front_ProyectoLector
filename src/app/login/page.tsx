'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LoginBook } from '../../components/LoginBook';
import { useAuth } from '../../context/AuthContext';

// Mapa para derivar la ruta home a partir del rol
const ROLE_HOME: Record<string, string> = {
  administrador: '/admin',
  director:      '/escuela',
  maestro:       '/profesor',
  padre:         '/tutor',
  alumno:        '/alumno/store',
};

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized, user } = useAuth();

    // Flag: una vez que revisamos el estado inicial, no volvemos a redirigir desde aquí.
    // Esto evita cortar la animación cuando LoginBook llama a login() y muta isAuthenticated.
    const initialCheckDoneRef = useRef(false);

    useEffect(() => {
        // Solo actuar una vez: cuando el AuthContext termina de leer localStorage
        if (!isInitialized || initialCheckDoneRef.current) return;

        initialCheckDoneRef.current = true;

        // Si ya había sesión activa al llegar (no por un login reciente), redirigir
        if (isAuthenticated && user?.tipoPersona) {
            const tipo = user.tipoPersona.toLowerCase().trim();
            const home = ROLE_HOME[tipo] ?? '/alumno/store';
            router.replace(home);
        }
    }, [isInitialized, isAuthenticated, user, router]);

    // Listener del evento 'bookOpened' que dispara LoginBook tras la animación
    useEffect(() => {
        const handleBookOpened = () => {
            // The book animation takes about 4.5s to trigger this event
            // At this point, the book is dissolved/zoomed.
            // We wait a tiny fraction to ensure avoiding any "blink" before pushing the new route.
            setTimeout(() => {
                // Default redirection to alumno for now
                router.push('/alumno/store');
            }, 100);
        };

        document.addEventListener('bookOpened', handleBookOpened);

        return () => {
            document.removeEventListener('bookOpened', handleBookOpened);
        };
    }, [router]);

    return <LoginBook />;
}
