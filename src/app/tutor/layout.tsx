'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SidebarTutor from '../../components/MenuLateral/SidebarTutor';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes('/hijos')) return { title: 'Mis Hijos', sub: 'Seguimiento académico.' };
    return { title: 'Panel Tutor', sub: 'Resumen educativo.' };
  };

  return (
    <div className="flex min-h-screen">
      <SidebarTutor isOpen={isSidebarOpen} />
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  );
}
