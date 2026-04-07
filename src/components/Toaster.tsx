'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toaster global — usa toast.custom() con CustomToast,
 * así que NO necesitamos estilos de Sonner (theme="system" deshabilitado).
 * Configuramos solo posición, gap y z-index.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      visibleToasts={5}
      gap={10}
      toastOptions={{
        unstyled: true,
        style: { all: 'unset' },
      }}
    />
  );
}
