'use client';

import React, { useState, useEffect } from 'react';
import { AddLibroModal } from '../../../components/admin/libros/AddLibroModal';
import { AsignLibroModal } from '../../../components/admin/libros/AsignLibroModal';
import { CanjeLibroModal } from '../../../components/admin/libros/CanjeLibroModal';
import { DeleteLibroModal } from '../../../components/admin/libros/DeleteLibroModal';
import { ViewLibroModal } from '../../../components/admin/libros/ViewLibroModal';
import { AdminLibroTable } from '../../../components/admin/libros/AdminLibroTable';
import { LibrosService } from '../../../service/libros.service';
import { Libro, LibroEscuela } from '../../../types/libros/libro';

export default function AdminLibrosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrado, setFilterGrado] = useState<number | 'todos'>('todos');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAsignModal, setShowAsignModal] = useState(false);
    const [showCanjeModal, setShowCanjeModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewLibroId, setViewLibroId] = useState<number | null>(null);

    const [libros, setLibros] = useState<Libro[]>([]);
    const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Filtros para grados disponibles
    const gradesAvailable = [1, 2, 3, 4, 5, 6];

    useEffect(() => {
        loadLibros();
    }, []);

    const loadLibros = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await LibrosService.getAll();
            setLibros(response.data);
        } catch (err: any) {
            console.error('Error al cargar libros:', err);
            setError('Error al cargar libros. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLibros = libros.filter(libro => {
        const matchSearch =
            libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            libro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (libro.materia?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchGrado = filterGrado === 'todos' || libro.grado === filterGrado;

        return matchSearch && matchGrado;
    });

    const handleView = (libro: Libro) => {
        setViewLibroId(libro.id);
        setShowViewModal(true);
    };

    const handleAssign = (libro: Libro) => {
        setSelectedLibro(libro as LibroEscuela);
        setShowAsignModal(true);
    };

    const handleCanje = (libro: Libro) => {
        setSelectedLibro(libro as LibroEscuela);
        setShowCanjeModal(true);
    };

    const handleDelete = (libro: Libro) => {
        setSelectedLibro(libro);
        setShowDeleteModal(true);
    };

    const handleDownload = async (libro: Libro) => {
        try {
            const blob = await LibrosService.downloadPdf(libro.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${libro.codigo}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error al descargar PDF:', err);
            alert('Error al descargar el PDF');
        }
    };

    const handleToggleActivo = async (libro: Libro, activo: boolean) => {
        try {
            setIsLoading(true);
            await LibrosService.toggleLibroGlobal(libro.id, activo);
            // Actualizar el state local
            setLibros(prev => 
                prev.map(l => 
                    l.id === libro.id ? { ...l, activo } : l
                )
            );
            alert(`Libro ${activo ? 'activado' : 'desactivado'} correctamente`);
        } catch (err) {
            console.error('Error al toggle libro:', err);
            alert('Error al cambiar el estado del libro');
        } finally {
            setIsLoading(false);
        }
    };

    const librosPendientes = libros.filter(l => l.estado === 'procesando');
    const librosListo = libros.filter(l => l.estado === 'listo');
    const librosError = libros.filter(l => l.estado === 'error');

    return (
        <div className="min-h-screen bg-[#fefdfb]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#fbf8f1] to-[#f0e6d2] border-b border-[#e3dac9] p-6">
                <div className="w-full">
                    <h1 className="font-playfair text-3xl font-bold text-[#2b1b17] mb-2">Gestión de Libros</h1>
                    <p className="text-[#8d6e3f]">Carga, gestiona y asigna libros a las escuelas</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-[#e3dac9] rounded-lg p-4">
                        <p className="text-sm text-[#8d6e3f] font-semibold">Total de libros</p>
                        <p className="text-3xl font-bold text-[#2b1b17] mt-1">{libros.length}</p>
                    </div>
                    <div className="bg-white border border-[#e3dac9] rounded-lg p-4">
                        <p className="text-sm text-green-600 font-semibold">Listos</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{librosListo.length}</p>
                    </div>
                    <div className="bg-white border border-[#e3dac9] rounded-lg p-4">
                        <p className="text-sm text-yellow-600 font-semibold">Procesando</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">{librosPendientes.length}</p>
                    </div>
                    <div className="bg-white border border-[#e3dac9] rounded-lg p-4">
                        <p className="text-sm text-red-600 font-semibold">Con error</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{librosError.length}</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Toolbar */}
                <div className="bg-white border border-[#e3dac9] rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 flex gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Buscar por título, código o materia..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="flex-1 px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                                disabled={isLoading}
                            />
                        </div>

                        <select
                            value={filterGrado}
                            onChange={e => setFilterGrado(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
                            className="px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                            disabled={isLoading}
                        >
                            <option value="todos">Todos los grados</option>
                            {gradesAvailable.map(grade => (
                                <option key={grade} value={grade}>
                                    Grado {grade}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setShowAddModal(true)}
                            disabled={isLoading}
                            className="px-6 py-2 bg-[#d4af37] hover:bg-[#b8941e] text-[#2b1b17] font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            + Cargar Libro
                        </button>
                    </div>
                </div>

                {/* Tabla de libros */}
                <div className="bg-white border border-[#e3dac9] rounded-lg overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center">
                                <svg className="animate-spin h-8 w-8 text-[#d4af37] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-[#8d6e3f] font-semibold">Cargando libros...</p>
                            </div>
                        </div>
                    ) : (
                        <AdminLibroTable
                            libros={filteredLibros}
                            onView={handleView}
                            onDelete={handleDelete}
                            onAssign={handleAssign}
                            onDownload={handleDownload}
                            onToggleActivo={handleToggleActivo}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddLibroModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={loadLibros}
            />

            <AsignLibroModal
                isOpen={showAsignModal}
                onClose={() => setShowAsignModal(false)}
                onSuccess={loadLibros}
                libro={selectedLibro as LibroEscuela | null}
            />

            <CanjeLibroModal
                isOpen={showCanjeModal}
                onClose={() => setShowCanjeModal(false)}
                onSuccess={loadLibros}
                libro={selectedLibro as LibroEscuela | null}
            />

            <DeleteLibroModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSuccess={loadLibros}
                libro={selectedLibro}
            />

            <ViewLibroModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                libroId={viewLibroId}
            />

        </div>
    );
}
