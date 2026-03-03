'use client';

import React, { useState } from 'react';

export interface UsuarioFormEditData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
    genero: string;
    password: string;
}

interface UsuarioFormEditProps {
    onSubmit: (data: UsuarioFormEditData) => void;
    onCancel: () => void;
    isLoading?: boolean;
    initialData?: Partial<UsuarioFormEditData>;
}

export const UsuarioFormEdit: React.FC<UsuarioFormEditProps> = ({
    onSubmit,
    onCancel,
    isLoading = false,
    initialData,
}) => {
    // ✅ FIX: Se eliminó el useEffect que reseteaba el formulario.
    // Los useState se inicializan UNA sola vez con initialData.
    // El reset ahora se controla desde afuera con la prop `key` en EditUsuarioModal.
    const [nombre, setNombre] = useState(initialData?.nombre ?? '');
    const [apellidoPaterno, setApellidoPaterno] = useState(initialData?.apellidoPaterno ?? '');
    const [apellidoMaterno, setApellidoMaterno] = useState(initialData?.apellidoMaterno ?? '');
    const [email, setEmail] = useState(initialData?.email ?? '');
    const [telefono, setTelefono] = useState(initialData?.telefono ?? '');
    const [fechaNacimiento, setFechaNacimiento] = useState(initialData?.fechaNacimiento ?? '');
    const [genero, setGenero] = useState(initialData?.genero ?? '');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!nombre.trim())
            newErrors.nombre = 'El nombre es requerido';

        if (!apellidoPaterno.trim())
            newErrors.apellidoPaterno = 'El apellido paterno es requerido';

        if (!email.trim())
            newErrors.email = 'El correo es requerido';

        if (password.length > 0 && password.length < 6)
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({ nombre, apellidoPaterno, apellidoMaterno, email, telefono, fechaNacimiento, genero, password });
    };

    const inputClass = (field: string) =>
        `w-full px-4 py-2.5 rounded-xl border-2 bg-white text-sm transition-all focus:outline-none focus:ring-4 ` +
        (errors[field]
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
            : 'border-[#e3dac9] focus:border-[#d4af37] focus:ring-[#d4af37]/10');

    const labelClass = 'block text-sm font-bold text-[#2b1b17] mb-1';

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Nombre + Apellido Paterno + Apellido Materno */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        autoComplete="off"
                        disabled={isLoading}
                        value={nombre}
                        onChange={e => { setNombre(e.target.value); setErrors(p => ({ ...p, nombre: '' })); }}
                        className={inputClass('nombre')}
                    />
                    {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
                </div>
                <div>
                    <label className={labelClass}>Apellido paterno</label>
                    <input
                        type="text"
                        name="apellidoPaterno"
                        id="apellidoPaterno"
                        autoComplete="off"
                        disabled={isLoading}
                        value={apellidoPaterno}
                        onChange={e => { setApellidoPaterno(e.target.value); setErrors(p => ({ ...p, apellidoPaterno: '' })); }}
                        className={inputClass('apellidoPaterno')}
                    />
                    {errors.apellidoPaterno && <p className="mt-1 text-xs text-red-600">{errors.apellidoPaterno}</p>}
                </div>
                <div>
                    <label className={labelClass}>
                        Apellido materno
                        <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                    </label>
                    <input
                        type="text"
                        name="apellidoMaterno"
                        id="apellidoMaterno"
                        autoComplete="off"
                        disabled={isLoading}
                        value={apellidoMaterno}
                        onChange={e => setApellidoMaterno(e.target.value)}
                        className={inputClass('apellidoMaterno')}
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className={labelClass}>Correo electrónico</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="off"
                    disabled={isLoading}
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                    className={inputClass('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Teléfono + Género */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>
                        Teléfono
                        <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                    </label>
                    <input
                        type="text"
                        name="telefono"
                        id="telefono"
                        autoComplete="off"
                        disabled={isLoading}
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        maxLength={20}
                        className={inputClass('telefono')}
                    />
                </div>
                <div>
                    <label className={labelClass}>
                        Género
                        <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                    </label>
                    <select
                        name="genero"
                        id="genero"
                        disabled={isLoading}
                        value={genero}
                        onChange={e => setGenero(e.target.value)}
                        className={inputClass('genero')}
                    >
                        <option value="">Sin especificar</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
            </div>

            {/* Fecha de nacimiento */}
            <div>
                <label className={labelClass}>
                    Fecha de nacimiento
                    <span className="ml-2 font-normal text-[#a1887f] text-xs">(opcional)</span>
                </label>
                <input
                    type="date"
                    name="fechaNacimiento"
                    id="fechaNacimiento"
                    disabled={isLoading}
                    value={fechaNacimiento}
                    onChange={e => setFechaNacimiento(e.target.value)}
                    className={inputClass('fechaNacimiento')}
                />
            </div>

            {/* Contraseña — opcional en edición */}
            <div>
                <label className={labelClass}>
                    Nueva contraseña
                    <span className="ml-2 font-normal text-[#a1887f] text-xs">
                        (dejar en blanco para no cambiar)
                    </span>
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    disabled={isLoading}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder="Mínimo 6 caracteres si deseas cambiarla"
                    className={inputClass('password')}
                    autoComplete="new-password"
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#e3dac9]">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl border-2 border-[#e3dac9] text-[#5d4037] font-bold hover:bg-[#fbf8f1] transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};