'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SidebarProfesor from '../../components/MenuLateral/SidebarProfesor';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes('/alumnos')) return { title: 'Mis Alumnos', sub: 'Gestión académica.' };
    if (pathname.includes('/horario')) return { title: 'Horario', sub: 'Clases asignadas.' };
    return { title: 'Panel Profesor', sub: 'Bienvenido profesor.' };
  };

  const currentTitle = getTitle();

  return (
    <div className="min-h-screen flex">

      <SidebarProfesor isOpen={isSidebarOpen} />

      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">{currentTitle.title}</h1>
        {children}
      </main>
    </div>
  );
}
