'use client';

import React, { useState } from 'react';
import { Input } from '../../ui/Input';

interface PasswordFieldProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    showGenerator?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
    value,
    onChange,
    error,
    showGenerator = true
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
        // Generar contraseña de 8 caracteres: 4 letras + 4 números
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'; // Sin I, l, O para evitar confusión
        const numbers = '23456789'; // Sin 0, 1 para evitar confusión
        
        let password = '';
        for (let i = 0; i < 4; i++) {
            password += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 4; i++) {
            password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        // Mezclar los caracteres
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        onChange(password);
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    label="Contraseña Temporal"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    error={error}
                    required
                    helperText="Esta contraseña será enviada al usuario. Recomiéndele cambiarla en su primer inicio de sesión."
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    }
                />
                
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-[#a1887f] hover:text-[#8d6e3f] transition-colors"
                >
                    {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* Botón para generar contraseña automática */}
            {showGenerator && (
                <button
                    type="button"
                    onClick={generatePassword}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-lora text-[#d4af37] hover:text-[#c19a2e] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Generar contraseña automática
                </button>
            )}

            {/* Mostrar la contraseña generada en texto claro */}
            {value && (
                <div className="p-3 bg-amber-50 border-2 border-[#d4af37]/20 rounded-xl">
                    <p className="text-xs font-bold text-[#2b1b17] mb-1">Contraseña generada:</p>
                    <div className="flex items-center gap-2">
                        <code className="text-lg font-mono font-bold text-[#d4af37]">{value}</code>
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(value)}
                            className="p-1.5 hover:bg-[#d4af37]/10 rounded-lg transition-colors"
                            title="Copiar contraseña"
                        >
                            <svg className="w-4 h-4 text-[#8d6e3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-[#8d6e3f] mt-2">
                        💡 Asegúrate de copiar y guardar esta contraseña para enviarla al usuario.
                    </p>
                </div>
            )}
        </div>
    );
};