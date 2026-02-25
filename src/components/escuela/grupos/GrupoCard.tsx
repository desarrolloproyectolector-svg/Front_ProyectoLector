"use client";

export default function GrupoCard({ grupo }: { grupo: any }) {
  const gradeColors = {
    "1": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    "2": { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
    "3": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  };

  const gradeStyle = gradeColors[grupo.grado as keyof typeof gradeColors] || gradeColors["1"];

  const getPromedioColor = (promedio: number) => {
    if (promedio >= 80) return "text-emerald-600";
    if (promedio >= 60) return "text-[#d4af37]";
    return "text-red-500";
  };

  return (
    <div className="group bg-gradient-to-br from-white to-[#faf8f5] rounded-xl border border-[#e3dac9]/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#d4af37] to-[#c19a2e]"></div>

      <div className="p-5">
        {/* Header: Nombre + Promedio */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-playfair font-bold text-[#2b1b17] group-hover:text-[#d4af37] transition-colors duration-300">
              {grupo.nombre}
            </h3>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeStyle.bg} ${gradeStyle.text}`}>
              {grupo.grado === "1" ? "1er Grado" : grupo.grado === "2" ? "2do Grado" : "3er Grado"}
            </span>
          </div>

          {/* Promedio Badge */}
          <div className="flex flex-col items-center bg-[#fbf8f1] border border-[#e3dac9] rounded-xl px-3 py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1887f]">Promedio</span>
            <span className={`text-xl font-playfair font-bold ${getPromedioColor(grupo.promedio)}`}>
              {grupo.promedio}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e3dac9] my-3"></div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Profesor */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/10">
              <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Profesor</p>
              <p className="text-sm font-bold text-[#2b1b17] truncate">{grupo.profesor}</p>
            </div>
          </div>

          {/* Aula */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Aula</p>
              <p className="text-sm font-bold text-[#2b1b17]">{grupo.aula}</p>
            </div>
          </div>

          {/* Horario */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Horario</p>
              <p className="text-sm font-bold text-[#2b1b17]">{grupo.horario}</p>
            </div>
          </div>

          {/* Alumnos */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#a1887f] font-bold uppercase tracking-wider">Alumnos</p>
              <p className="text-sm font-bold text-[#2b1b17]">{grupo.totalAlumnos}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#e3dac9]">
          <button className="px-4 py-1.5 text-sm font-bold text-[#5d4037] border-2 border-[#e3dac9] rounded-lg hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300">
            Ver Detalles
          </button>
          <button className="px-4 py-1.5 text-sm font-bold bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}