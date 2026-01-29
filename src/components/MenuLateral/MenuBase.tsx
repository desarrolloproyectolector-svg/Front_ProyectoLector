'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement } from 'react';

interface MenuItem {
  href: string;
  label: string;
  icon: string;
}

interface MenuBaseProps {
  isOpen: boolean;
  role: string;
  menuItems: MenuItem[];
  userName?: string;
  userClass?: string;
}

export default function MenuBase({
  isOpen,
  role,
  menuItems,
  userName = 'Usuario',
  userClass = 'Clase A-1',
}: MenuBaseProps) {
  const pathname = usePathname();

  // -------------------------
  // ICON RENDERER
  // -------------------------
  const renderIcon = (iconName: string): ReactElement => {
    const iconProps = {
      className: 'w-6 h-6',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    };

    const icons: Record<string, ReactElement> = {
      library: (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),

      chart: (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),

      users: (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),

      settings: (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),

      book: (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    };

    return icons[iconName] || icons.book;
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 bg-[#2b1b17] text-[#f0e6d2] flex flex-col py-8 shadow-2xl z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Logo */}
      <div className="mb-10 px-6">
        <span className="text-[#d4af37] font-bold tracking-widest text-xl">
          ACADEMIA
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#d4af37]/10 text-[#d4af37]'
                  : 'text-[#a1887f] hover:bg-[#d4af37]/5 hover:text-[#f0e6d2]'
              }`}
            >
              <div className="w-6 h-6">{renderIcon(item.icon)}</div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="mt-auto px-4 py-6 border-t border-[#4e342e]">
        <p className="text-sm font-semibold">{userName}</p>
        <p className="text-xs text-[#a1887f]">{userClass}</p>
      </div>
    </aside>
  );
}
