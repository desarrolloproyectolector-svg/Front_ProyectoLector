'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SidebarAdmin from '../../components/MenuLateral/SidebarAdmin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes('/usuarios')) return { title: 'Usuarios', sub: 'Gestión general del sistema.' };
    if (pathname.includes('/reportes')) return { title: 'Reportes', sub: 'Estadísticas globales.' };
    return { title: 'Panel Admin', sub: 'Administración del sistema.' };
  };

  const currentTitle = getTitle();

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex relative">

      <SidebarAdmin isOpen={isSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 md:ml-64 p-4 md:p-8">

        <header className="flex justify-between items-center mb-8">
          <button
            className="md:hidden p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-2xl font-bold">{currentTitle.title}</h1>
        </header>

        {children}
      </main>
    </div>
  );
}
