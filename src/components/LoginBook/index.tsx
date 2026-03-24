'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css';

import api from '../../utils/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export const LoginBook: React.FC = () => {
    const router = useRouter();
    const { login } = useAuth();
    // State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('Usuario');
    // const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs
    const bookRef = useRef<HTMLDivElement>(null);
    const frontCoverRef = useRef<HTMLDivElement>(null);
    const contentLayerRef = useRef<HTMLDivElement>(null);
    const pagesContainerRef = useRef<HTMLDivElement>(null);

    // Validation refs to manipulate DOM directly for speed/simplicity as per snippet logic
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const usernameErrorRef = useRef<HTMLParagraphElement>(null);
    const passwordErrorRef = useRef<HTMLParagraphElement>(null);

    // Helpers
    const checkInput = (input: HTMLInputElement | null, error: HTMLParagraphElement | null) => {
        if (!input || !error) return false;

        if (!input.checkValidity()) {
            input.classList.add('border-red-500');
            error.style.display = 'inline-block';
            return false;
        } else {
            input.classList.remove('border-red-500');
            error.style.display = 'none';
            return true;
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value.trim() !== "") {
            // Find corresponding error ref based on input
            if (e.target.id === 'username') checkInput(usernameInputRef.current, usernameErrorRef.current);
            if (e.target.id === 'password') checkInput(passwordInputRef.current, passwordErrorRef.current);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        // Update React state
        if (input.id === 'username') setUsername(input.value);
        if (input.id === 'password') setPassword(input.value);

        // Clear UI errors
        input.classList.remove('border-red-500');
        if (input.id === 'username' && usernameErrorRef.current) usernameErrorRef.current.style.display = 'none';
        if (input.id === 'password' && passwordErrorRef.current) passwordErrorRef.current.style.display = 'none';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userValid = checkInput(usernameInputRef.current, usernameErrorRef.current);
        const passValid = checkInput(passwordInputRef.current, passwordErrorRef.current);

        if (!userValid || !passValid) {
            // Shake animation
            if (bookRef.current) {
                // Use CSS Module class
                bookRef.current.classList.add(styles.animateShake);
                setTimeout(() => bookRef.current?.classList.remove(styles.animateShake), 500);
            }
            return;
        }

        try {
            // API Login Call
            const response = await api.post('/auth/login', {
                email: username,
                password: password
            });

            // API returns { access_token, user: { nombre, apellido, tipoPersona, ... } }
            const { access_token, user } = response.data;
            const userName = user?.nombre || username.split('@')[0];
            const tipoPersona = user?.tipoPersona || 'alumno';

            // Save Token and User Data via AuthContext
            login(access_token, user ?? { nombre: userName, tipoPersona });

            // --- SUCCESS SEQUENCE ---
            // 0. Set Welcome Name
            setDisplayName(userName);

            // 1. UI Feedback & Disappear Form
            if (contentLayerRef.current) {
                contentLayerRef.current.style.opacity = '0';
                contentLayerRef.current.style.pointerEvents = 'none';
                setTimeout(() => {
                    if (contentLayerRef.current) contentLayerRef.current.style.display = 'none';
                }, 300);
            }

            // 2. Animation Step 1: Open Cover (200ms)
            setTimeout(() => {
                if (frontCoverRef.current) {
                    frontCoverRef.current.style.transform = "translateZ(30px) rotateY(-160deg)";
                }
            }, 200);

            // 3. Animation Step 2: Flip Blank Pages 
            const pages = pagesContainerRef.current?.children;
            if (pages) {
                Array.from(pages).forEach((page, index) => {
                    setTimeout(() => {
                        // Spread out pages gently to see individual flips distinctly
                        const angle = -155 - (index * 5);
                        (page as HTMLElement).style.transform = `translateZ(${index + 1}px) rotateY(${angle}deg)`;
                    }, 400 + (index * 150)); // Slower stagger interval (150ms instead of 45ms)
                });
            }

            // 4. Animation Step 3: Zoom In (2200ms)
            setTimeout(() => {
                if (bookRef.current) {
                    bookRef.current.classList.add(styles.zoomState);
                    bookRef.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(8) translateX(-5%)";
                    bookRef.current.style.opacity = "0";
                }
            }, 2200);

            // 5. Animation Step 4: Redirect based on user type (4500ms)
            setTimeout(() => {
                console.log("Login Successful! Redirecting...");
                console.log("tipoPersona:", tipoPersona);

                // Normalizar el tipo de persona
                const tipo = tipoPersona.toLowerCase().trim();

                // Redirect based on tipoPersona
                switch (tipo) {
                    case 'administrador':
                        router.push('/admin');
                        break;
                    case 'director':
                        router.push('/escuela');
                        break;
                    case 'maestro':
                        router.push('/profesor');
                        break;
                    case 'padre':
                        router.push('/tutor');
                        break;
                    case 'alumno':
                    default:
                        router.push('/alumno/store');
                        break;
                }
            }, 4500);

        } catch (error) {
            console.error('Login Failed', error);
            // Show error feedback (e.g., shake and show message)
            if (bookRef.current) {
                bookRef.current.classList.add(styles.animateShake);
                setTimeout(() => bookRef.current?.classList.remove(styles.animateShake), 500);
            }
            if (passwordErrorRef.current) {
                passwordErrorRef.current.textContent = "⚠ Credenciales incorrectas";
                passwordErrorRef.current.style.display = 'inline-block';
            }
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden perspective-[2500px] relative font-sans" id="scene">
            <div className="scale-75 sm:scale-90 md:scale-100 lg:scale-105 relative items-center justify-center flex w-full h-full transition-transform duration-500">
                {/* Floor Shadow */}
                <div className="absolute w-[600px] h-[60px] bg-black/5 blur-2xl rounded-[100%] top-[75%] pointer-events-none md:top-[75%] mt-10 md:mt-0"></div>

                {/* THE BOOK ENTITY */}
                <div
                    className={`relative w-[440px] h-[620px] transform-style-3d will-change-transform ${styles.book}`}
                    id="book"
                    ref={bookRef}
                    style={{ transform: 'rotateY(0deg) rotateX(0deg)' }}
                >

                    {/* BACK COVER (Thickness & Base) */}
                    <div className="absolute inset-0 bg-[#2b1b17] rounded-r-xl rounded-l-md transform translate-z-[-25px] shadow-2xl"></div>

                    {/* BASE PAGE (Static - Prevents showing brown back cover) */}
                    <div className="absolute top-0 bottom-0 right-0 left-[-2px] bg-[#fbf8f1] rounded-r-xl rounded-l-sm border-l border-[#e3dac9] transform translate-z-[-24px] z-10 flex flex-col items-center justify-center text-[#4e342e] shadow-inner">
                        {/* Printed Logo/Title Page */}
                        <div className="opacity-80 flex flex-col items-center">
                            <div className="w-12 h-12 border-2 border-[#4e342e] rounded-full flex items-center justify-center mb-6 p-2">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" /></svg>
                            </div>

                            {/* Dynamic Welcome Message */}
                            <h2 className="font-playfair text-3xl font-bold tracking-[0.1em] text-[#2b1b17] mb-2">¡BIENVENIDO!</h2>
                            <p className="font-playfair text-2xl italic text-[#8d6e3f] border-b-2 border-[#d4af37]/30 pb-2 px-6 min-w-[150px] text-center">
                                {displayName}
                            </p>

                            <div className="mt-8 flex flex-col items-center gap-2">
                                <div className="w-1 h-1 bg-[#4e342e] rounded-full"></div>
                                <div className="w-1 h-6 bg-[#4e342e]/20 rounded-full"></div>
                                <p className="font-lora text-[10px] italic text-[#8d6e3f] mt-2">Accediendo a tu biblioteca...</p>
                            </div>
                        </div>
                    </div>

                    {/* PHYSICAL PAGES (Side View) */}
                    <div
                        className="absolute top-1 bottom-1 right-1 w-[35px] transform rotate-y-90 origin-right translate-z-[-12px]"
                        style={{ background: 'repeating-linear-gradient(90deg, #fdfbf7 0px, #fdfbf7 2px, #e3dac9 3px, #e3dac9 4px)' }}
                    ></div>
                    {/* PHYSICAL PAGES (Top View) */}
                    <div
                        className="absolute top-[3px] left-[5px] right-[10px] h-[25px] origin-top transform rotate-x-90 translate-z-[-12px]"
                        style={{ background: 'linear-gradient(to bottom, #fdfbf7, #e3dac9)' }}
                    ></div>

                    {/* ANIMATED PAGES */}
                    <div id="pagesContainer" ref={pagesContainerRef} className="absolute inset-0 z-40 transform-style-3d pointer-events-none">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <div
                                key={i}
                                className="page absolute inset-0 bg-[#fbf8f1] rounded-r-xl rounded-l-md border-y border-r border-l-2 border-[#d4af37]/30 border-l-[#a1887f] shadow-[2px_0_10px_rgba(0,0,0,0.15)] origin-left transform-style-3d transition-transform duration-[1400ms] pointer-events-none"
                                style={{ transform: `translateZ(${i}px)`, transitionTimingFunction: 'cubic-bezier(0.3, 0.1, 0.3, 1)' }}
                            >
                                {/* Inner texture/gradient to give pages more depth as they flip */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 rounded-r-xl pointer-events-none"></div>
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/40 to-transparent rounded-r-xl pointer-events-none"></div>
                            </div>
                        ))}
                    </div>

                    {/* SPINE */}
                    <div
                        className="absolute top-0 bottom-0 -left-[2px] w-[50px] transform rotate-y-90 origin-left rounded-l-md z-30 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, #2b1b17, #4e342e, #2b1b17)' }}
                    >
                        <div className="absolute top-10 w-full h-1 bg-[#d4af37] shadow-[0_0_5px_rgba(212,175,55,0.8)]"></div>
                        <div className="absolute bottom-10 w-full h-1 bg-[#d4af37] shadow-[0_0_5px_rgba(212,175,55,0.8)]"></div>
                        <div className="absolute top-1/2 w-full h-12 -mt-6 border-t border-b border-[#bd9b59]/50"></div>
                    </div>

                    {/* FRONT COVER (Interactive Part) */}
                    <div
                        className="absolute inset-0 z-50 transform-style-3d origin-left transition-transform duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) will-change-transform"
                        id="frontCover"
                        ref={frontCoverRef}
                        style={{ transform: 'translateZ(30px)' }}
                    >

                        {/* OUTER FACE */}
                        <div className="absolute inset-0 bg-[#3e2723] rounded-r-xl rounded-l-md shadow-lg overflow-hidden border-r border-[#1a100d]">
                            {/* Texture & Effects */}
                            <div
                                className="absolute inset-0 opacity-60 mix-blend-overlay pointer-events-none"
                                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leather.png')", filter: 'contrast(150%)' }}
                            ></div>
                            <div className="absolute inset-6 border-[3px] border-[#d4af37] rounded-lg opacity-90 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none">
                                <div className="absolute inset-1 border border-[#bd9b59] opacity-50 rounded-sm pointer-events-none"></div>
                            </div>
                            {/* Ornaments */}
                            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#d4af37] pointer-events-none"></div>
                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#d4af37] pointer-events-none"></div>
                            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#d4af37] pointer-events-none"></div>
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#d4af37] pointer-events-none"></div>

                            {/* CONTENT LAYER */}
                            <div
                                id="contentLayer"
                                ref={contentLayerRef}
                                className="relative z-[100] flex flex-col h-full px-12 py-16 text-center text-[#f0e6d2] pointer-events-auto transition-opacity duration-300"
                                style={{ transform: 'translateZ(50px)', transformStyle: 'flat' }}
                            >
                                <div className="mb-auto mt-4">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#8d6e3f] p-[2px] rounded-full shadow-lg">
                                        <div className="w-full h-full bg-[#3e2723] rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" /></svg>
                                        </div>
                                    </div>
                                    <h1 className="font-playfair text-2xl font-bold tracking-[0.2em] text-[#d4af37] drop-shadow-md">
                                        PROYECTO LECTOR
                                    </h1>
                                    <p className="font-lora text-[10px] uppercase tracking-[0.4em] text-[#a1887f] mt-6">Plataforma Educativa</p>
                                </div>

                                {/* LOGIN FORM */}
                                <form className="flex flex-col gap-5 mb-8 relative z-[101]" noValidate onSubmit={handleSubmit}>
                                    <div className="relative group text-left">
                                        <label className="block font-lora text-[10px] uppercase text-[#bd9b59] mb-1 ml-1 tracking-widest">Usuario o Correo</label>
                                        <input
                                            type="text"
                                            id="username"
                                            ref={usernameInputRef}
                                            required
                                            minLength={3}
                                            value={username}
                                            onChange={handleInput}
                                            onBlur={handleBlur}
                                            className={`w-full relative z-[102] cursor-text bg-[#1a100d]/60 border-b-2 border-[#5d4037] text-[#fff] font-playfair text-lg py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-[#1a100d]/90 transition-all rounded-t-sm placeholder-white/10 ${styles.autofillInput}`}
                                            placeholder="ejemplo@correo.com"
                                        />
                                        <p
                                            ref={usernameErrorRef}
                                            className="error-msg hidden text-red-400 text-[10px] mt-1 ml-1 font-sans font-medium bg-black/20 p-1 rounded inline-block"
                                            style={{ display: 'none' }}
                                        >⚠ Usuario o Correo válido requerido</p>
                                    </div>
                                    <div className="relative group text-left">
                                        <label className="block font-lora text-[10px] uppercase text-[#bd9b59] mb-1 ml-1 tracking-widest">Contraseña</label>
                                        <input
                                            type="password"
                                            id="password"
                                            ref={passwordInputRef}
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={handleInput}
                                            onBlur={handleBlur}
                                            className={`w-full relative z-[102] cursor-text bg-[#1a100d]/60 border-b-2 border-[#5d4037] text-[#fff] font-playfair text-lg py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-[#1a100d]/90 transition-all rounded-t-sm placeholder-white/10 ${styles.autofillInput}`}
                                            placeholder="•••••••"
                                        />
                                        <p
                                            ref={passwordErrorRef}
                                            className="error-msg hidden text-red-400 text-[10px] mt-1 ml-1 font-sans font-medium bg-black/20 p-1 rounded inline-block"
                                            style={{ display: 'none' }}
                                        >⚠ Contraseña requerida (min 6 caracteres)</p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 w-full relative z-[102] cursor-pointer bg-gradient-to-r from-[#bd9b59] to-[#8d6e3f] text-[#2b1b17] font-bold font-playfair text-sm uppercase py-4 rounded-sm shadow-lg hover:brightness-110 active:scale-[0.98] transition-all overflow-hidden group"
                                    >
                                        <span className="relative z-10 tracking-[0.2em]">INICIAR SESIÓN</span>
                                    </button>
                                </form>

                                <div className="text-[15px] text-[#8d6e3f]">
                                    <a href="#" className="hover:text-[#d4af37] underline decoration-[#5d4037]">¿Problemas para acceder?</a>
                                </div>
                            </div>
                        </div>

                        {/* INNER FACE (Visible when open) */}
                        <div className="absolute inset-0 bg-[#fbf8f1] rounded-l-md rounded-r-xl shadow-inner transform rotate-y-180 backface-hidden flex items-center justify-center p-12">
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};