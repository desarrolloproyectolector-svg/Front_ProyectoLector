// utils/toast.ts
// Sistema de notificaciones premium — usa toast.custom() con CustomToast

import { toast as sonnerToast } from 'sonner';
import React from 'react';
import { CustomToast } from '../components/CustomToast';
import type { ToastVariant } from '../components/CustomToast';

// ─── Opciones ────────────────────────────────────────────────────────────────

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

// Soporte para llamadas legadas: toast.success('msg', 6000)
type ToastArg = number | ToastOptions | undefined;

function parseArg(arg: ToastArg): ToastOptions | undefined {
  if (typeof arg === 'number') return { duration: arg };
  return arg;
}

// ─── Helper central ───────────────────────────────────────────────────────────

function show(
  variant: ToastVariant,
  title: string,
  options?: ToastOptions
): string | number {
  const duration = options?.duration ?? (variant === 'loading' ? Infinity : 4500);

  const id = sonnerToast.custom(
    (toastId) => {
      return React.createElement(CustomToast, {
        id: toastId,
        variant,
        title,
        description: options?.description,
        duration,
        action: options?.action,
      });
    },
    { duration, id: undefined }
  );

  return id;
}

// ─── API pública ─────────────────────────────────────────────────────────────

class ToastManager {
  /** Notificación de éxito ✅ */
  success(title: string, arg?: ToastArg): string | number {
    return show('success', title, parseArg(arg));
  }

  /** Notificación de error ❌ */
  error(title: string, arg?: ToastArg): string | number {
    return show('error', title, parseArg(arg));
  }

  /** Notificación de advertencia ⚠️ */
  warning(title: string, arg?: ToastArg): string | number {
    return show('warning', title, parseArg(arg));
  }

  /** Notificación informativa ℹ️ */
  info(title: string, arg?: ToastArg): string | number {
    return show('info', title, parseArg(arg));
  }

  /** Notificación de carga (spinner) ⏳ — retorna ID para actualizar */
  loading(title: string, options?: Omit<ToastOptions, 'duration'>): string | number {
    return show('loading', title, { ...options, duration: Infinity });
  }

  /**
   * Actualiza una notificación existente.
   * Ideal para loading → success/error en operaciones asíncronas.
   */
  update(
    id: string | number,
    variant: Exclude<ToastVariant, 'loading'>,
    title: string,
    options?: ToastOptions
  ) {
    const duration = options?.duration ?? 4500;
    sonnerToast.custom(
      (toastId) => {
        return React.createElement(CustomToast, {
          id: toastId,
          variant,
          title,
          description: options?.description,
          duration,
          action: options?.action,
        });
      },
      { id, duration }
    );
  }

  /**
   * Envuelve una promesa con loading → success/error automático.
   */
  async promise<T>(
    fn: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
    options?: ToastOptions
  ): Promise<T> {
    const id = this.loading(messages.loading, options);
    try {
      const data = await fn;
      const successMsg = typeof messages.success === 'function'
        ? messages.success(data)
        : messages.success;
      this.update(id, 'success', successMsg, options);
      return data;
    } catch (err) {
      const errorMsg = typeof messages.error === 'function'
        ? messages.error(err)
        : messages.error;
      this.update(id, 'error', errorMsg, options);
      throw err;
    }
  }

  /** Cierra un toast por ID */
  dismiss(id?: string | number) {
    sonnerToast.dismiss(id);
  }

  /** Cierra todos los toasts */
  dismissAll() {
    sonnerToast.dismiss();
  }
}

export const toast = new ToastManager();