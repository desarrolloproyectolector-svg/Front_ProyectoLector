'use client';

import { usePathname } from 'next/navigation';
import MenuBase from './MenuBase';

export default function SidebarProfesor({ isOpen }: { isOpen: boolean }) {
  return (
    <MenuBase
      isOpen={isOpen}
      role="Profesor"
      menuItems={[
        { href: '/profesor', icon: 'library', label: 'Inicio' },
      ]}
    />
  );
}