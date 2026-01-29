'use client';

import { useState } from 'react';

export default function AdminPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const stats = [
        { label: 'Escuelas Activas', value: '24', change: '+3', icon: 'school' },
        { label: 'Total Estudiantes', value: '3,847', change: '+156', icon: 'users' },
        { label: 'Profesores', value: '286', change: '+12', icon: 'teacher' },
        { label: 'Libros Disponibles', value: '1,245', change: '+89', icon: 'book' },
    ];

    const recentSchools = [
        { name: 'Preparatoria Central', students: 450, teachers: 32, status: 'active' },
        { name: 'Instituto Educativo Norte', students: 380, teachers: 28, status: 'active' },
        { name: 'Colegio del Valle', students: 290, teachers: 24, status: 'pending' },
        { name: 'Bachillerato Técnico', students: 520, teachers: 38, status: 'active' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f1e8] to-[#e8dcc4] p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-playfair font-bold text-[#2b1b17] mb-2">
                    Panel de Administración
                </h1>
                <p className="text-[#5d4037] text-lg">
                    Bienvenido, Super Administrador. Gestión global del sistema.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#d4af37] hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center">
                                {stat.icon === 'school' && (
                                    <svg className="w-6 h-6 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                                    </svg>
                                )}
                                {stat.icon === 'users' && (
                                    <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                                {stat.icon === 'teacher' && (
                                    <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                                {stat.icon === 'book' && (
                                    <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#2b1b17] mb-1">{stat.value}</h3>
                        <p className="text-[#8d6e63] text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schools Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-playfair font-bold text-[#2b1b17]">
                            Escuelas Registradas
                        </h2>
                        <button className="bg-[#d4af37] text-[#2b1b17] px-4 py-2 rounded-lg font-semibold hover:bg-[#c19b2f] transition-colors">
                            + Nueva Escuela
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-[#d4af37]">
                                    <th className="text-left py-3 px-4 text-[#2b1b17] font-semibold">Institución</th>
                                    <th className="text-left py-3 px-4 text-[#2b1b17] font-semibold">Estudiantes</th>
                                    <th className="text-left py-3 px-4 text-[#2b1b17] font-semibold">Profesores</th>
                                    <th className="text-left py-3 px-4 text-[#2b1b17] font-semibold">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSchools.map((school, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-[#f5f1e8] transition-colors">
                                        <td className="py-4 px-4 text-[#2b1b17] font-medium">{school.name}</td>
                                        <td className="py-4 px-4 text-[#5d4037]">{school.students}</td>
                                        <td className="py-4 px-4 text-[#5d4037]">{school.teachers}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                school.status === 'active' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {school.status === 'active' ? 'Activa' : 'Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    {/* Activity Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">
                            Actividad del Sistema
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[#5d4037]">Uso de Plataforma</span>
                                    <span className="text-[#2b1b17] font-semibold">87%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-[#d4af37] h-2 rounded-full" style={{ width: '87%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[#5d4037]">Libros Completados</span>
                                    <span className="text-[#2b1b17] font-semibold">64%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-[#8d6e63] h-2 rounded-full" style={{ width: '64%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[#5d4037]">Tasa de Aprobación</span>
                                    <span className="text-[#2b1b17] font-semibold">92%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">
                            Acciones Rápidas
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-[#f5f1e8] hover:bg-[#d4af37]/20 rounded-lg transition-colors flex items-center gap-3">
                                <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-[#2b1b17] font-medium">Agregar Escuela</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-[#f5f1e8] hover:bg-[#d4af37]/20 rounded-lg transition-colors flex items-center gap-3">
                                <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-[#2b1b17] font-medium">Generar Reporte</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-[#f5f1e8] hover:bg-[#d4af37]/20 rounded-lg transition-colors flex items-center gap-3">
                                <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-[#2b1b17] font-medium">Configuración Global</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}