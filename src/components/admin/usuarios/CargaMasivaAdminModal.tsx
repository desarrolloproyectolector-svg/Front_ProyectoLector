'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { toast } from '@/utils/toast';
import {
    cargaMasivaAdminService,
    CargaMasivaAdminResponse,
    EscuelaOpcion
} from '../../../service/admin/usuarios/cargaMasivaAdmin.service';

interface CargaMasivaAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type Step = 'inicio' | 'subir' | 'procesando' | 'resultado';
type Tipo = 'alumno' | 'maestro';

export const CargaMasivaAdminModal: React.FC<CargaMasivaAdminModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [step, setStep] = useState<Step>('inicio');
    const [archivo, setArchivo] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDescargando, setIsDescargando] = useState(false);
    const [resultado, setResultado] = useState<CargaMasivaAdminResponse | null>(null);

    // Admin-specific
    const [escuelas, setEscuelas] = useState<EscuelaOpcion[]>([]);
    const [escuelaId, setEscuelaId] = useState<number | null>(null);
    const [tipo, setTipo] = useState<Tipo>('alumno');
    const [isLoadingEscuelas, setIsLoadingEscuelas] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar escuelas al abrir
    useEffect(() => {
        if (isOpen) {
            cargarEscuelas();
        }
    }, [isOpen]);

    const cargarEscuelas = async () => {
        try {
            setIsLoadingEscuelas(true);
            const data = await cargaMasivaAdminService.obtenerEscuelas();
            setEscuelas(data);
        } catch (error: any) {
            toast.error(error.message || 'Error al cargar escuelas');
        } finally {
            setIsLoadingEscuelas(false);
        }
    };

    const handleClose = () => {
        if (step === 'procesando') return;
        setStep('inicio');
        setArchivo(null);
        setResultado(null);
        setEscuelaId(null);
        setTipo('alumno');
        onClose();
    };

    // ─── Descargar plantilla ───────────────────────────────────────────────
    const handleDescargarPlantilla = async () => {
        try {
            setIsDescargando(true);
            await cargaMasivaAdminService.descargarPlantilla();
            toast.success('Plantilla descargada exitosamente');
        } catch (error: any) {
            toast.error(error.message || 'Error al descargar la plantilla');
        } finally {
            setIsDescargando(false);
        }
    };

    // ─── Manejo de archivo ─────────────────────────────────────────────────
    const validarYSetArchivo = (file: File) => {
        const esExcel =
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel' ||
            file.name.endsWith('.xlsx') ||
            file.name.endsWith('.xls');

        if (!esExcel) {
            toast.error('Solo se permiten archivos Excel (.xlsx, .xls)');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('El archivo no debe superar 10MB');
            return;
        }

        setArchivo(file);
        setStep('subir');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) validarYSetArchivo(file);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) validarYSetArchivo(file);
    };

    // ─── Subir Excel ───────────────────────────────────────────────────────
    const handleSubir = async () => {
        if (!archivo || !escuelaId) return;

        try {
            setStep('procesando');
            const data = await cargaMasivaAdminService.cargarAlumnos(escuelaId, archivo, tipo);
            setResultado(data);
            setStep('resultado');

            if (data?.exitosos && data.exitosos > 0) {
                onSuccess();
            }
        } catch (error: any) {
            setResultado({ message: error.message, errores: 1 });
            setStep('resultado');
        }
    };

    const handleReintentar = () => {
        setArchivo(null);
        setResultado(null);
        setStep('inicio');
    };

    const escuelaSeleccionada = escuelas.find(e => e.id === escuelaId);
    const puedeAvanzar = !!escuelaId;

    // ─── Render por step ───────────────────────────────────────────────────
    const renderContenido = () => {
        switch (step) {

            case 'inicio':
                return (
                    <div className="space-y-5">
                        {/* Instrucciones */}
                        <div className="bg-gradient-to-br from-[#fbf8f1] to-[#f0e6d2] rounded-xl p-5 border border-[#e3dac9]">
                            <h4 className="font-playfair font-bold text-[#2b1b17] mb-3 flex items-center gap-2">
                                <span className="text-[#d4af37]">📋</span>
                                ¿Cómo funciona?
                            </h4>
                            <ol className="space-y-2 text-sm text-[#5d4037]">
                                {[
                                    'Selecciona la escuela y el tipo de usuario a registrar.',
                                    'Descarga la plantilla Excel con el formato requerido.',
                                    'Llena la plantilla con los datos y súbela al sistema.'
                                ].map((txt, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d4af37] text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                                        <span>{txt}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Selector de escuela */}
                        <div>
                            <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                                Escuela de destino
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            {isLoadingEscuelas ? (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-[#fbf8f1]">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#d4af37]" />
                                    <span className="text-sm text-[#8d6e3f]">Cargando escuelas...</span>
                                </div>
                            ) : (
                                <select
                                    value={escuelaId ?? ''}
                                    onChange={(e) => setEscuelaId(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white font-lora text-sm focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 transition-all"
                                >
                                    <option value="">Selecciona una escuela...</option>
                                    {escuelas.map(e => (
                                        <option key={e.id} value={e.id}>
                                            {e.nombre}{e.nivel ? ` — ${e.nivel}` : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Selector de tipo */}
                        <div>
                            <label className="block text-sm font-bold text-[#2b1b17] mb-2">
                                Tipo de usuario a registrar
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {(['alumno', 'maestro'] as Tipo[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTipo(t)}
                                        className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                            tipo === t
                                                ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#2b1b17]'
                                                : 'border-[#e3dac9] bg-white text-[#5d4037] hover:border-[#d4af37]/50'
                                        }`}
                                    >
                                        <span>{t === 'alumno' ? '📚' : '👨‍🏫'}</span>
                                        {t === 'alumno' ? 'Alumnos' : 'Maestros'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Descargar plantilla */}
                        <button
                            onClick={handleDescargarPlantilla}
                            disabled={isDescargando}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-dashed border-[#d4af37] bg-[#d4af37]/5 text-[#8d6e3f] font-bold hover:bg-[#d4af37]/10 transition-all disabled:opacity-60 group"
                        >
                            {isDescargando ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#d4af37]" />
                            ) : (
                                <svg className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                            {isDescargando ? 'Descargando...' : 'Descargar Plantilla Excel'}
                        </button>

                        {/* Zona drag & drop */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => puedeAvanzar && fileInputRef.current?.click()}
                            className={`rounded-xl border-2 border-dashed p-7 text-center transition-all duration-300 ${
                                !puedeAvanzar
                                    ? 'border-[#e3dac9] bg-[#f9f7f4] opacity-50 cursor-not-allowed'
                                    : isDragging
                                        ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[1.02] cursor-pointer'
                                        : 'border-[#e3dac9] bg-[#fbf8f1]/50 hover:border-[#d4af37]/50 hover:bg-[#fbf8f1] cursor-pointer'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? 'bg-[#d4af37]/20' : 'bg-[#e3dac9]/50'}`}>
                                    <svg className="w-6 h-6 text-[#a1887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-[#2b1b17] text-sm">
                                        {!puedeAvanzar
                                            ? 'Selecciona una escuela primero'
                                            : isDragging
                                                ? '¡Suelta el archivo aquí!'
                                                : 'Arrastra tu archivo Excel aquí'}
                                    </p>
                                    {puedeAvanzar && (
                                        <p className="text-[#a1887f] text-xs mt-1">o haz clic para seleccionar · .xlsx, .xls · Máx. 10MB</p>
                                    )}
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                );

            case 'subir':
                return (
                    <div className="space-y-5">
                        {/* Resumen de la carga */}
                        <div className="bg-[#fbf8f1] rounded-xl border border-[#e3dac9] p-4 space-y-3">
                            <h4 className="text-sm font-bold text-[#2b1b17] uppercase tracking-wider">Resumen de la carga</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-[10px] font-bold text-[#a1887f] uppercase">Escuela</p>
                                    <p className="text-[#2b1b17] font-bold">{escuelaSeleccionada?.nombre ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#a1887f] uppercase">Tipo</p>
                                    <p className="text-[#2b1b17] font-bold capitalize">{tipo === 'alumno' ? '📚 Alumnos' : '👨‍🏫 Maestros'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Archivo seleccionado */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-green-800 text-sm truncate">{archivo?.name}</p>
                                <p className="text-green-600 text-xs">{archivo ? (archivo.size / 1024).toFixed(1) : 0} KB · Listo para subir</p>
                            </div>
                            <button onClick={handleReintentar} className="text-green-600 hover:text-green-800 transition-colors" title="Cambiar archivo">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-sm text-amber-800 flex items-start gap-2">
                                <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Los correos duplicados serán ignorados automáticamente.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleReintentar} className="flex-1 px-4 py-3 rounded-xl border-2 border-[#e3dac9] text-[#5d4037] font-bold hover:bg-[#fbf8f1] transition-colors">
                                Cambiar archivo
                            </button>
                            <button onClick={handleSubir} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Subir y Registrar
                            </button>
                        </div>
                    </div>
                );

            case 'procesando':
                return (
                    <div className="flex flex-col items-center justify-center py-12 gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-[#e3dac9]" />
                            <div className="w-20 h-20 rounded-full border-4 border-[#d4af37] border-t-transparent animate-spin absolute inset-0" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="font-playfair font-bold text-[#2b1b17] text-lg">Procesando archivo...</p>
                            <p className="text-[#8d6e3f] text-sm mt-1">Registrando usuarios en <span className="font-bold">{escuelaSeleccionada?.nombre}</span></p>
                        </div>
                    </div>
                );

            case 'resultado':
                const soloErrores = (!resultado?.exitosos || resultado.exitosos === 0) && (resultado?.errores ?? 0) > 0;
                return (
                    <div className="space-y-5">
                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 ${soloErrores ? 'bg-red-100' : 'bg-green-100'}`}>
                                {soloErrores ? (
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="font-playfair font-bold text-[#2b1b17] text-lg">
                                {soloErrores ? 'Error al procesar' : 'Carga completada'}
                            </h3>
                            <p className="text-[#8d6e3f] text-sm mt-1">{resultado?.message}</p>
                        </div>

                        {(resultado?.total !== undefined || resultado?.exitosos !== undefined) && (
                            <div className="grid grid-cols-3 gap-3">
                                {resultado.total !== undefined && (
                                    <div className="bg-[#fbf8f1] rounded-xl p-3 text-center border border-[#e3dac9]">
                                        <p className="text-2xl font-playfair font-bold text-[#2b1b17]">{resultado.total}</p>
                                        <p className="text-xs text-[#8d6e3f] font-bold uppercase mt-1">Total</p>
                                    </div>
                                )}
                                {resultado.exitosos !== undefined && (
                                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
                                        <p className="text-2xl font-playfair font-bold text-green-700">{resultado.exitosos}</p>
                                        <p className="text-xs text-green-600 font-bold uppercase mt-1">Exitosos</p>
                                    </div>
                                )}
                                {resultado.errores !== undefined && (
                                    <div className={`rounded-xl p-3 text-center border ${resultado.errores > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                        <p className={`text-2xl font-playfair font-bold ${resultado.errores > 0 ? 'text-red-700' : 'text-green-700'}`}>{resultado.errores}</p>
                                        <p className={`text-xs font-bold uppercase mt-1 ${resultado.errores > 0 ? 'text-red-600' : 'text-green-600'}`}>Errores</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {resultado?.detalles && resultado.detalles.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-h-36 overflow-y-auto">
                                <p className="text-xs font-bold text-red-700 uppercase mb-2">Detalles:</p>
                                <ul className="space-y-1">
                                    {resultado.detalles.map((d, i) => (
                                        <li key={i} className="text-xs text-red-600 flex items-start gap-1">
                                            <span className="mt-0.5">•</span> {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleReintentar} className="flex-1 px-4 py-3 rounded-xl border-2 border-[#e3dac9] text-[#5d4037] font-bold hover:bg-[#fbf8f1] transition-colors">
                                Subir otro archivo
                            </button>
                            <button onClick={handleClose} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg transition-all">
                                Finalizar
                            </button>
                        </div>
                    </div>
                );
        }
    };

    const titles: Record<Step, string> = {
        inicio: 'Carga Masiva de Usuarios',
        subir: 'Confirmar Carga',
        procesando: 'Procesando...',
        resultado: 'Resultado de la Carga'
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={titles[step]}
            size="md"
        >
            {renderContenido()}
        </Modal>
    );
};