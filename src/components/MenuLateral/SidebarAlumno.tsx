'use client';
import { usePathname } from 'next/navigation';
import MenuBase from './MenuBase';

interface Props {
  isOpen: boolean;
}

export default function SidebarAlumno({ isOpen }: Props) {
  const menuItems = [
    {
      label: 'Mi Biblioteca',
      href: '/alumno/library',
      icon: 'library',
    },
    {
      label: 'Tienda',
      href: '/alumno/store',
      icon: 'store',
    },
    {
      label: 'Canjear Código',
      href: '/alumno/redeem',
      icon: 'ticket',
    },
    {
      label: 'Progreso',
      href: '/alumno/stats',
      icon: 'chart',
    },
    {
      label: 'Horario',
      href: '/alumno/schedule',
      icon: 'calendar',
    },
    {
      label: 'Ajustes',
      href: '/alumno/settings',
      icon: 'settings',
    },
  ];

  return (
    <MenuBase
      isOpen={isOpen}
      role="Estudiante"
      menuItems={menuItems}
      userName="Usuario"
      userClass="Clase A-1"
    />
  );
}