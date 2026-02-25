'use client';

import React from 'react';

type UserRole = 'alumno' | 'profesor' | 'tutor' | 'director' | null;

interface RoleSelectorProps {
    selectedRole: UserRole;
    onRoleChange: (role: UserRole) => void;
    error?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
    selectedRole,
    onRoleChange,
    error
}) => {
    const roles = [
        {
            id: 'alumno' as const,
            name: 'Alumno',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            hoverColor: 'hover:border-blue-500'
        },
        {
            id: 'profesor' as const,
            name: 'Profesor',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            hoverColor: 'hover:border-purple-500'
        },
        {
            id: 'tutor' as const,
            name: 'Tutor',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            ),
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            hoverColor: 'hover:border-emerald-500'
        },
        {
            id: 'director' as const,
            name: 'Director',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
            ),
            color: 'from-[#d4af37] to-[#c19a2e]',
            bgColor: 'bg-[#fbf8f1]',
            borderColor: 'border-[#d4af37]/30',
            hoverColor: 'hover:border-[#d4af37]'
        }
    ];

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => onRoleChange(role.id)}
                        className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                            selectedRole === role.id
                                ? `${role.bgColor} ${role.borderColor} shadow-lg scale-105`
                                : `bg-white border-[#e3dac9] ${role.hoverColor} hover:shadow-md`
                        }`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${role.color} text-white shadow-md ${
                                selectedRole === role.id ? 'scale-110' : 'group-hover:scale-105'
                            } transition-transform duration-300`}>
                                {role.icon}
                            </div>
                            <span className={`font-bold text-sm ${
                                selectedRole === role.id ? 'text-[#2b1b17]' : 'text-[#5d4037]'
                            }`}>
                                {role.name}
                            </span>
                        </div>

                        {selectedRole === role.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};