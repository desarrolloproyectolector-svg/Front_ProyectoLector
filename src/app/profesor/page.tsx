'use client';

import { useState } from 'react';

export default function ProfesorPage() {
    const [selectedGroup, setSelectedGroup] = useState('3A');

    const myGroups = [
        { id: '3A', name: '3°A', students: 28, pending: 5 },
        { id: '2B', name: '2°B', students: 25, pending: 3 },
    ];

    const students = [
        { name: 'Ana García', progress: 85, lastActivity: 'Hoy', status: 'active' },
        { name: 'Carlos López', progress: 92, lastActivity: 'Hoy', status: 'active' },
        { name: 'María Hernández', progress: 78, lastActivity: 'Hace 2 días', status: 'warning' },
        { name: 'Juan Martínez', progress: 45, lastActivity: 'Hace 5 días', status: 'alert' },
        { name: 'Laura Rodríguez', progress: 88, lastActivity: 'Ayer', status: 'active' },
    ];

    const recentBooks = [
        { title: 'Cien Años de Soledad', completed: 18, inProgress: 8, notStarted: 2 },
        { title: 'El Principito', completed: 25, inProgress: 3, notStarted: 0 },
        { title: 'Don Quijote', completed: 12, inProgress: 10, notStarted: 6 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f1e8] to-[#e8dcc4] p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-playfair font-bold text-[#2b1b17] mb-2">
                    Portal del Profesor
                </h1>
                <p className="text-[#5d4037] text-lg">
                    Bienvenido, Prof. García - Monitoreo y Gestión de Alumnos
                </p>
            </div>

            {/* Group Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">Mis Grupos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {myGroups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                selectedGroup === group.id
                                    ? 'border-[#d4af37] bg-[#d4af37]/10'
                                    : 'border-gray-200 hover:border-[#d4af37]/50'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-bold text-[#2b1b17]">{group.name}</h3>
                                {group.pending > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {group.pending}
                                    </span>
                                )}
                            </div>
                            <p className="text-[#5d4037] text-sm">{group.students} estudiantes</p>
                        </button>
                    ))}
                    <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#d4af37] transition-all flex items-center justify-center">
                        <span className="text-[#8d6e63]">+ Agregar Grupo</span>
                    </button>
                </div>
            </div>

            {/* Main Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Students List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-playfair font-bold text-[#2b1b17]">
                            Estudiantes - Grupo {selectedGroup}
                        </h2>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-[#f5f1e8] text-[#2b1b17] rounded-lg hover:bg-[#d4af37]/20 transition-colors">
                                Exportar
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {students.map((student, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-[#f5f1e8] rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                                        <span className="text-[#2b1b17] font-bold">
                                            {student.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[#2b1b17] font-semibold">{student.name}</h3>
                                        <p className="text-[#8d6e63] text-sm">{student.lastActivity}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[#2b1b17]">{student.progress}%</p>
                                        <p className="text-[#8d6e63] text-xs">Progreso</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${
                                        student.status === 'active' ? 'bg-green-500' :
                                        student.status === 'warning' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`}></div>
                                    <button className="text-[#d4af37] hover:text-[#c19b2f]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Books Progress */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">
                            Libros Asignados
                        </h3>
                        <div className="space-y-4">
                            {recentBooks.map((book, index) => (
                                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                                    <h4 className="text-[#2b1b17] font-medium mb-3">{book.title}</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[#8d6e63]">Completado</span>
                                            <span className="text-green-600 font-semibold">{book.completed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#8d6e63]">En progreso</span>
                                            <span className="text-blue-600 font-semibold">{book.inProgress}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#8d6e63]">No iniciado</span>
                                            <span className="text-gray-600 font-semibold">{book.notStarted}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">
                            Acciones Rápidas
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-[#d4af37] text-[#2b1b17] rounded-lg hover:bg-[#c19b2f] transition-colors font-semibold">
                                Asignar Nueva Lectura
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-[#f5f1e8] text-[#2b1b17] rounded-lg hover:bg-[#d4af37]/20 transition-colors">
                                Crear Evaluación
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-[#f5f1e8] text-[#2b1b17] rounded-lg hover:bg-[#d4af37]/20 transition-colors">
                                Generar Reporte
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}