'use client';

import { useState, useEffect } from 'react';
import { TarjetaEstadistica } from '../../../components/alumno/TarjetaEstadistica';
import { AlumnoService } from '../../../service/alumno/alumno.service';
import { EstadisticasAlumno } from '../../../types/alumno/alumno';

export default function StatsPage() {
    const [stats, setStats] = useState<EstadisticasAlumno | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        AlumnoService.getEstadisticas()
            .then(data => {
                if (mounted) setStats(data);
            })
            .catch(console.error)
            .finally(() => {
                if (mounted) setIsLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!stats) return null;

    const horasTotales = Math.floor(stats.tiempoTotalMinutos / 60);
    const minsTotales = stats.tiempoTotalMinutos % 60;
    const tiempoLeidoFormat = horasTotales > 0 ? `${horasTotales}h ${minsTotales}m` : `${minsTotales}m`;

    return (
        <div className="animate-fade-in">
            <h2 className="font-playfair text-2xl font-bold text-[#2b1b17] mb-6">Resumen de Actividad</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <TarjetaEstadistica label="Libros Leídos" value={stats.librosLeidos.toString()} subtext={`${stats.librosEnProgreso} en progreso`} />
                <TarjetaEstadistica label="Tiempo de Lectura" value={tiempoLeidoFormat} subtext={`${stats.tiempoEsteMesMinutos}m este mes`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </TarjetaEstadistica>
                <TarjetaEstadistica label="Puntaje Promedio" value={stats.promedioEvaluaciones.toString()} subtext={`${stats.segmentosCompletados} secciones completadas`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </TarjetaEstadistica>
                <TarjetaEstadistica label="Racha Actual" value={`${stats.rachaActualDias} días`} subtext={`Máxima: ${stats.rachaMaximaDias} días`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>
                </TarjetaEstadistica>
            </section>

            {/* Placeholder for future detailed graphs */}
            <div className="mt-12 p-8 border-2 border-dashed border-[#e3dac9] rounded-xl text-center">
                <p className="text-[#a1887f] font-lora italic">Gráficas detalladas próximamente...</p>
            </div>
        </div>
    );
}
