// Expresión regular robusta para validar correos electrónicos
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Verifica si un texto contiene MAYÚSCULAS
export const hasUppercase = (str: string): boolean => {
    return /[A-Z]/.test(str);
};

// Saneamiento de textos básicos (quita espacios dobles y a los extremos)
export const sanitizeText = (text: string): string => {
    return text.trim().replace(/\s+/g, ' ');
};

// Sanamiento de email (sin espacios y en minúsculas)
export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

// Interfaz para el estado de validación de un formulario
export interface ValidationState {
    isValid: boolean;
    errors: Record<string, string>;
}

// Función auxiliar para enfocar el primer elemento con error en el formulario
export const focusFirstError = (errors: Record<string, string | undefined>) => {
    // Buscar la primer llave que tenga un error
    const firstErrorKey = Object.keys(errors).find(key => !!errors[key]);
    if (firstErrorKey) {
        // Encontrar el elemento por su atributo 'name'
        const element = document.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement;
        if (element) {
            // Intentar scrollear suavemente y enfocar
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Necesitamos un pequeño timeout porque scrollIntoView puede interferir con focus
            setTimeout(() => element.focus({ preventScroll: true }), 100);
        }
    }
};
