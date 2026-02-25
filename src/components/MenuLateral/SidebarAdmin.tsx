'use client';

import { usePathname } from 'next/navigation';
import MenuBase from './MenuBase';

export default function SidebarAdmin({ isOpen }: { isOpen: boolean }) {
  return (
    <MenuBase
      isOpen={isOpen}
      role="Administrador"
      menuItems={[
        { href: '/admin', icon: 'chart', label: 'Dashboard' },
        { href: '/admin/escuelas', icon: 'library', label: 'Escuelas' },
        { href: '/admin/usuarios', icon: 'users', label: 'Usuarios' },
        { href: '/admin/libros', icon: 'library', label: 'Libros' },
      ]}
    />
  );
}