'use client';

import { usePathname } from 'next/navigation';
import MenuBase from './MenuBase';

export default function SidebarEscuela({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void; }) {
  return (
    <MenuBase
      isOpen={isOpen}
      role="Escuela"
      menuItems={[
        { href: '/escuela', icon: 'chart', label: 'Dashboard' },
        { href: '/escuela/alumnos', icon: 'users', label: 'Alumnos' },
        { href: '/escuela/compras', icon: 'shopping', label: 'Compras' },
        { href: '/escuela/licencias', icon: 'ticket', label: 'Licencias' },
        { href: '/escuela/grupos', icon: 'calendar', label: 'Grupos' },
        { href: '/escuela/profesores', icon: 'users', label: 'Profesores' },
      ]}
      onClose={onClose}
    />
  );
}