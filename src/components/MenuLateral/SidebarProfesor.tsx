'use client';

import MenuBase from './MenuBase';

export default function SidebarProfesor({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void; }) {
  return (
    <MenuBase
      isOpen={isOpen}
      role="Profesor"
      menuItems={[
        { href: '/profesor', icon: 'library', label: 'Inicio' },
      ]}
      onClose={onClose}
    />
  );
}