'use client';

import { usePathname } from 'next/navigation';
import MenuBase from './MenuBase';

export default function SidebarTutor({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void; }) {
  return (
    <MenuBase
      isOpen={isOpen}
      role="Tutor"
      menuItems={[
        { href: '/tutor', icon: 'library', label: 'Dashboard Familiar' },
      ]}
      onClose={onClose}
    />
  );
}