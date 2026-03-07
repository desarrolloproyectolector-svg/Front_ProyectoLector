'use client';

import React, { useState } from 'react';
import { CreateLibroDTO } from '../../../types/libros/libro';
import { sanitizeText, focusFirstError } from '../../../utils/formValidation';

interface LibroFormProps {
    onSubmit: (data: CreateLibroDTO & { pdf: File }) => Promise<void>;
    isLoading?: boolean;
    error?: string;
    materias?: Array<{ id: number; nombre: string }>;
}

export const LibroForm: React.FC<LibroFormProps> = ({
    onSubmit,
    isLoading = false,
    error = '',
    materias = [],
}) => {
    const [formData, setFormData] = useState<CreateLibroDTO>({
        titulo: '',
        grado: 1,
        codigo: '',
        descripcion: '',
        materiaId: undefined,
    });

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfError, setPdfError] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [gradualesAvailables] = useState<number[]>([1, 2, 3, 4, 5, 6]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'grado' || name === 'materiaId' ? Number(value) : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar que sea PDF
        if (file.type !== 'application/pdf') {
            setPdfError('Solo se aceptan archivos PDF');
            setPdfFile(null);
            return;
        }

        // Validar tamaño (máx 50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            setPdfError('El archivo PDF no debe exceder 50MB');
            setPdfFile(null);
            return;
        }

        setPdfError('');
        setPdfFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let hasErrors = false;
        const newErrors: Record<string, string> = {};

        if (!pdfFile) {
            setPdfError('Debes seleccionar un archivo PDF');
            hasErrors = true;
        }

        const sTitulo = sanitizeText(formData.titulo);
        const sCodigo = formData.codigo ? sanitizeText(formData.codigo) : '';
        const sDescripcion = formData.descripcion ? sanitizeText(formData.descripcion) : '';

        if (!sTitulo) {
            newErrors.titulo = 'El título es obligatorio';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            focusFirstError(newErrors);
            return;
        }

        try {
            await onSubmit({
                ...formData,
                titulo: sTitulo,
                codigo: sCodigo,
                descripcion: sDescripcion,
                pdf: pdfFile!,
            });
            // Limpiar formulario después de éxito
            setFormData({
                titulo: '',
                grado: 1,
                codigo: '',
                descripcion: '',
                materiaId: undefined,
            });
            setPdfFile(null);
        } catch (err) {
            console.error('Error en el formulario:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Título */}
            <div>
                <label htmlFor="titulo" className="block text-sm font-semibold text-[#2b1b17] mb-2">
                    Título del libro <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    maxLength={150}
                    placeholder="Ingresa el título del libro"
                    className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    disabled={isLoading}
                />
                {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
            </div>

            {/* Grado y Materia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="grado" className="block text-sm font-semibold text-[#2b1b17] mb-2">
                        Grado <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="grado"
                        name="grado"
                        value={formData.grado}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                        disabled={isLoading}
                    >
                        {gradualesAvailables.map(g => (
                            <option key={g} value={g}>
                                Grado {g}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="materiaId" className="block text-sm font-semibold text-[#2b1b17] mb-2">
                        Materia
                    </label>
                    <select
                        id="materiaId"
                        name="materiaId"
                        value={formData.materiaId || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                        disabled={isLoading}
                    >
                        <option value="">-- Selecciona una materia (opcional) --</option>
                        {materias.map(materia => (
                            <option key={materia.id} value={materia.id}>
                                {materia.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Código */}
            <div>
                <label htmlFor="codigo" className="block text-sm font-semibold text-[#2b1b17] mb-2">
                    Código (opcional - se auto-genera si no se proporciona)
                </label>
                <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    maxLength={50}
                    placeholder="Ej: MAT5-2024"
                    className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    disabled={isLoading}
                />
            </div>

            {/* Descripción */}
            <div>
                <label htmlFor="descripcion" className="block text-sm font-semibold text-[#2b1b17] mb-2">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    maxLength={255}
                    rows={4}
                    placeholder="Describe brevemente el contenido del libro"
                    className="w-full px-4 py-2 border border-[#d4af37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent resize-none"
                    disabled={isLoading}
                />
                <p className="text-xs text-[#8d6e3f] mt-1">
                    {formData.descripcion?.length || 0}/255 caracteres
                </p>
            </div>

            {/* Archivo PDF */}
            <div>
                <label htmlFor="pdf" className="block text-sm font-semibold text-[#2b1b17] mb-2">
                    Archivo PDF <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-[#d4af37] rounded-lg p-6 text-center hover:bg-[#fbf8f1] transition-colors cursor-pointer">
                    <input
                        type="file"
                        id="pdf"
                        name="pdf"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isLoading}
                    />
                    <div className="pointer-events-none">
                        <svg
                            className="w-12 h-12 mx-auto mb-2 text-[#d4af37]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-sm font-semibold text-[#2b1b17]">
                            {pdfFile ? pdfFile.name : 'Arrastra un PDF aquí o haz clic para seleccionar'}
                        </p>
                        <p className="text-xs text-[#8d6e3f] mt-1">Máximo 50MB</p>
                    </div>
                </div>
                {pdfError && (
                    <p className="text-red-600 text-sm font-medium mt-2">{pdfError}</p>
                )}
            </div>

            {/* Botón Submit */}
            <button
                type="submit"
                disabled={isLoading || !pdfFile}
                className="w-full bg-[#d4af37] hover:bg-[#b8941e] disabled:bg-[#d4af37]/50 text-[#2b1b17] font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subiendo libro...
                    </div>
                ) : (
                    'Cargar libro'
                )}
            </button>
        </form>
    );
};
