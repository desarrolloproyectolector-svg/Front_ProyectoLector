'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SidebarEscuela from '../../components/MenuLateral/SidebarEscuela';

export default function EscuelaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes('/grupos')) return { title: 'Grupos', sub: 'Gestión escolar.' };
    return { title: 'Panel Escuela', sub: 'Administración institucional.' };
  };

  return (
    <div className="flex min-h-screen">
      <SidebarEscuela isOpen={isSidebarOpen} />
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  );
}
