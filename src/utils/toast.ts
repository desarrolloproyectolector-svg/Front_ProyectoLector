// utils/toast.ts

/**
 * Sistema simple de notificaciones toast
 * Compatible con el diseño de tu aplicación
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    type: ToastType;
    message: string;
    duration?: number;
}

class ToastManager {
    private container: HTMLDivElement | null = null;

    private ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
        return this.container;
    }

    private getToastStyles(type: ToastType): string {
        const baseStyles = `
            pointer-events: auto;
            min-width: 300px;
            max-width: 500px;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Lora', serif;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
            backdrop-filter: blur(10px);
        `;

        const typeStyles: Record<ToastType, string> = {
            success: `
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `,
            error: `
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `,
            warning: `
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `,
            info: `
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `,
        };

        return baseStyles + typeStyles[type];
    }

    private getIcon(type: ToastType): string {
        const icons: Record<ToastType, string> = {
            success: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
            error: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
            warning: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `,
            info: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `,
        };
        return icons[type];
    }

    show({ type, message, duration = 4000 }: ToastOptions) {
        const container = this.ensureContainer();
        
        const toast = document.createElement('div');
        toast.style.cssText = this.getToastStyles(type);
        
        toast.innerHTML = `
            <div style="flex-shrink: 0;">
                ${this.getIcon(type)}
            </div>
            <div style="flex: 1; font-weight: 500;">
                ${message}
            </div>
            <button 
                style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 6px;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'"
                onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        // Añadir animación de entrada
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Botón de cerrar
        const closeBtn = toast.querySelector('button');
        const remove = () => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                container.removeChild(toast);
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                    this.container = null;
                }
            }, 300);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', remove);
        }

        container.appendChild(toast);

        // Auto-remove después de duration
        if (duration > 0) {
            setTimeout(remove, duration);
        }
    }

    success(message: string, duration?: number) {
        this.show({ type: 'success', message, duration });
    }

    error(message: string, duration?: number) {
        this.show({ type: 'error', message, duration });
    }

    warning(message: string, duration?: number) {
        this.show({ type: 'warning', message, duration });
    }

    info(message: string, duration?: number) {
        this.show({ type: 'info', message, duration });
    }
}

// Exportar instancia única
export const toast = new ToastManager();