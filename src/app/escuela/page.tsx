'use client';

import { useState, useEffect } from 'react';
import { DirectorService } from '../../service/escuela/director.service';
import {
  DashboardDirector,
  AlumnoEscuela,
  AlumnoEvaluaciones,
  AlumnoLibroDetalle,
} from '../../types/profesor/profesor';

// ── Tipos maestro ─────────────────────────────────────────────────────────
interface PersonaMaestro {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  correo: string;
  telefono?: string;
}

interface Maestro {
  id: string;
  persona: PersonaMaestro;
}

// ── Modal detalle alumno ──────────────────────────────────────────────────
function ModalDetalleAlumno({
  alumno,
  onClose,
}: {
  alumno: AlumnoEscuela;
  onClose: () => void;
}) {
  const [libros,       setLibros]       = useState<AlumnoLibroDetalle[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<AlumnoEvaluaciones[]>([]);
  const [tab,          setTab]          = useState<'libros' | 'evaluaciones'>('libros');
  const [isLoading,    setIsLoading]    = useState(true);

  const nombreCompleto = `${alumno.persona.nombre} ${alumno.persona.apellidoPaterno} ${alumno.persona.apellidoMaterno ?? ''}`.trim();

  useEffect(() => {
    Promise.all([
      DirectorService.getLibrosAlumno(alumno.id),
      DirectorService.getEvaluacionesAlumno(alumno.id),
    ])
      .then(([l, e]) => { setLibros(l); setEvaluaciones(e); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [alumno.id]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">

          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#c8d8f0] shrink-0">
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#0a1628]">{nombreCompleto}</h2>
              <p className="text-xs text-[#6b8cba] uppercase tracking-widest font-bold mt-0.5">
                {alumno.grado}° {alumno.grupo} · {alumno.cicloEscolar}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-[#6b8cba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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
                          <span>✅ {ev.segmentosAprobados}</span>
                          <span>📝 {ev.totalIntentos}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {ev.intentos.slice(0, 5).map((intento, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs bg-white rounded-lg px-3 py-2 border border-[#c8d8f0]">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${intento.aprobado ? 'bg-green-500' : 'bg-red-400'}`} />
                            <span className="text-[#6b8cba] shrink-0">Seg. {intento.segmentoId}</span>
                            <span className="text-[#6b8cba] shrink-0">Int. {intento.intento}</span>
                            <span className={`font-bold shrink-0 ${intento.aprobado ? 'text-green-600' : 'text-red-500'}`}>
                              {intento.score}%
                            </span>
                            <span className="text-[#6b8cba] ml-auto shrink-0">
                              {new Date(intento.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        ))}
                        {ev.intentos.length > 5 && (
                          <p className="text-[11px] text-[#6b8cba] text-center">+{ev.intentos.length - 5} más</p>
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
export default function EscuelaPage() {
  const [dashboard,          setDashboard]          = useState<DashboardDirector | null>(null);
  const [alumnos,            setAlumnos]            = useState<AlumnoEscuela[]>([]);
  const [maestros,           setMaestros]           = useState<Maestro[]>([]);
  const [isLoading,          setIsLoading]          = useState(true);
  const [tabActiva,          setTabActiva]          = useState<'resumen' | 'alumnos' | 'maestros'>('resumen');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<AlumnoEscuela | null>(null);
  const [busqueda,           setBusqueda]           = useState('');
  const [busquedaMaestro,    setBusquedaMaestro]    = useState('');

  useEffect(() => {
    let m = true;
    Promise.all([
      DirectorService.getDashboard(),
      DirectorService.getAlumnos(),
      DirectorService.getMaestros(),
    ])
      .then(([d, a, ma]) => {
        if (!m) return;
        setDashboard(d);
        setAlumnos(a);
        setMaestros(ma);
      })
      .catch(console.error)
      .finally(() => { if (m) setIsLoading(false); });
    return () => { m = false; };
  }, []);

  const alumnosFiltrados = alumnos.filter(a => {
    const nombre = `${a.persona.nombre} ${a.persona.apellidoPaterno} ${a.persona.apellidoMaterno ?? ''}`.toLowerCase();
    return nombre.includes(busqueda.toLowerCase());
  });

  const maestrosFiltrados = maestros.filter(m => {
    const nombre = `${m.persona.nombre} ${m.persona.apellidoPaterno} ${m.persona.apellidoMaterno ?? ''}`.toLowerCase();
    return nombre.includes(busquedaMaestro.toLowerCase());
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#6b8cba] font-lora italic">Cargando dashboard…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#f5f8ff] p-4 md:p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-playfair font-bold text-[#0a1628] mb-1">
          {dashboard?.escuela.nombre ?? 'Portal de la Escuela'}
        </h1>
        <p className="text-[#1e3a6e]">{dashboard?.escuela.nivel} · {dashboard?.escuela.clave}</p>
      </div>

      {/* KPIs */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Estudiantes',  value: dashboard.totalEstudiantes,                     color: '#3b82f6', icon: '👩‍🎓' },
            { label: 'Profesores',   value: dashboard.totalProfesores,                      color: '#10b981', icon: '👨‍🏫' },
            { label: 'Libros',       value: dashboard.librosDisponibles,                    color: '#d4af37', icon: '📚' },
            { label: '% Aprobación', value: `${dashboard.agregados.porcentajeAprobacion}%`, color: '#8b5cf6', icon: '✅' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-2xl p-5 shadow-md border border-[#c8d8f0]/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${k.color}15` }}>
                {k.icon}
              </div>
              <div>
                <p className="text-2xl font-playfair font-bold text-[#0a1628]">{k.value}</p>
                <p className="text-[11px] text-[#6b8cba] uppercase tracking-widest font-bold">{k.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agregados */}
      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Progreso promedio',       value: `${dashboard.agregados.progresoPromedio}%`,        color: '#3b82f6' },
            { label: 'Tiempo total leído',       value: `${Math.round(dashboard.agregados.tiempoTotalMinutos / 60)}h`, color: '#d4af37' },
            { label: 'Evaluaciones realizadas',  value: dashboard.agregados.evaluacionesRealizadas,        color: '#10b981' },
          ].map(a => (
            <div key={a.label} className="bg-white rounded-2xl p-5 shadow-md border border-[#c8d8f0]/50 text-center">
              <p className="text-3xl font-playfair font-bold" style={{ color: a.color }}>{a.value}</p>
              <p className="text-xs text-[#6b8cba] uppercase tracking-widest font-bold mt-1">{a.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#c8d8f0]">
        {(['resumen', 'alumnos', 'maestros'] as const).map(t => (
          <button key={t} onClick={() => setTabActiva(t)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${tabActiva === t
              ? 'border-[#d4af37] text-[#0a1628] bg-white shadow-sm'
              : 'border-transparent text-[#6b8cba] hover:text-[#0a1628]'}`}>
            {t === 'resumen' ? 'Resumen' : t === 'alumnos' ? 'Alumnos' : 'Maestros'}
          </button>
        ))}
      </div>

      {/* Tab Resumen */}
      {tabActiva === 'resumen' && dashboard && (
        <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 p-6">
          <h3 className="font-playfair text-lg font-bold text-[#0a1628] mb-4">Información de la Escuela</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Dirección', value: dashboard.escuela.direccion },
              { label: 'Teléfono',  value: dashboard.escuela.telefono  },
              { label: 'Nivel',     value: dashboard.escuela.nivel     },
              { label: 'Clave',     value: dashboard.escuela.clave     },
            ].map(item => (
              <div key={item.label} className="bg-[#f5f8ff] rounded-xl p-4 border border-[#c8d8f0]/50">
                <p className="text-[10px] text-[#6b8cba] uppercase tracking-widest font-bold mb-1">{item.label}</p>
                <p className="text-[#0a1628] font-medium">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Alumnos */}
      {tabActiva === 'alumnos' && (
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8cba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c8d8f0] text-sm focus:outline-none focus:border-[#d4af37] bg-white"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 overflow-hidden">
            {alumnosFiltrados.length === 0 ? (
              <p className="text-center text-[#6b8cba] font-lora italic py-12">No se encontraron alumnos.</p>
            ) : (
              <div className="divide-y divide-[#c8d8f0]/30">
                {alumnosFiltrados.map(alumno => {
                  const nombre = `${alumno.persona.nombre} ${alumno.persona.apellidoPaterno}`;
                  return (
                    <div key={alumno.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#f5f8ff] transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-[#d4af37] flex items-center justify-center shrink-0">
                          <span className="text-[#0a1628] font-black text-sm">
                            {alumno.persona.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#0a1628] text-sm truncate">{nombre}</p>
                          <p className="text-[11px] text-[#6b8cba]">
                            {alumno.grado}° {alumno.grupo} · {alumno.persona.correo}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAlumnoSeleccionado(alumno)}
                        className="p-2 rounded-lg text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors shrink-0"
                        title="Ver detalle">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Maestros */}
      {tabActiva === 'maestros' && (
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8cba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar maestro..."
              value={busquedaMaestro}
              onChange={e => setBusquedaMaestro(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c8d8f0] text-sm focus:outline-none focus:border-[#d4af37] bg-white"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-[#c8d8f0]/50 overflow-hidden">
            {maestrosFiltrados.length === 0 ? (
              <p className="text-center text-[#6b8cba] font-lora italic py-12">No se encontraron maestros.</p>
            ) : (
              <div className="divide-y divide-[#c8d8f0]/30">
                {maestrosFiltrados.map(maestro => {
                  const nombre = `${maestro.persona.nombre} ${maestro.persona.apellidoPaterno} ${maestro.persona.apellidoMaterno ?? ''}`.trim();
                  return (
                    <div key={maestro.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-[#f5f8ff] transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#10b981] flex items-center justify-center shrink-0">
                        <span className="text-white font-black text-sm">
                          {maestro.persona.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#0a1628] text-sm truncate">{nombre}</p>
                        <p className="text-[11px] text-[#6b8cba]">{maestro.persona.correo}</p>
                      </div>
                      {maestro.persona.telefono && (
                        <p className="text-[11px] text-[#6b8cba] shrink-0 hidden sm:block">
                          {maestro.persona.telefono}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal detalle alumno */}
      {alumnoSeleccionado && (
        <ModalDetalleAlumno
          alumno={alumnoSeleccionado}
          onClose={() => setAlumnoSeleccionado(null)}
        />
      )}
    </div>
  );
}