import api from '../../utils/api';
import {
    LibroAlumno,
    LibroAlumnoRaw,
    LibroDetalle,
    ProgresoPayload,
    ProgresoResponse,
} from '../../types/alumno/libros';

// Normaliza la respuesta real del backend al modelo que usa el frontend
function mapLibroRaw(raw: LibroAlumnoRaw): LibroAlumno {
    return {
        libroId: Number(raw.id),
        titulo: raw.titulo,
        grado: raw.grado,
        materia: raw.materia?.nombre ?? '',
        escuelaId: 0, // No viene en la respuesta, se deja en 0
        asignadoDesde: raw.fechaAsignacion,
        progresoPorcentaje: raw.progreso ?? 0,
        ultimoSegmentoId: raw.ultimoSegmentoId ? Number(raw.ultimoSegmentoId) : undefined,
        ultimaLectura: raw.ultimaLectura ?? undefined,
        activo: true, // El libro está asignado al alumno, por eso aparece en la lista
        descripcion: raw.descripcion ?? undefined,
        autor: raw.autor,
        editorial: raw.editorial,
        numPaginas: raw.numPaginas ? Number(raw.numPaginas) : undefined,
        rutaPdf: raw.rutaPdf,
        estado: raw.estado,
    };
}

export class AlumnoLibrosService {
    /**
     * Listar libros asignados al alumno autenticado
     * GET /escuelas/mis-libros
     */
    static async getMisLibros(): Promise<LibroAlumno[]> {
        const response = await api.get('/escuelas/mis-libros');
        const raw: LibroAlumnoRaw[] = Array.isArray(response.data)
            ? response.data
            : response.data?.data ?? [];
        return raw.map(mapLibroRaw);
    }

    /**
     * Obtener metadatos de un libro (segmentos, descripción, etc.)
     * GET /libros/:id
     */
    static async getLibroDetalle(id: number): Promise<LibroDetalle> {
        const response = await api.get(`/libros/${id}`);
        const data = response.data?.data ?? response.data;

        // Normalización: El backend puede devolver materia como objeto o string
        if (data && typeof data.materia === 'object' && data.materia !== null) {
            data.materia = data.materia.nombre || '';
        }

        // Mapear unidades -> segmentos si existe la estructura anidada
        if (data && data.unidades && Array.isArray(data.unidades)) {
            const allSegments: any[] = [];
            data.unidades.forEach((unidad: any) => {
                if (unidad.segmentos && Array.isArray(unidad.segmentos)) {
                    unidad.segmentos.forEach((seg: any) => {
                        allSegments.push({
                            id: Number(seg.id),
                            titulo: seg.nombre || `Sección ${seg.orden}`, // Si no tiene nombre, usar orden
                            orden: Number(seg.orden),
                            contenido: seg.contenido || '',
                            numeroPagina: seg.numeroPagina ? Number(seg.numeroPagina) : null,
                            idExterno: seg.idExterno,
                            unidadId: Number(unidad.id),
                            unidadNombre: unidad.nombre
                        });
                    });
                }
            });
            data.segmentos = allSegments;
        }

        return data;
    }

    /**
     * Actualizar progreso de lectura del alumno en un libro
     * PATCH /escuelas/mis-libros/:libroId/progreso
     */
    static async updateProgreso(
        libroId: number,
        payload: ProgresoPayload
    ): Promise<ProgresoResponse> {
        const response = await api.patch(
            `/escuelas/mis-libros/${libroId}/progreso`,
            payload
        );
        return response.data?.data ?? response.data;
    }

}