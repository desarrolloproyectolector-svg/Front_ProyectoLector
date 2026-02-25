'use client';

import React, { useState } from 'react';
import AddGrupoModal from '@/components/escuela/grupos/AddGrupoModal';

interface Grupo {
  id: number;
  nombre: string;
  grado: string;
  profesor: string;
  totalAlumnos: number;
  promedioGeneral: number;
  librosAsignados: number;
  horario: string;
  aula: string;
}

export default function GruposPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrado, setFilterGrado] = useState<'todos' | '1' | '2' | '3'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  const [grupos, setGrupos] = useState<Grupo[]>([
    { id: 1, nombre: '3-A', grado: '3', profesor: 'Prof. Juan García', totalAlumnos: 28, promedioGeneral: 8.9, librosAsignados: 12, horario: 'Lun-Vie 7:00-13:00', aula: 'A-301' },
    { id: 2, nombre: '3-B', grado: '3', profesor: 'Prof. María Martínez', totalAlumnos: 25, promedioGeneral: 8.5, librosAsignados: 10, horario: 'Lun-Vie 7:00-13:00', aula: 'A-302' },
    { id: 3, nombre: '3-C', grado: '3', profesor: 'Prof. Carlos López', totalAlumnos: 27, promedioGeneral: 8.7, librosAsignados: 11, horario: 'Lun-Vie 13:00-19:00', aula: 'A-303' },
    { id: 4, nombre: '2-A', grado: '2', profesor: 'Prof. Ana Hernández', totalAlumnos: 30, promedioGeneral: 8.3, librosAsignados: 8, horario: 'Lun-Vie 7:00-13:00', aula: 'B-201' },
    { id: 5, nombre: '2-B', grado: '2', profesor: 'Prof. Roberto Ramírez', totalAlumnos: 27, promedioGeneral: 8.6, librosAsignados: 9, horario: 'Lun-Vie 13:00-19:00', aula: 'B-202' },
    { id: 6, nombre: '1-A', grado: '1', profesor: 'Prof. Laura Díaz', totalAlumnos: 32, promedioGeneral: 8.4, librosAsignados: 7, horario: 'Lun-Vie 7:00-13:00', aula: 'C-101' },
    { id: 7, nombre: '1-B', grado: '1', profesor: 'Prof. Pedro Torres', totalAlumnos: 30, promedioGeneral: 8.2, librosAsignados: 7, horario: 'Lun-Vie 13:00-19:00', aula: 'C-102' },
  ]);

  const filteredGrupos = grupos.filter(grupo => {
    const matchSearch =
      grupo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grupo.profesor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrado = filterGrado === 'todos' || grupo.grado === filterGrado;
    return matchSearch && matchGrado;
  });

  // Stats
  const totalAlumnos = grupos.reduce((acc, g) => acc + g.totalAlumnos, 0);
  const promedioGlobal = (grupos.reduce((acc, g) => acc + g.promedioGeneral, 0) / grupos.length).toFixed(1);
  const totalLibros = grupos.reduce((acc, g) => acc + g.librosAsignados, 0);

  // Helpers
  const getGradoColor = (grado: string) => {
    const colors: Record<string, { bg: string; text: string; gradient: string }> = {
      '1': { bg: 'bg-blue-500', text: 'text-blue-700', gradient: 'from-blue-500 to-blue-600' },
      '2': { bg: 'bg-purple-500', text: 'text-purple-700', gradient: 'from-purple-500 to-purple-600' },
      '3': { bg: 'bg-emerald-500', text: 'text-emerald-700', gradient: 'from-emerald-500 to-emerald-600' },
    };
    return colors[grado] || colors['1'];
  };

  const getGradoLabel = (grado: string) => {
    const labels: Record<string, string> = { '1': '1er Grado', '2': '2do Grado', '3': '3er Grado' };
    return labels[grado] || '';
  };

  const getPromedioColor = (promedio: number) => {
    if (promedio >= 8.5) return 'text-emerald-600';
    if (promedio >= 7.0) return 'text-[#d4af37]';
    return 'text-red-500';
  };

  const handleAddGrupo = (nuevoGrupo: any) => {
    setGrupos(prev => [...prev, { id: prev.length + 1, ...nuevoGrupo }]);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: 'Total Grupos',
            value: grupos.length,
            iconColor: 'text-purple-600',
            gradient: 'from-purple-500/10 to-purple-500/5',
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            ),
          },
          {
            label: 'Total Alumnos',
            value: totalAlumnos,
            iconColor: 'text-blue-600',
            gradient: 'from-blue-500/10 to-blue-500/5',
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
          },
          {
            label: 'Promedio Global',
            value: promedioGlobal,
            iconColor: 'text-[#d4af37]',
            gradient: 'from-[#d4af37]/10 to-[#d4af37]/5',
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
          },
          {
            label: 'Libros Asignados',
            value: totalLibros,
            iconColor: 'text-emerald-600',
            gradient: 'from-emerald-500/10 to-emerald-500/5',
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-6 shadow-md border border-[#e3dac9]/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <div className={stat.iconColor}>{stat.icon}</div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#a1887f] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-playfair font-bold text-[#2b1b17] group-hover:text-[#d4af37] transition-colors duration-300">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-[#e3dac9]/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-[#2b1b17] flex items-center gap-2">
              Gestión de Grupos
              <span className="px-2.5 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-sans rounded-full">
                {filteredGrupos.length}
              </span>
            </h3>
            <p className="text-sm text-[#8d6e3f] mt-1">Administra los grupos y asignaciones</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Buscar grupo o profesor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl border-2 border-[#e3dac9] bg-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 font-lora text-sm transition-all duration-300"
              />
              <svg className="w-5 h-5 text-[#a1887f] absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1887f] hover:text-[#2b1b17] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Botón Nuevo Grupo */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-xl font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Grupo
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {[
            { value: 'todos', label: 'Todos los Grados', activeClass: 'bg-[#d4af37] text-[#2b1b17]' },
            { value: '1', label: '1er Grado', activeClass: 'bg-blue-500 text-white' },
            { value: '2', label: '2do Grado', activeClass: 'bg-purple-500 text-white' },
            { value: '3', label: '3er Grado', activeClass: 'bg-emerald-500 text-white' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterGrado(filter.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                filterGrado === filter.value
                  ? `${filter.activeClass} shadow-md`
                  : 'bg-[#fbf8f1] text-[#5d4037] hover:bg-[#e3dac9]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grupos Grid */}
      {filteredGrupos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrupos.map((grupo) => {
            const color = getGradoColor(grupo.grado);
            return (
              <div
                key={grupo.id}
                className="group bg-gradient-to-br from-white to-[#faf8f5] rounded-xl shadow-md hover:shadow-2xl border border-[#e3dac9]/50 hover:border-[#d4af37]/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Línea acento superior */}
                <div className="h-1 bg-gradient-to-r from-[#d4af37] to-[#c19a2e]"></div>

                {/* Glow en hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 via-transparent to-[#d4af37]/0 group-hover:from-[#d4af37]/5 group-hover:to-[#d4af37]/5 transition-all duration-500 rounded-xl pointer-events-none"></div>

                <div className="relative z-10 p-5">
                  {/* Header: Nombre + Promedio */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white font-playfair font-bold text-xl shadow-lg`}>
                        {grupo.nombre}
                      </div>
                      <div>
                        <h4 className="font-playfair font-bold text-lg text-[#2b1b17] group-hover:text-[#d4af37] transition-colors duration-300">
                          Grupo {grupo.nombre}
                        </h4>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold ${color.text}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                          </svg>
                          {getGradoLabel(grupo.grado)}
                        </span>
                      </div>
                    </div>

                    {/* Promedio badge */}
                    <div className="flex flex-col items-center bg-[#fbf8f1] border border-[#e3dac9] rounded-xl px-3 py-1.5">
                      <span className="text-xs font-bold text-[#a1887f] uppercase tracking-wider">Prom.</span>
                      <span className={`text-lg font-playfair font-bold ${getPromedioColor(grupo.promedioGeneral)}`}>
                        {grupo.promedioGeneral}
                      </span>
                    </div>
                  </div>

                  {/* Profesor */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#e3dac9]">
                    <div className="p-1.5 rounded-lg bg-[#d4af37]/10">
                      <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Profesor Titular</p>
                      <p className="text-sm font-bold text-[#2b1b17]">{grupo.profesor}</p>
                    </div>
                  </div>

                  {/* Stats Mini Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                      <svg className="w-4 h-4 text-blue-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="text-xs text-blue-600 font-bold">Alumnos</p>
                      <p className="text-base font-playfair font-bold text-blue-700">{grupo.totalAlumnos}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2.5 text-center">
                      <svg className="w-4 h-4 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-xs text-purple-600 font-bold">Libros</p>
                      <p className="text-base font-playfair font-bold text-purple-700">{grupo.librosAsignados}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
                      <svg className="w-4 h-4 text-emerald-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-xs text-emerald-600 font-bold">Prom.</p>
                      <p className="text-base font-playfair font-bold text-emerald-700">{grupo.promedioGeneral}</p>
                    </div>
                  </div>

                  {/* Horario */}
                  <div className="flex items-center gap-2 bg-[#fbf8f1] rounded-lg px-3 py-2 mb-4">
                    <div className="p-1 rounded-md bg-[#d4af37]/10">
                      <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Horario</p>
                      <p className="text-sm font-bold text-[#2b1b17]">{grupo.horario}</p>
                    </div>
                  </div>

                  {/* Aula */}
                  <div className="flex items-center gap-2 bg-[#fbf8f1] rounded-lg px-3 py-2 mb-4">
                    <div className="p-1 rounded-md bg-blue-500/10">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Aula</p>
                      <p className="text-sm font-bold text-[#2b1b17]">{grupo.aula}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-[#e3dac9]">
                    <button className="flex-1 px-4 py-2 bg-white border-2 border-[#e3dac9] hover:border-[#d4af37] hover:bg-[#fbf8f1] text-[#2b1b17] rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalles
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-lg font-bold text-sm hover:from-[#3e2723] hover:to-[#4e342e] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-[#e3dac9]/50">
          <div className="w-20 h-20 bg-[#fbf8f1] rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#a1887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-playfair text-xl font-bold text-[#2b1b17] mb-2">No se encontraron grupos</h3>
          <p className="text-[#8d6e3f] mb-4">Intenta con otros términos de búsqueda o filtros</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-xl font-bold text-sm hover:from-[#3e2723] hover:to-[#4e342e] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear Grupo
          </button>
        </div>
      )}

      {/* Modal */}
      <AddGrupoModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddGrupo}
      />
    </div>
  );
}