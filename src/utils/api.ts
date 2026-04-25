import axios from 'axios';

// Create Axios Instance with Base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.proyectolector.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token if available
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Flag para evitar múltiples redirecciones si varias peticiones fallan con 401 al mismo tiempo
let isRedirecting = false;

// Response Interceptor: Handle Global Errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined' && !isRedirecting) {
            isRedirecting = true;

            // Limpiar toda la sesión
            localStorage.clear();
            sessionStorage.clear();

            // Eliminar cookie del token
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Redirigir al login con un pequeño delay para que el toast alcance a mostrarse
            // (el toast se importa de forma dinámica para no crear dependencia circular)
            import('../utils/toast').then(({ toast }) => {
                toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 4000);
                setTimeout(() => {
                    isRedirecting = false;
                    window.location.href = '/login';
                }, 1500);
            }).catch(() => {
                // Fallback si el toast falla
                window.location.href = '/login';
                isRedirecting = false;
            });
        }
        return Promise.reject(error);
    }
);

export default api;