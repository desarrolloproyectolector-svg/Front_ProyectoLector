import axios from 'axios';

// Create Axios Instance with Base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://freeborn-oliva-cotemporaneously.ngrok-free.dev/',
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

// Response Interceptor: Handle Global Errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Auto-logout logic
            if (typeof window !== 'undefined') {
                // localStorage.removeItem('token');
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
