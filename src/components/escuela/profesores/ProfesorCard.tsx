'use client';

interface ProfesorCardShape {
    id: number;
    nombre: string;           // nombre + apellidoPaterno + apellidoMaterno (ya construido)
    email: string;
    especialidad: string;
    gruposAsignados: string[];
    alumnosTotales: number;
    estado: 'activo' | 'inactivo';
    telefono: string;
    fechaIngreso?: string | null;
}

interface Props {
    profesor: ProfesorCardShape;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ProfesorCard({ profesor, onEdit, onDelete }: Props) {
    // Iniciales: primera letra del nombre + primera del primer apellido
    const palabras = profesor.nombre.trim().split(' ');
    const inicial1 = palabras[0]?.charAt(0).toUpperCase() ?? '';
    const inicial2 = palabras[1]?.charAt(0).toUpperCase() ?? '';
    const iniciales = `${inicial1}${inicial2}`;

    const formatFecha = (fecha?: string | null) => {
        if (!fecha) return null;
        const d = new Date(fecha);
        return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="group bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-6 shadow-md hover:shadow-2xl border border-[#e3dac9]/50 hover:border-[#d4af37]/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 to-[#d4af37]/0 group-hover:from-[#d4af37]/5 group-hover:to-[#d4af37]/5 transition-all duration-500 rounded-xl" />

            <div className="relative z-10">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                            {iniciales}
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-playfair font-bold text-lg text-[#2b1b17] group-hover:text-[#d4af37] transition-colors leading-tight">
                                {profesor.nombre}
                            </h4>
                            <p className="text-xs text-[#8d6e3f] font-lora italic mt-0.5">
                                {profesor.especialidad}
                            </p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${
                        profesor.estado === 'activo'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                        {profesor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                </div>

                {/* ── Contacto ────────────────────────────────────────────── */}
                <div className="space-y-2 mb-4 pb-4 border-b border-[#e3dac9]">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm text-[#5d4037]">
                        <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{profesor.email}</span>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center gap-2 text-sm text-[#5d4037]">
                        <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{profesor.telefono || 'Sin teléfono'}</span>
                    </div>

                    {/* Fecha de ingreso */}
                    {profesor.fechaIngreso && (
                        <div className="flex items-center gap-2 text-sm text-[#5d4037]">
                            <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Desde {formatFecha(profesor.fechaIngreso)}</span>
                        </div>
                    )}
                </div>

                {/* ── Stats ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Grupos</p>
                        <p className="text-2xl font-playfair font-bold text-blue-700">
                            {profesor.gruposAsignados.length}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Alumnos</p>
                        <p className="text-2xl font-playfair font-bold text-purple-700">
                            {profesor.alumnosTotales}
                        </p>
                    </div>
                </div>

                {/* ── Grupos asignados ────────────────────────────────────── */}
                {profesor.gruposAsignados.length > 0 ? (
                    <div className="mb-4">
                        <p className="text-xs font-bold text-[#a1887f] uppercase tracking-wider mb-2">
                            Grupos Asignados
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {profesor.gruposAsignados.map((grupo, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 text-[#2b1b17] text-xs font-bold rounded-full border border-[#d4af37]/20"
                                >
                                    {grupo}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-4">
                        <p className="text-xs font-bold text-[#a1887f] uppercase tracking-wider mb-2">
                            Grupos Asignados
                        </p>
                        <p className="text-xs text-[#a1887f] italic">Sin grupos asignados</p>
                    </div>
                )}

                {/* ── Acciones ────────────────────────────────────────────── */}
                <div className="flex gap-2 pt-4 border-t border-[#e3dac9]">
                    <button
                        onClick={() => onEdit(profesor.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border-2 border-[#e3dac9] text-[#5d4037] text-sm font-bold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(profesor.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border-2 border-[#e3dac9] text-[#5d4037] text-sm font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}