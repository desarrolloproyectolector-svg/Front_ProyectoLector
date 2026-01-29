'use client';

import { useState } from 'react';

export default function TutorPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const childInfo = {
        name: 'Carlos López García',
        grade: '3°A',
        school: 'Preparatoria Central',
        teacher: 'Prof. García',
    };

    const stats = [
        { label: 'Libros Leídos', value: '12', icon: 'book', color: 'bg-blue-500' },
        { label: 'Promedio General', value: '8.9', icon: 'star', color: 'bg-yellow-500' },
        { label: 'Horas de Lectura', value: '24', icon: 'clock', color: 'bg-green-500' },
        { label: 'Racha Activa', value: '15 días', icon: 'fire', color: 'bg-orange-500' },
    ];

    const recentActivity = [
        { book: 'Cien Años de Soledad', progress: 100, date: 'Completado hoy', score: 9.5 },
        { book: 'El Principito', progress: 75, date: 'En progreso', score: null },
        { book: 'Don Quijote', progress: 100, date: 'Completado hace 3 días', score: 8.8 },
    ];

    const skills = [
        { name: 'Comprensión Lectora', level: 92, color: 'bg-blue-500' },
        { name: 'Vocabulario', level: 88, color: 'bg-purple-500' },
        { name: 'Análisis Crítico', level: 85, color: 'bg-green-500' },
        { name: 'Síntesis', level: 90, color: 'bg-yellow-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f1e8] to-[#e8dcc4] p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-playfair font-bold text-[#2b1b17] mb-2">
                    Portal del Tutor
                </h1>
                <p className="text-[#5d4037] text-lg">
                    Seguimiento del progreso académico de tu hijo(a)
                </p>
            </div>

            {/* Student Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#2b1b17]">
                            {childInfo.name.charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-[#2b1b17]">{childInfo.name}</h2>
                        <div className="flex gap-6 mt-2 text-sm text-[#5d4037]">
                            <span>📚 {childInfo.grade}</span>
                            <span>🏫 {childInfo.school}</span>
                            <span>👨‍🏫 {childInfo.teacher}</span>
                        </div>
                    </div>
                    <button className="bg-[#d4af37] text-[#2b1b17] px-6 py-3 rounded-lg font-semibold hover:bg-[#c19b2f] transition-colors">
                        Contactar Profesor
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                {stat.icon === 'book' && (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                )}
                                {stat.icon === 'star' && <span className="text-white text-2xl">⭐</span>}
                                {stat.icon === 'clock' && <span className="text-white text-2xl">⏱️</span>}
                                {stat.icon === 'fire' && <span className="text-white text-2xl">🔥</span>}
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-[#2b1b17] mb-1">{stat.value}</h3>
                        <p className="text-[#8d6e63] text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-playfair font-bold text-[#2b1b17] mb-6">
                        Actividad Reciente
                    </h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-[#f5f1e8] rounded-lg">
                                <div className="w-16 h-20 bg-[#d4af37] rounded flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-[#2b1b17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[#2b1b17] font-semibold mb-1">{activity.book}</h3>
                                    <p className="text-[#8d6e63] text-sm mb-2">{activity.date}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#d4af37] h-2 rounded-full transition-all"
                                            style={{ width: `${activity.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {activity.score && (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-green-600">{activity.score}</span>
                                        </div>
                                        <p className="text-xs text-[#8d6e63] mt-1">Calificación</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Progress Chart */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">
                            Progreso Mensual
                        </h3>
                        <div className="h-48 flex items-end justify-between gap-2">
                            {[65, 70, 85, 90, 88, 92, 95].map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-[#d4af37] rounded-t hover:bg-[#c19b2f] transition-all cursor-pointer"
                                         style={{ height: `${height}%` }}>
                                    </div>
                                    <span className="text-xs text-[#8d6e63]">S{index + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Skills */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">
                            Habilidades
                        </h3>
                        <div className="space-y-4">
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[#2b1b17] font-medium">{skill.name}</span>
                                        <span className="text-[#d4af37] font-bold">{skill.level}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${skill.color} h-2 rounded-full transition-all`}
                                            style={{ width: `${skill.level}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-playfair font-bold text-[#2b1b17] mb-4">
                            Logros Recientes
                        </h3>
                        <div className="space-y-3">
                            {[
                                { icon: '🏆', title: 'Lector del Mes', date: 'Hace 2 días' },
                                { icon: '⭐', title: '10 Libros Completados', date: 'Hace 1 semana' },
                                { icon: '🎯', title: 'Racha de 15 días', date: 'Hoy' },
                            ].map((achievement, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-[#f5f1e8] rounded-lg">
                                    <span className="text-3xl">{achievement.icon}</span>
                                    <div>
                                        <p className="text-[#2b1b17] font-medium text-sm">{achievement.title}</p>
                                        <p className="text-[#8d6e63] text-xs">{achievement.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-br from-[#d4af37] to-[#c19b2f] rounded-xl shadow-lg p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">💡 Recomendación</h3>
                        <p className="text-sm opacity-90">
                            ¡Excelente progreso! Tu hijo está desarrollando muy bien sus habilidades de comprensión lectora.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}