'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LicenciaService } from '../../../service/licencia.service';
import { EscuelaService } from '../../../service/escuela.service';
import { Licencia, FiltrosLicencia } from '../../../types/licencias';
import type { EscuelaListItem } from '../../../types/admin/escuelas/escuela';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminLicenciasPage() {
    const [licencias, setLicencias] = useState<Licencia[]>([]);
    const [escuelas, setEscuelas] = useState<EscuelaListItem[]>([]);
    const [showGenerar, setShowGenerar] = useState(false);
    
    // Pagination States
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 20;

    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<'4m' | '6m' | 'custom'>('custom');

    const [filtros, setFiltros] = useState<FiltrosLicencia>({
        estado: undefined,
        escuelaId: undefined,
        libroId: undefined
    });

    const [newLicencia, setNewLicencia] = useState({
        escuelaId: '',
        libroId: '',
        cantidad: '',
        fechaVencimiento: '2026-12-31'
    });

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [filtros]);

    const handleExportPDF = async (customParams?: any) => {
        // (Existing backend-based general export logic remains here for the filter button)
        try {
            const params = customParams || {
                escuelaId: filtros.escuelaId,
                libroId: filtros.libroId,
                estado: filtros.estado
            };

            if (!params.escuelaId) {
                alert('Selecciona una escuela para exportar el PDF');
                return;
            }

            const blob = await LicenciaService.exportarPDF(params);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Licencias_${params.escuelaId}_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting PDF:', err);
            alert('Error al generar el PDF');
        }
    };

    const handleGenerateBatchPDF = (batchData: any) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(43, 27, 23); // #2b1b17 (Coffee)
        doc.text('PROYECTO LECTOR', 14, 22);
        
        doc.setFontSize(14);
        doc.setTextColor(141, 110, 63); // #8d6e3f (Gold-ish)
        doc.text('Emisión de Licencias Institucionales', 14, 32);
        
        // Info Box
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const schoolName = escuelas.find(e => Number(e.id) === Number(batchData.escuelaId))?.nombre || 'Institución';
        doc.text(`Institución: ${schoolName}`, 14, 45);
        doc.text(`Libro: ${batchData.titulo}`, 14, 52);
        doc.text(`Cantidad: ${batchData.cantidad}`, 14, 59);
        doc.text(`Vencimiento: ${batchData.fechaVencimiento}`, 14, 66);
        
        // Table
        autoTable(doc, {
            startY: 75,
            head: [['#', 'Código de Licencia (16 caracteres)']],
            body: batchData.claves.map((clave: string, i: number) => [
                String(i + 1).padStart(2, '0'),
                clave
            ]),
            headStyles: { fillColor: [43, 27, 23], textColor: [240, 230, 210] },
            alternateRowStyles: { fillColor: [251, 248, 241] },
            margin: { top: 75 },
        });

        doc.save(`Nuevas_Licencias_${batchData.titulo}_${new Date().getTime()}.pdf`);
    };

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [licRes, escRes] = await Promise.all([
                LicenciaService.listLicencias({ ...filtros, page, limit }),
                EscuelaService.getAll(1, 100)
            ]);
            setLicencias(licRes.data || []);
            setTotalItems(licRes.total || (licRes.data?.length || 0));
            setEscuelas(escRes.data || []);
        } catch (err) {
            console.error('Error loading licencias:', err);
            setError('Error al cargar las licencias');
        } finally {
            setIsLoading(false);
        }
    }, [filtros, page, limit]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleToggleActiva = async (id: number, current: boolean) => {
        try {
            await LicenciaService.toggleActiva(id, !current);
            setLicencias(prev => prev.map(l => l.id === id ? { ...l, activa: !current } : l));
        } catch (err) {
            alert('Error al cambiar estado de la licencia');
        }
    };

    const handleGenerar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLicencia.escuelaId || !newLicencia.libroId || !newLicencia.cantidad) {
            alert('Por favor completa todos los campos');
            return;
        }
        try {
            setIsGenerating(true);
            const res = await LicenciaService.generarLicencias({
                ...newLicencia,
                escuelaId: Number(newLicencia.escuelaId),
                libroId: Number(newLicencia.libroId),
                cantidad: Number(newLicencia.cantidad)
            });
            
            setShowGenerar(false);
            
            // Auto-export EXCLUSIVE PDF using the response data
            if (res.data) {
                handleGenerateBatchPDF(res.data);
            }

            loadData();

            // Reset form
            setSelectedPlan('custom');
            setNewLicencia({
                escuelaId: '',
                libroId: '',
                cantidad: '',
                fechaVencimiento: '2026-12-31'
            });
        } catch (err) {
            alert('Error al generar licencias');
        } finally {
            setIsGenerating(false);
        }
    };

    const stats = {
        total: totalItems,
        disponibles: licencias.filter(l => l.estado === 'disponible').length,
        usadas: licencias.filter(l => l.estado === 'usada').length,
        vencidas: licencias.filter(l => l.estado === 'vencida').length,
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-8">
            <div className="space-y-6 animate-fade-in">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair font-bold text-[#2b1b17] mb-2">
                            Gestión de Licencias
                        </h1>
                        <p className="text-[#5d4037] text-lg font-lora">
                            Control maestro de accesos y bibliotecas
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowGenerar(true)}
                        className="px-6 py-3 bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-xl font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        Generar Licencias
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: 'Total Emitidas', value: stats.total, bg: 'from-[#2b1b17]/10 to-[#2b1b17]/5', color: 'text-[#2b1b17]', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                        { label: 'Disponibles', value: stats.disponibles, bg: 'from-emerald-500/10 to-emerald-500/5', color: 'text-emerald-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'En Uso', value: stats.usadas, bg: 'from-blue-500/10 to-blue-500/5', color: 'text-blue-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                        { label: 'Vencidas', value: stats.vencidas, bg: 'from-red-500/10 to-red-500/5', color: 'text-red-600', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-6 shadow-md border border-[#e3dac9]/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-4">
                                <div className={`p-3.5 rounded-xl bg-gradient-to-br ${stat.bg} shadow-sm flex-shrink-0`}>
                                    <svg className={`w-7 h-7 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}/></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#a1887f] mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-playfair font-bold text-[#2b1b17]">{isLoading ? '...' : stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-[#e3dac9]/50">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex items-center gap-3 bg-[#fbf8f1] px-4 py-2 rounded-lg border border-[#e3dac9]">
                            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                            <span className="text-sm font-bold text-[#2b1b17] uppercase tracking-wider">Filtros</span>
                        </div>
                        
                        <div className="flex-1 w-full md:w-auto">
                            <select 
                                className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 font-lora text-sm transition-all duration-300"
                                value={filtros.escuelaId || ''}
                                onChange={e => setFiltros({...filtros, escuelaId: e.target.value ? Number(e.target.value) : undefined})}
                            >
                                <option value="">Todas las Escuelas</option>
                                {escuelas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                            </select>
                        </div>

                        <button 
                            onClick={() => handleExportPDF()}
                            className="w-full md:w-auto justify-center px-6 py-3 bg-[#fbf8f1] text-[#2b1b17] rounded-xl font-bold border-2 border-[#e3dac9] hover:bg-[#e3dac9] transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            Exportar PDF
                        </button>

                        <div className="hidden lg:flex bg-[#fbf8f1] p-1.5 rounded-xl border border-[#e3dac9]">
                            {([
                                { id: undefined, label: 'Todo' },
                                { id: 'disponible', label: 'Libres' },
                                { id: 'usada', label: 'En Uso' },
                                { id: 'vencida', label: 'Bajas' }
                            ] as const).map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => setFiltros({...filtros, estado: opt.id})}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                        filtros.estado === opt.id 
                                        ? 'bg-[#2b1b17] text-[#f0e6d2] shadow-md' 
                                        : 'text-[#8d6e3f] hover:bg-[#e3dac9]'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table Layout */}
                <div className="bg-white rounded-xl shadow-lg border border-[#e3dac9]/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gradient-to-r from-[#fbf8f1] to-[#f0e6d2] border-b border-[#e3dac9]">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-[#2b1b17] uppercase tracking-wider text-xs">#</th>
                                    <th className="px-6 py-4 font-bold text-[#2b1b17] uppercase tracking-wider text-xs">Clave</th>
                                    <th className="px-6 py-4 font-bold text-[#2b1b17] uppercase tracking-wider text-xs">Libro Identificado</th>
                                    <th className="px-6 py-4 font-bold text-[#2b1b17] uppercase tracking-wider text-xs">Institución</th>
                                    <th className="px-6 py-4 font-bold text-[#2b1b17] uppercase tracking-wider text-xs text-center">Estado</th>
                                    <th className="px-6 py-4 font-bold text-[#2b1b17] uppercase tracking-wider text-xs text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e3dac9]">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-12 text-center text-[#d4af37] italic">Cargando registros...</td></tr>
                                ) : licencias.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-40 text-[#a1887f]">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H7"/></svg>
                                                <p className="text-xl font-playfair font-bold">No se encontraron licencias</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    licencias.slice((page - 1) * limit, page * limit).map((l, i) => (
                                        <tr key={l.id} className="group hover:bg-[#fbf8f1] transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-[#a1887f] w-12">
                                                {String(((page - 1) * limit) + i + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm font-bold text-[#2b1b17] bg-[#fbf8f1] px-3 py-1 rounded border border-[#e3dac9]">{l.clave}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#2b1b17]">{l.titulo}</span>
                                                    <span className="text-[10px] text-[#a1887f] font-bold">ID: {l.libroId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#5d4037]">
                                                {l.nombreEscuela}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    l.estado === 'disponible' ? 'bg-emerald-100 text-emerald-700' :
                                                    l.estado === 'usada' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {l.estado === 'disponible' ? 'Disponible' : l.estado === 'usada' ? 'Usada' : 'Vencida'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleToggleActiva(l.id, l.activa)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                                                        l.activa 
                                                        ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white' 
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'
                                                    }`}
                                                >
                                                    {l.activa ? 'Bloquear' : 'Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && totalItems > limit && (
                        <div className="bg-white border-t border-[#e3dac9] px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-[#5d4037]">
                                Mostrando <span className="font-bold">{((page - 1) * limit) + 1}</span> a <span className="font-bold">{Math.min(page * limit, totalItems)}</span> de <span className="font-bold">{totalItems}</span> licencias
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-[#e3dac9] text-[#2b1b17] hover:bg-[#fbf8f1] disabled:opacity-30 transition-all font-bold"
                                >
                                    Anterior
                                </button>
                                
                                <div className="flex gap-1">
                                    {[...Array(Math.ceil(totalItems / limit))].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                                                page === i + 1
                                                ? 'bg-[#2b1b17] text-[#f0e6d2] shadow-md'
                                                : 'text-[#8d6e3f] hover:bg-[#fbf8f1]'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPage(prev => prev + 1)}
                                    disabled={page >= Math.ceil(totalItems / limit)}
                                    className="p-2 rounded-lg border border-[#e3dac9] text-[#2b1b17] hover:bg-[#fbf8f1] disabled:opacity-30 transition-all font-bold"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                        {/* Modal Generar */}
                {showGenerar && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2b1b17]/80 backdrop-blur-xl animate-fade-in">
                        <div className="relative bg-[#f5f5f5] rounded-xl p-12 w-full max-w-xl shadow-2xl border border-[#e3dac9]">
                            <button 
                                onClick={() => setShowGenerar(false)}
                                className="absolute top-8 right-8 text-[#a1887f] hover:text-[#2b1b17] transition-colors"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>

                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-playfair font-bold text-[#2b1b17] mb-2">Nueva Emisión</h2>
                                <p className="text-[#8d6e3f] italic font-medium font-lora">Generación masiva de licencias para instituciones</p>
                            </div>

                            <form onSubmit={handleGenerar} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#a1887f] ml-2">Seleccionar Escuela</label>
                                    <select 
                                        className="w-full p-4 bg-white rounded-xl border-2 border-[#e3dac9] focus:border-[#d4af37] outline-none transition-all font-medium text-[#2b1b17]"
                                        value={newLicencia.escuelaId}
                                        onChange={e => setNewLicencia({...newLicencia, escuelaId: e.target.value})}
                                        required
                                    >
                                        <option value="0">Elige la institución...</option>
                                        {escuelas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#a1887f] ml-2">Libro ID</label>
                                        <input 
                                            type="number" 
                                            placeholder="Ej. 10"
                                            className="w-full p-4 bg-white rounded-xl border-2 border-[#e3dac9] focus:border-[#d4af37] outline-none font-medium"
                                            value={newLicencia.libroId}
                                            onChange={e => setNewLicencia({...newLicencia, libroId: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-[#a1887f] ml-2">Cantidad</label>
                                        <input 
                                            type="number" 
                                            placeholder="Ej. 50"
                                            className="w-full p-4 bg-white rounded-xl border-2 border-[#e3dac9] focus:border-[#d4af37] outline-none font-medium"
                                            value={newLicencia.cantidad}
                                            onChange={e => setNewLicencia({...newLicencia, cantidad: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-[#a1887f] ml-2">Plazo de Vigencia</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Cuatrimestral', id: '4m', months: 4 },
                                            { label: 'Semestral', id: '6m', months: 6 },
                                            { label: 'Personalizado', id: 'custom', months: 0 }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPlan(opt.id as any);
                                                    if (opt.months > 0) {
                                                        const d = new Date();
                                                        d.setMonth(d.getMonth() + opt.months);
                                                        setNewLicencia({...newLicencia, fechaVencimiento: d.toISOString().split('T')[0]});
                                                    }
                                                }}
                                                className={`py-3 px-2 rounded-xl border-2 transition-all text-[10px] font-bold uppercase tracking-widest ${
                                                    selectedPlan === opt.id
                                                    ? 'bg-[#2b1b17] text-[#f0e6d2] border-[#2b1b17] shadow-lg'
                                                    : 'bg-white text-[#a1887f] border-[#e3dac9] hover:border-[#d4af37] hover:text-[#2b1b17]'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 ml-2 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></div>
                                        <p className="text-[10px] font-bold text-[#8d6e3f] italic uppercase tracking-widest">
                                            {selectedPlan === '4m' ? 'Modo Automático: Cuatrimestral' : 
                                             selectedPlan === '6m' ? 'Modo Automático: Semestral' : 
                                             'Modo de Fecha Libre Activado'}
                                        </p>
                                    </div>
                                    
                                    <div className={`relative group transition-all duration-300 ${selectedPlan !== 'custom' ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}>
                                        <div className="absolute -top-2 left-4 bg-[#f5f5f5] px-2 text-[9px] font-bold text-[#d4af37] uppercase tracking-tighter">
                                            {selectedPlan === 'custom' ? '📅 Elige una fecha' : '🔒 Fecha Automática'}
                                        </div>
                                        <input 
                                            type="date" 
                                            disabled={selectedPlan !== 'custom'}
                                            className={`w-full p-4 rounded-xl border-2 outline-none font-medium transition-all text-sm ${
                                                selectedPlan !== 'custom' 
                                                ? 'bg-gray-100 border-[#e3dac9] text-[#a1887f] cursor-not-allowed' 
                                                : 'bg-white border-[#d4af37] text-[#2b1b17]'
                                            }`}
                                            value={newLicencia.fechaVencimiento}
                                            onChange={e => {
                                                setNewLicencia({...newLicencia, fechaVencimiento: e.target.value});
                                                setSelectedPlan('custom');
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isGenerating}
                                    className="w-full py-4 bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {isGenerating ? 'Generando...' : 'Confirmar Generación'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
