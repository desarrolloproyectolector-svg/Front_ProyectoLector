'use client';

import React, { useState, useCallback } from 'react';
import { UseEvaluacionReturn } from '../../../hooks/useEvaluacion';
import { RespuestaItem } from '../../../types/alumno/evaluacion';

interface EvaluacionPanelProps {
    ev: UseEvaluacionReturn;
    tituloSegmento: string;
    /** Callback para avanzar al siguiente segmento al cerrar el panel tras aprobar/agotar intentos */
    onContinuar?: () => void;
}

// ── Gauge de score ──────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative w-36 h-36 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#e3dac9" strokeWidth="10" />
                <circle
                    cx="60" cy="60" r={radius} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-playfair font-bold text-[#2b1b17]">{score}</span>
                <span className="text-xs text-[#8d6e3f] font-bold uppercase tracking-widest">puntos</span>
            </div>
        </div>
    );
}

// ── Panel principal ─────────────────────────────────────────────────────────
export default function EvaluacionPanel({ ev, tituloSegmento, onContinuar }: EvaluacionPanelProps) {
    const { estado, evaluacion, resultado, isOpen, cerrarPanel, enviarRespuestas, solicitarReintento } = ev;

    const handleContinuar = useCallback(() => {
        cerrarPanel();
        onContinuar?.();
    }, [cerrarPanel, onContinuar]);

    // Respuestas locales mientras el alumno escribe
    const [drafts, setDrafts] = useState<Record<string, string>>({});

    const handleDraft = useCallback((id: string, value: string) => {
        setDrafts(prev => ({ ...prev, [id]: value }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!evaluacion) return;
        const respuestas: RespuestaItem[] = evaluacion.preguntas.map(p => ({
            preguntaId: p.preguntaId,
            respuesta: drafts[p.preguntaId]?.trim() ?? '',
        }));
        // Validar que todas tengan respuesta
        if (respuestas.some(r => !r.respuesta)) return;
        setDrafts({});
        await enviarRespuestas(respuestas);
    }, [evaluacion, drafts, enviarRespuestas]);

    const allAnswered = evaluacion?.preguntas.every(p => (drafts[p.preguntaId] ?? '').trim().length > 0) ?? false;

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[180] bg-black/50 backdrop-blur-sm"
                onClick={estado === 'pendiente' ? undefined : cerrarPanel}
            />

            {/* Panel */}
            <div className="fixed inset-x-0 bottom-0 z-[190] md:inset-0 md:flex md:items-center md:justify-center">
                <div className="bg-[#fbf8f1] rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl md:mx-4 shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-4 duration-300">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e3dac9] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#2b1b17] flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-playfair font-bold text-[#2b1b17] text-lg leading-none">Evaluación de Comprensión</h2>
                                <p className="text-[10px] text-[#a1887f] font-bold uppercase tracking-widest mt-0.5 line-clamp-1">{tituloSegmento}</p>
                            </div>
                        </div>

                        {/* Nivel badge */}
                        {evaluacion && (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                evaluacion.nivel === 'avanzado' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                evaluacion.nivel === 'intermedio' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                                {evaluacion.nivel}
                            </span>
                        )}
                    </div>

                    {/* Body — scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-5">

                        {/* ── Estado: cargando ── */}
                        {estado === 'cargando' && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[#8d6e3f] font-lora italic">Preparando tu evaluación...</p>
                            </div>
                        )}

                        {/* ── Estado: pendiente — preguntas ── */}
                        {estado === 'pendiente' && evaluacion && (
                            <div className="space-y-5">
                                {/* Info bar */}
                                <div className="flex items-center justify-between text-xs text-[#8d6e3f] bg-[#f5f0e8] rounded-xl px-4 py-2">
                                    <span>Responde con tus propias palabras</span>
                                    <span className="font-bold">
                                        {evaluacion.intentosRestantes} intento{evaluacion.intentosRestantes !== 1 ? 's' : ''} restante{evaluacion.intentosRestantes !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* Preguntas */}
                                {evaluacion.preguntas.map((p, idx) => (
                                    <div key={p.preguntaId} className="bg-white rounded-2xl p-4 border border-[#e3dac9] shadow-sm">
                                        <label className="block mb-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2b1b17] text-[#d4af37] text-xs font-black mr-2">{idx + 1}</span>
                                            <span className="font-medium text-[#2b1b17] text-sm">{p.texto}</span>
                                        </label>
                                        <textarea
                                            value={drafts[p.preguntaId] ?? ''}
                                            onChange={e => handleDraft(p.preguntaId, e.target.value)}
                                            placeholder="Escribe tu respuesta aquí..."
                                            rows={3}
                                            className="w-full mt-2 px-3 py-2 rounded-xl border-2 border-[#e3dac9] focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 font-lora text-sm text-[#2b1b17] resize-none transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Estado: enviando ── */}
                        {estado === 'enviando' && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[#8d6e3f] font-lora italic">Evaluando tus respuestas...</p>
                            </div>
                        )}

                        {/* ── Estado: aprobado ── */}
                        {estado === 'aprobado' && resultado && (
                            <div className="flex flex-col items-center text-center py-6 gap-5">
                                <ScoreGauge score={resultado.score} />
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-3">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-emerald-700 font-black text-xs uppercase tracking-widest">¡Aprobado!</span>
                                    </div>
                                    <p className="text-[#5d4037] font-lora">Excelente comprensión del fragmento. Ya puedes avanzar al siguiente.</p>
                                </div>
                            </div>
                        )}

                        {/* ── Estado: refuerzo ── */}
                        {estado === 'refuerzo' && resultado && (
                            <div className="space-y-5">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <ScoreGauge score={resultado.score} />
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-amber-700 font-black text-xs uppercase tracking-widest">Necesitas refuerzo</span>
                                    </div>
                                    <p className="text-[#5d4037] font-lora text-sm">Necesitas al menos 70 puntos. Te dejamos algunas pistas para que lo intentes de nuevo.</p>
                                </div>

                                {/* Apoyos */}
                                {resultado.apoyos?.map((apoyo, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl p-4 border border-[#e3dac9]">
                                        {apoyo.tipo === 'pista' && (
                                            <>
                                                <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                                    Pista
                                                </p>
                                                <p className="text-sm text-[#5d4037] font-lora leading-relaxed">{apoyo.contenido}</p>
                                            </>
                                        )}
                                        {apoyo.tipo === 'glosario' && apoyo.palabras && (
                                            <>
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Palabras clave</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {apoyo.palabras.map((p, i) => (
                                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">{p}</span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Estado: intentos_agotados ── */}
                        {estado === 'intentos_agotados' && (
                            <div className="flex flex-col items-center text-center py-8 gap-4">
                                {resultado && <ScoreGauge score={resultado.score} />}
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full mb-3">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span className="text-gray-600 font-black text-xs uppercase tracking-widest">Intentos agotados</span>
                                    </div>
                                    <p className="text-[#5d4037] font-lora text-sm">Usaste todos tus intentos en este fragmento. Puedes seguir leyendo y volver a practicar después.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer con acciones */}
                    <div className="px-6 pb-6 pt-4 border-t border-[#e3dac9] shrink-0 flex gap-3">
                        {/* Botón principal según estado */}
                        {estado === 'pendiente' && (
                            <button
                                onClick={handleSubmit}
                                disabled={!allAnswered}
                                className="flex-1 py-3 rounded-xl bg-[#2b1b17] text-[#f0e6d2] font-bold hover:bg-[#3e2723] transition-all shadow-lg disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Enviar respuestas
                            </button>
                        )}

                        {estado === 'refuerzo' && (
                            <button
                                onClick={() => solicitarReintento()}
                                className="flex-1 py-3 rounded-xl bg-[#d4af37] text-[#2b1b17] font-bold hover:bg-[#c19b2f] transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reintentar
                            </button>
                        )}

                        {(estado === 'aprobado' || estado === 'intentos_agotados') && (
                            <button
                                onClick={handleContinuar}
                                className="flex-1 py-3 rounded-xl bg-[#2b1b17] text-[#f0e6d2] font-bold hover:bg-[#3e2723] transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                                {estado === 'aprobado' ? 'Continuar lectura' : 'Seguir leyendo'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
