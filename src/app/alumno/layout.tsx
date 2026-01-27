







'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuLateral } from '../../components/MenuLateral';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Determine current title based on path
    const getTitle = () => {
        if (pathname.includes('/library')) return { title: 'Mi Biblioteca', sub: 'Tus libros y progreso académico.' };
        if (pathname.includes('/store')) return { title: 'Tienda de Libros', sub: 'Explora y descubre nuevo conocimiento.' };
        if (pathname.includes('/redeem')) return { title: 'Canjear Código', sub: 'Activa tus licencias institucionales.' };
        if (pathname.includes('/stats')) return { title: 'Tu Progreso', sub: 'Estadísticas detalladas de aprendizaje.' };
        if (pathname.includes('/schedule')) return { title: 'Horario', sub: 'Próximas clases y lecturas asignadas.' };
        if (pathname.includes('/settings')) return { title: 'Ajustes', sub: 'Configura tu perfil y preferencias.' };
        return { title: 'Panel Principal', sub: 'Bienvenido a tu plataforma.' };
    };

    const currentTitle = getTitle();

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex relative">
            {/* Sidebar */}
            <MenuLateral isOpen={isSidebarOpen} />

            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 bg-[#f5f5f5] min-h-screen transition-all duration-300">

                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        {/* Hamburger */}
                        <button
                            className="md:hidden text-[#2b1b17] p-2 hover:bg-black/5 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>

                        {/* Title */}
                        <div>
                            <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#2b1b17]">{currentTitle.title}</h1>
                            <p className="hidden md:block font-lora text-[#5d4037] italic mt-1 text-sm md:text-base">{currentTitle.sub}</p>
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block relative">
                            <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 rounded-full border border-[#e3dac9] bg-white focus:outline-none focus:border-[#d4af37] w-48 text-sm font-lora" />
                            <svg className="w-4 h-4 text-[#a1887f] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        <button className="relative p-2 text-[#a1887f] hover:text-[#d4af37] transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Sub-page Content */}
                <div className="animate-fade">
                    {children}
                </div>
            </main>
        </div>
    );
}
