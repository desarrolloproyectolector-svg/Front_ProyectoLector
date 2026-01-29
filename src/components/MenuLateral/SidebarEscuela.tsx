'use client';

import { usePathname } from 'next/navigation';
import MenuBase from './MenuBase';

export default function SidebarEscuela({ isOpen }: { isOpen: boolean }) {
  return (
    <MenuBase
      isOpen={isOpen}
      role="Escuela"
      menuItems={[
        { href: '/escuela', icon: 'library', label: 'Inicio' },
        { href: '/escuela/grupos', icon: 'calendar', label: 'Grupos' },
      ]}
    />
  );
}