'use client';

import { usePathname } from 'next/navigation';
import MenuBase from './MenuBase';

export default function SidebarTutor({ isOpen }: { isOpen: boolean }) {
  return (
    <MenuBase
      isOpen={isOpen}
      role="Tutor"
      menuItems={[
        { href: '/tutor', icon: 'library', label: 'Inicio' },
        { href: '/tutor/hijos', icon: 'users', label: 'Mis Hijos' },
      ]}
    />
  );
}