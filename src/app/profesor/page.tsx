'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProfesorService } from '../../service/profesor/profesor.service';
import {
  GrupoProfesor,
  AlumnoGrupo,
  AlumnoLibroDetalle,
  AlumnoEvaluaciones,
} from '../../types/profesor/profesor';

// ── Semáforo de actividad ─────────────────────────────────────────────────
function PuntosActividad({ estado }: { estado: 'active' | 'warning' | 'alert' }) {
  const cfg = {
    active:  { color: 'bg-green-500',  label: 'Activo' },
    warning: { color: 'bg-yellow-500', label: 'Sin actividad reciente' },
    alert:   { color: 'bg-red-500',    label: 'Inactivo' },
  }[estado];
  return (
    <span title={cfg.label} className={`w-3 h-3 rounded-full shrink-0 ${cfg.color}`} />
  );
}

// ── Modal de detalle de alumno ────────────────────────────────────────────
function ModalDetalleAlumno({
  alumnoId,
  nombre,
  onClose,
}: {
  alumnoId: string;
  nombre: string;
  onClose: () => void;
}) {
  const [libros,      setLibros]      = useState<AlumnoLibroDetalle[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<AlumnoEvaluaciones[]>([]);
  const [tab,         setTab]         = useState<'libros' | 'evaluaciones'>('libros');
  const [isLoading,   setIsLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      ProfesorService.getLibrosAlumno(alumnoId),
      ProfesorService.getEvaluacionesAlumno(alumnoId),
    ])
      .then(([l, e]) => { setLibros(l); setEvaluaciones(e); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [alumnoId]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#c8d8f0] shrink-0">
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#0a1628]">{nombre}</h2>
              <p className="text-xs text-[#6b8cba] uppercase tracking-widest font-bold mt-0.5">Detalle del alumno</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-[#6b8cba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-6 pt-4 shrink-0 border-b border-[#c8d8f0]">
            {(['libros', 'evaluaciones'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${tab === t
                  ? 'border-[#d4af37] text-[#0a1628]'
                  : 'border-transparent text-[#6b8cba] hover:text-[#0a1628]'}`}>
                {t === 'libros' ? 'Libros' : 'Evaluaciones'}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tab === 'libros' ? (
              <div className="space-y-3">
                {libros.length === 0
                  ? <p className="text-center text-[#6b8cba] py-8 font-lora italic">Sin libros asignados.</p>
                  : libros.map(l => {
                    const color = l.progreso >= 100 ? '#4caf50' : l.progreso > 0 ? '#3b82f6' : '#6b8cba';
                    return (
                      <div key={l.libroId} className="rounded-xl border p-4"
                        style={{ borderColor: `${color}30`, background: `${color}06` }}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="font-bold text-[#0a1628] text-sm">{l.titulo}</p>
                            <p className="text-[11px] text-[#6b8cba]">{l.materia.nombre}</p>
                          </div>
                          <span className="text-lg font-playfair font-black shrink-0" style={{ color }}>
                            {l.progreso}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: `${color}20` }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${l.progreso}%`, background: color }} />
                        </div>
                        {l.ultimaLectura && (
                          <p className="text-[10px] text-[#6b8cba] mt-1.5">
                            Última lectura: {new Date(l.ultimaLectura).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    );
                  })
                }
              </div>
            ) : (
              <div className="space-y-4">
                {evaluaciones.length === 0
                  ? <p className="text-center text-[#6b8cba] py-8 font-lora italic">Sin evaluaciones registradas.</p>
                  : evaluaciones.map(ev => (
                    <div key={ev.libroId} className="bg-[#f5f8ff] rounded-xl p-4 border border-[#c8d8f0]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-[#0a1628] text-sm">{ev.titulo}</p>
                        <div className="flex gap-3 text-[11px] text-[#6b8cba]">
                          <span>✅ {ev.segmentosAprobados} aprobados</span>
                          <span>📝 {ev.totalIntentos} intentos</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {ev.intentos.slice(0, 5).map((intento, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs bg-white rounded-lg px-3 py-2 border border-[#c8d8f0]">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${intento.aprobado ? 'bg-green-500' : 'bg-red-400'}`} />
                            <span className="text-[#6b8cba] shrink-0">Seg. {intento.segmentoId}</span>
                            <span className="text-[#6b8cba] shrink-0">Intento {intento.intento}</span>
                            <span className={`font-bold shrink-0 ${intento.aprobado ? 'text-green-600' : 'text-red-500'}`}>
                              {intento.score}%
                            </span>
                            <span className="text-[#6b8cba] ml-auto shrink-0">
                              {new Date(intento.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        ))}
                        {ev.intentos.length > 5 && (
                          <p className="text-[11px] text-[#6b8cba] text-center">
                            +{ev.intentos.length - 5} intentos más
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Página principal ──────────────────────────────────────────────────────
export default function ProfesorPage() {
  const [grupos,          setGrupos]          = useState<GrupoProfesor[]>([]);
  const [selectedGrupo,   setSelectedGrupo]   = useState<string | null>(null);
  const [alumnos,         setAlumnos]         = useState<AlumnoGrupo[]>([]);
  const [loadingGrupos,   setLoadingGrupos]   = useState(true);
  const [loadingAlumnos,  setLoadingAlumnos]  = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<{ id: string; nombre: string } | null>(null);

  // Cargar grupos al montar
  useEffect(() => {
    ProfesorService.getGrupos()
      .then(data => {
        setGrupos(data);
        if (data.length > 0) setSelectedGrupo(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoadingGrupos(false));
  }, []);

  // Cargar alumnos cuando cambia el grupo seleccionado
  useEffect(() => {
    if (!selectedGrupo) return;
    setLoadingAlumnos(true);
    ProfesorService.getAlumnos(selectedGrupo)
      .then(setAlumnos)
      .catch(console.error)
      .finally(() => setLoadingAlumnos(false));
  }, [selectedGrupo]);

  const grupoActual = grupos.find(g => g.id === selectedGrupo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#f5f8ff] p-4 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-playfair font-bold text-[#0a1628] mb-2">Portal del Profesor</h1>
        <p className="text-[#1e3a6e] text-lg">Monitoreo y seguimiento de alumnos</p>
      </div>

      {/* Selector de grupos */}
      <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6 mb-6">
        <h2 className="font-playfair text-xl font-bold text-[#0a1628] mb-4">Mis Grupos</h2>
        {loadingGrupos ? (
          <div className="flex justify-center p-4">
            <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : grupos.length === 0 ? (
          <p className="text-[#6b8cba] font-lora italic text-center py-4">No tienes grupos asignados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {grupos.map(grupo => (
              <button key={grupo.id} onClick={() => setSelectedGrupo(grupo.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedGrupo === grupo.id
                  ? 'border-[#d4af37] bg-[#d4af37]/10'
                  : 'border-[#c8d8f0] hover:border-[#d4af37]/50 bg-white'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-playfair font-bold text-[#0a1628]">{grupo.nombre}</h3>
                  {grupo.alumnosPendientesEvaluacion > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {grupo.alumnosPendientesEvaluacion}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#6b8cba]">{grupo.totalAlumnos} alumnos</p>
                <p className="text-[11px] text-[#6b8cba] mt-0.5">{grupo.grado}° {grupo.seccion}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista de alumnos */}
      <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#0a1628]">
              {grupoActual ? `Alumnos — ${grupoActual.nombre}` : 'Alumnos'}
            </h2>
            {grupoActual && (
              <p className="text-xs text-[#6b8cba] uppercase tracking-widest font-bold mt-0.5">
                {alumnos.length} registrados
              </p>
            )}
          </div>
          {/* Leyenda semáforo */}
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#6b8cba]">
            {[['bg-green-500', 'Activo (≤1 día)'], ['bg-yellow-500', 'Sin act. (≤4 días)'], ['bg-red-500', 'Inactivo (>4 días)']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${c}`} />
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {loadingAlumnos ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : alumnos.length === 0 ? (
          <p className="text-center text-[#6b8cba] font-lora italic py-8">No hay alumnos en este grupo.</p>
        ) : (
          <div className="space-y-2">
            {alumnos.map(alumno => (
              <div key={alumno.alumnoId}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#f5f8ff] border border-[#c8d8f0]/50 hover:shadow-md transition-all">

                {/* Avatar + datos */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center shrink-0">
                    <span className="text-[#0a1628] font-black text-sm">
                      {alumno.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0a1628] text-sm truncate">{alumno.nombre}</p>
                    <p className="text-[11px] text-[#6b8cba]">
                      Última act: {new Date(alumno.ultimaActividad).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                {/* Progreso */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-playfair font-bold text-[#0a1628]">{alumno.progresoPromedio}%</p>
                  <p className="text-[10px] text-[#6b8cba] uppercase tracking-wider">progreso</p>
                </div>

                {/* Libros */}
                <div className="hidden md:block text-right shrink-0">
                  <p className="text-sm font-bold text-[#0a1628]">
                    {alumno.librosCompletados}/{alumno.librosAsignados}
                  </p>
                  <p className="text-[10px] text-[#6b8cba] uppercase tracking-wider">libros</p>
                </div>

                {/* Semáforo + acción */}
                <div className="flex items-center gap-3 shrink-0">
                  <PuntosActividad estado={alumno.estadoActividad} />
                  <button
                    onClick={() => setAlumnoSeleccionado({ id: alumno.alumnoId, nombre: alumno.nombre })}
                    className="p-2 rounded-lg text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                    title="Ver detalle">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal detalle alumno */}
      {alumnoSeleccionado && (
        <ModalDetalleAlumno
          alumnoId={alumnoSeleccionado.id}
          nombre={alumnoSeleccionado.nombre}
          onClose={() => setAlumnoSeleccionado(null)}
        />
      )}
    </div>
  );
}