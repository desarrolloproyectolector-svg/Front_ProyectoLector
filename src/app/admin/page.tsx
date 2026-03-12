'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import api from '../../utils/api';

// ── Types ────────────────────────────────────────────────────
interface DashboardStats {
    escuelas: { total: number; activas: number };
    usuarios: { total: number; alumnos: number; maestros: number; directores: number; padres: number };
    libros: { total: number };
    licencias: { total: number };
}

interface LibroReciente {
    id: number;
    titulo: string;
    codigo: string;
    grado: number;
    estado: string;
    numPaginas: number;
}

interface AuditLog {
    id: number;
    accion: string;
    usuarioId: number;
    ip: string;
    detalles: string;
    fecha: string;
}

// ── Helpers ──────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('es-MX');

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'hace un momento';
    if (mins < 60) return `hace ${mins} min`;
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${days}d`;
};

const accionColor: Record<string, string> = {
    login: 'text-emerald-600 bg-emerald-50',
    logout: 'text-gray-500   bg-gray-50',
    create: 'text-blue-600   bg-blue-50',
    update: 'text-amber-600  bg-amber-50',
    delete: 'text-red-600    bg-red-50',
};
const accionLabel: Record<string, string> = {
    login: 'Ingreso',
    logout: 'Salida',
    create: 'Creación',
    update: 'Edición',
    delete: 'Eliminación',
};

// ── Componente principal ─────────────────────────────────────
export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [libros, setLibros] = useState<LibroReciente[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [hora, setHora] = useState('');

    // Reloj en tiempo real
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setHora(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);

            const [escuelasRes, usuariosRes, librosRes, auditRes] = await Promise.allSettled([
                api.get('/escuelas/stats'),
                api.get('/admin/usuarios'),
                api.get('/libros'),
                api.get('/audit?page=1&limit=8'),
            ]);

            const escStats = escuelasRes.status === 'fulfilled' ? escuelasRes.value.data.data : null;
            const usrData = usuariosRes.status === 'fulfilled' ? usuariosRes.value.data : null;
            const libData = librosRes.status === 'fulfilled' ? librosRes.value.data : null;
            const audData = auditRes.status === 'fulfilled' ? auditRes.value.data : null;

            setStats({
                escuelas: {
                    total: escStats?.totalEscuelas ?? 0,
                    activas: escStats?.escuelasActivas ?? 0,
                },
                usuarios: {
                    total: usrData?.totalesPorRol?.total ?? 0,
                    alumnos: usrData?.totalesPorRol?.alumno ?? 0,
                    maestros: usrData?.totalesPorRol?.maestro ?? 0,
                    directores: usrData?.totalesPorRol?.director ?? 0,
                    padres: usrData?.totalesPorRol?.padre ?? 0,
                },
                libros: {
                    total: libData?.total ?? 0,
                },
                licencias: {
                    total: escStats?.licencias ?? 0,
                },
            });

            if (libData?.data) setLibros(libData.data.slice(0, 5));
            if (audData?.data) setLogs(audData.data);

        } catch (e) {
            console.error('Error cargando dashboard:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    // ── Fecha bonita ─────────────────────────────────────────
    const fechaHoy = new Date().toLocaleDateString('es-MX', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // ── KPIs principales ─────────────────────────────────────
    const kpis = [
        {
            label: 'Escuelas',
            value: stats?.escuelas.total ?? 0,
            sub: `${stats?.escuelas.activas ?? 0} activas`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: '#d4af37',
            bg: 'from-[#d4af37]/15 to-[#d4af37]/5',
            href: '/admin/escuelas',
        },
        {
            label: 'Usuarios',
            value: stats?.usuarios.total ?? 0,
            sub: `${stats?.usuarios.alumnos ?? 0} alumnos`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: '#3b82f6',
            bg: 'from-blue-500/15 to-blue-500/5',
            href: '/admin/usuarios',
        },
        {
            label: 'Libros',
            value: stats?.libros.total ?? 0,
            sub: 'en catálogo',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            color: '#8b5cf6',
            bg: 'from-violet-500/15 to-violet-500/5',
            href: '/admin/libros',
        },
        {
            label: 'Licencias',
            value: stats?.licencias.total ?? 0,
            sub: 'códigos activos',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            ),
            color: '#10b981',
            bg: 'from-emerald-500/15 to-emerald-500/5',
            href: '/admin/libros',
        },
    ];

    // ── Desglose de usuarios ─────────────────────────────────
    const rolesData = stats ? [
        { label: 'Alumnos', value: stats.usuarios.alumnos, color: '#3b82f6', pct: stats.usuarios.total ? Math.round(stats.usuarios.alumnos / stats.usuarios.total * 100) : 0 },
        { label: 'Maestros', value: stats.usuarios.maestros, color: '#8b5cf6', pct: stats.usuarios.total ? Math.round(stats.usuarios.maestros / stats.usuarios.total * 100) : 0 },
        { label: 'Directores', value: stats.usuarios.directores, color: '#d4af37', pct: stats.usuarios.total ? Math.round(stats.usuarios.directores / stats.usuarios.total * 100) : 0 },
        { label: 'Tutores', value: stats.usuarios.padres, color: '#10b981', pct: stats.usuarios.total ? Math.round(stats.usuarios.padres / stats.usuarios.total * 100) : 0 },
    ] : [];

    // ── Accesos rápidos ──────────────────────────────────────
    const accesos = [
        { label: 'Nueva Escuela', href: '/admin/escuelas', icon: '🏫', color: 'hover:border-[#d4af37] hover:bg-[#d4af37]/5' },
        { label: 'Nuevo Usuario', href: '/admin/usuarios', icon: '👤', color: 'hover:border-blue-400 hover:bg-blue-50' },
        { label: 'Cargar Libro', href: '/admin/libros', icon: '📚', color: 'hover:border-violet-400 hover:bg-violet-50' },
        { label: 'Auditoría', href: '/admin/auditoria', icon: '🔍', color: 'hover:border-emerald-400 hover:bg-emerald-50' },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-8">
            <div className="space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs md:text-sm text-[#a1887f] capitalize mb-1">{fechaHoy}</p>
                        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[#2b1b17] leading-tight">
                            Panel de Control
                        </h1>
                        <p className="text-[#5d4037] font-lora mt-1">
                            Resumen general del sistema
                        </p>
                    </div>

                    {/* Reloj + estado */}
                    <div className="flex items-center gap-4">
                        <div className="bg-white rounded-2xl px-5 py-3 shadow-md border border-[#e3dac9]/60 text-right">
                            <p className="text-2xl font-mono font-bold text-[#2b1b17] tracking-widest">{hora}</p>
                            <p className="text-xs text-[#a1887f] mt-0.5">hora del servidor</p>
                        </div>
                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="p-3 bg-white rounded-xl shadow-md border border-[#e3dac9]/60 text-[#8d6e3f] hover:text-[#d4af37] hover:border-[#d4af37] transition-all duration-200 disabled:opacity-50"
                            title="Actualizar datos"
                        >
                            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map(({ label, value, sub, icon, color, bg, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="group bg-white rounded-2xl p-5 shadow-md border border-[#e3dac9]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`p-3 rounded-xl bg-gradient-to-br ${bg}`}
                                    style={{ color }}
                                >
                                    {icon}
                                </div>
                                <svg className="w-4 h-4 text-[#c9b99a] group-hover:text-[#d4af37] transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            {loading ? (
                                <div className="space-y-2">
                                    <div className="h-8 w-20 bg-[#f0e6d2] rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-[#f0e6d2] rounded animate-pulse" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-3xl font-playfair font-bold text-[#2b1b17]">{fmt(value)}</p>
                                    <p className="text-xs text-[#a1887f] mt-1 font-medium">{label}</p>
                                    <p className="text-xs text-[#8d6e3f] mt-0.5">{sub}</p>
                                </>
                            )}
                        </Link>
                    ))}
                </div>

                {/* ── Fila central: Usuarios + Libros recientes ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Desglose usuarios */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-[#e3dac9]/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-playfair text-xl font-bold text-[#2b1b17]">Distribución de Usuarios</h2>
                            <Link href="/admin/usuarios" className="text-xs text-[#d4af37] hover:underline font-bold">
                                Ver todos →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 bg-[#f0e6d2] rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {rolesData.map(({ label, value, color, pct }) => (
                                    <div key={label}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-sm font-medium text-[#2b1b17]">{label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#2b1b17]">{fmt(value)}</span>
                                                <span className="text-xs text-[#a1887f]">{pct}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-[#f0e6d2] rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, backgroundColor: color }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Total */}
                                <div className="pt-4 mt-2 border-t border-[#e3dac9]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[#2b1b17]">Total usuarios</span>
                                        <span className="text-2xl font-playfair font-bold text-[#d4af37]">
                                            {fmt(stats?.usuarios.total ?? 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Libros recientes */}
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-md border border-[#e3dac9]/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-playfair text-xl font-bold text-[#2b1b17]">Libros en Catálogo</h2>
                            <Link href="/admin/libros" className="text-xs text-[#d4af37] hover:underline font-bold">
                                Ver todos →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-14 bg-[#f0e6d2] rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : libros.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-4xl mb-3">📚</p>
                                <p className="text-[#a1887f] text-sm">No hay libros cargados aún</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {libros.map((libro) => (
                                    <div
                                        key={libro.id}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#fbf8f1] transition-colors group"
                                    >
                                        {/* Icono grado */}
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center flex-shrink-0">
                                            <span className="text-violet-600 font-bold text-sm">{libro.grado}°</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#2b1b17] truncate text-sm">{libro.titulo}</p>
                                            <p className="text-xs text-[#a1887f] font-mono">{libro.codigo}</p>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs text-[#8d6e3f]">{libro.numPaginas}p</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${libro.estado === 'listo'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {libro.estado}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Fila inferior: Accesos rápidos + Auditoría ── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Accesos rápidos */}
                    <div className="bg-white rounded-2xl shadow-md border border-[#e3dac9]/50 p-6">
                        <h2 className="font-playfair text-xl font-bold text-[#2b1b17] mb-5">Acceso Rápido</h2>
                        <div className="space-y-2">
                            {accesos.map(({ label, href, icon, color }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 border-transparent bg-[#fbf8f1] transition-all duration-200 group ${color}`}
                                >
                                    <span className="text-xl">{icon}</span>
                                    <span className="text-sm font-semibold text-[#2b1b17]">{label}</span>
                                    <svg className="w-4 h-4 ml-auto text-[#c9b99a] group-hover:text-[#d4af37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Auditoría reciente */}
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-md border border-[#e3dac9]/50 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-playfair text-xl font-bold text-[#2b1b17]">Actividad Reciente</h2>
                            <Link href="/admin/auditoria" className="text-xs text-[#d4af37] hover:underline font-bold">
                                Ver auditoría →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-12 bg-[#f0e6d2] rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="text-[#a1887f] text-sm">Sin actividad registrada</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {logs.map((log) => {
                                    const badgeClass = accionColor[log.accion] ?? 'text-gray-600 bg-gray-50';
                                    const badgeLabel = accionLabel[log.accion] ?? log.accion;
                                    return (
                                        <div
                                            key={log.id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 px-3 py-2.5 rounded-xl hover:bg-[#fbf8f1] transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${badgeClass}`}>
                                                    {badgeLabel}
                                                </span>
                                                <p className="text-sm text-[#5d4037] flex-1 truncate sm:hidden">{log.detalles}</p>
                                            </div>
                                            <p className="text-sm text-[#5d4037] flex-1 truncate hidden sm:block">{log.detalles}</p>
                                            <div className="flex items-center sm:justify-end gap-2 flex-shrink-0 text-left sm:text-right">
                                                <span className="text-xs text-[#a1887f] font-mono">{log.ip}</span>
                                                <span className="text-xs text-[#c9b99a]">{timeAgo(log.fecha)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}