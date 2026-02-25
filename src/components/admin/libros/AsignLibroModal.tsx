'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { LibrosService } from '../../../service/libros.service';
import { EscuelasService, Escuela } from '../../../service/admin/usuarios/escuelas.service';
import { LibroEscuela, LibroEscuelaAcceso } from '../../../types/libros/libro';

interface AsignLibroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    libro: LibroEscuela | null;
}

export const AsignLibroModal: React.FC<AsignLibroModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    libro,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEscuelas, setIsLoadingEscuelas] = useState(false);
    const [error, setError] = useState<string>('');
    const [escuelas, setEscuelas] = useState<Escuela[]>([]);
    const [selectedEscuelaId, setSelectedEscuelaId] = useState<number | null>(null);
    const [escuelasConLibro, setEscuelasConLibro] = useState<LibroEscuelaAcceso[]>([]);
    const [isLoadingAcceso, setIsLoadingAcceso] = useState(false);
    const [errorAcceso, setErrorAcceso] = useState<string>('');
    const [procesandoEscuelaId, setProcesandoEscuelaId] = useState<number | null>(null);
    const [searchEscuelas, setSearchEscuelas] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadEscuelas();
            loadEscuelasConLibro();
            setSelectedEscuelaId(null);
            setError('');
        }
    }, [isOpen, libro?.id]);

    const loadEscuelas = async () => {
        try {
            setIsLoadingEscuelas(true);
            const response = await EscuelasService.getAll(1, 100);
            setEscuelas(response.data);
        } catch (err) {
            console.error('Error al cargar escuelas:', err);
            setError('Error al cargar las escuelas');
        } finally {
            setIsLoadingEscuelas(false);
        }
    };

    const loadEscuelasConLibro = async () => {
        if (!libro) return;

        try {
            setIsLoadingAcceso(true);
            setErrorAcceso('');
            const response = await LibrosService.getEscuelasByLibro(libro.id);
            setEscuelasConLibro(response.data || []);
        } catch (err) {
            console.error('Error al cargar escuelas del libro:', err);
            setErrorAcceso('Error al cargar escuelas con este libro');
        } finally {
            setIsLoadingAcceso(false);
        }
    };

    const getErrorMessage = (err: any, fallback: string) => {
        const message = err?.response?.data?.message;
        if (Array.isArray(message) && message.length > 0) {
            return message.join(', ');
        }
        return message || err?.response?.data?.error || fallback;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!libro) return;

        if (!selectedEscuelaId) {
            setError('Por favor selecciona una escuela');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            await LibrosService.asignarLibroAEscuela(selectedEscuelaId, libro.codigo);

            await loadEscuelasConLibro();
            onSuccess();
            setSelectedEscuelaId(null);
        } catch (err: any) {
            console.error('Error al asignar libro:', err);
            const errorMsg = getErrorMessage(err, 'Error al asignar el libro.');
            setError(errorMsg);
            if (err?.response?.status === 409) {
                await loadEscuelasConLibro();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleAcceso = async (escuelaId: number, activoActual: boolean) => {
        if (!libro) return;

        const nuevoActivo = !activoActual;

        try {
            setProcesandoEscuelaId(escuelaId);
            setErrorAcceso('');

            await LibrosService.toggleLibroEnEscuelaDesdeLibro(libro.id, escuelaId, nuevoActivo);

            setEscuelasConLibro(prev =>
                prev.map(e =>
                    e.escuelaId === escuelaId ? { ...e, activoEnEscuela: nuevoActivo } : e
                )
            );
            onSuccess();
        } catch (err: any) {
            console.error('Error al cambiar acceso:', err);
            const errorMsg = getErrorMessage(err, 'Error al cambiar el acceso.');
            setErrorAcceso(errorMsg);
        } finally {
            setProcesandoEscuelaId(null);
        }
    };

    const assignedSchoolIds = new Set(escuelasConLibro.map(e => e.escuelaId));
    const searchValue = searchEscuelas.trim().toLowerCase();
    const matchesText = (value?: string | null) =>
        value ? value.toLowerCase().includes(searchValue) : false;
    const availableEscuelas = escuelas.filter(e => !assignedSchoolIds.has(e.id));
    const filteredAvailableEscuelas = searchValue
        ? availableEscuelas.filter(e =>
            matchesText(e.nombre) || matchesText(e.nivel) || matchesText(e.direccion)
        )
        : availableEscuelas;
    const filteredEscuelasConLibro = searchValue
        ? escuelasConLibro.filter(e =>
            matchesText(e.nombreEscuela) || matchesText(e.ciudad) || matchesText(e.estadoRegion)
        )
        : escuelasConLibro;
    const selectedEscuela = escuelas.find(e => e.id === selectedEscuelaId) || null;
    const totalAccesos = escuelasConLibro.length;
    const accesosActivos = escuelasConLibro.filter(e => e.activoEnEscuela).length;

    if (!libro) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gestionar escuelas del libro">
            <div className="w-full max-w-2xl">
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                        <strong>Libro:</strong> {libro.titulo}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                        <strong>Código:</strong> {libro.codigo}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-[#2b1b17]">
                                    Asignar a una escuela nueva <span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-[#8d6e3f]">
                                    Disponibles: {availableEscuelas.length}
                                </span>
                            </div>
                            <select
                                value={selectedEscuelaId || ''}
                                onChange={e => setSelectedEscuelaId(Number(e.target.value))}
                                disabled={isLoading || isLoadingEscuelas}
                                className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] disabled:opacity-50"
                            >
                                <option value="">
                                    {isLoadingEscuelas ? 'Cargando escuelas...' : '-- Selecciona una escuela --'}
                                </option>
                                {filteredAvailableEscuelas.map(escuela => (
                                    <option key={escuela.id} value={escuela.id}>
                                        {escuela.nombre} ({escuela.nivel})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEscuela && (
                            <div className="p-3 bg-[#fbf8f1] rounded-lg border border-[#d4af37] text-sm">
                                <p className="text-[#2b1b17]">
                                    {selectedEscuela.nombre}
                                </p>
                                <p className="text-[#8d6e3f] text-xs mt-1">
                                    {selectedEscuela.direccion}
                                </p>
                            </div>
                        )}

                        <p className="text-sm text-[#5d4037]">
                            Al asignar este libro a la escuela, quedará pendiente de canje. Los directores podrán activarlo introduciendo el código.
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-[#d4af37] text-[#2b1b17] font-semibold rounded-lg hover:bg-[#fbf8f1] disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !selectedEscuelaId || isLoadingEscuelas}
                                className="flex-1 px-4 py-2 bg-[#d4af37] hover:bg-[#b8941e] text-[#2b1b17] font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Asignando...
                                    </>
                                ) : (
                                    'Asignar libro'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="border-t border-[#e3dac9] pt-4">
                        <h3 className="font-semibold text-[#2b1b17] mb-3">Escuelas con este libro</h3>
                        <div className="mb-3">
                            <input
                                type="text"
                                value={searchEscuelas}
                                onChange={e => setSearchEscuelas(e.target.value)}
                                placeholder="Buscar escuela por nombre, nivel o ciudad..."
                                className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                            />
                        </div>
                        <div className="flex items-center gap-3 mb-3 text-xs text-[#8d6e3f]">
                            <span>Total: {totalAccesos}</span>
                            <span>Activos: {accesosActivos}</span>
                            <span>Inactivos: {totalAccesos - accesosActivos}</span>
                        </div>

                        {errorAcceso && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{errorAcceso}</p>
                            </div>
                        )}

                        <div className="space-y-2 max-h-72 overflow-y-auto">
                            {isLoadingAcceso ? (
                                <div className="flex items-center justify-center py-6">
                                    <svg className="animate-spin h-6 w-6 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : filteredEscuelasConLibro.length === 0 ? (
                                <p className="text-center text-[#8d6e3f] py-4">No hay resultados para ese filtro</p>
                            ) : (
                                filteredEscuelasConLibro.map(escuela => (
                                    <div
                                        key={escuela.escuelaId}
                                        className="flex items-center justify-between p-4 border border-[#e3dac9] rounded-lg hover:bg-[#f9f7f4] transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-[#2b1b17]">{escuela.nombreEscuela}</p>
                                            <p className="text-sm text-[#8d6e3f] mt-1">
                                                {(escuela.ciudad || '—')} • {(escuela.estadoRegion || '—')}
                                            </p>
                                            <div className="mt-2">
                                                {escuela.activoEnEscuela ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleToggleAcceso(escuela.escuelaId, escuela.activoEnEscuela)}
                                            disabled={procesandoEscuelaId === escuela.escuelaId}
                                            className={`px-4 py-2 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2 ${
                                                escuela.activoEnEscuela
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                        >
                                            {procesandoEscuelaId === escuela.escuelaId && (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {escuela.activoEnEscuela ? 'Quitar acceso' : 'Dar acceso'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
