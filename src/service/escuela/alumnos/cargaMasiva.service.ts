import api from '../../../utils/api';

// ============================================================================
// TYPES
// ============================================================================

export interface CargaMasivaResponse {
    message: string;
    description?: string;
    total?: number;
    exitosos?: number;
    errores?: number;
    detalles?: string[];
}

// ============================================================================
// SERVICE
// ============================================================================

class CargaMasivaService {

    /**
     * Descargar plantilla Excel para carga masiva
     * GET /escuelas/plantilla-carga-masiva
     * Público (no requiere autenticación)
     */
    async descargarPlantilla(): Promise<void> {
        try {
            const response = await api.get('/escuelas/plantilla-carga-masiva', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'plantilla_alumnos.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error al descargar plantilla:', error);
            throw new Error('Error al descargar la plantilla. Intenta de nuevo.');
        }
    }

    /**
     * Subir Excel con alumnos (usando escuela del token del director)
     * POST /director/carga-masiva
     */
    async cargarAlumnos(file: File): Promise<CargaMasivaResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('tipo', 'alumno');

            const response = await api.post<CargaMasivaResponse>(
                '/director/carga-masiva',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error en carga masiva:', error);

            if (error.response?.status === 400) {
                throw new Error(
                    error.response.data?.message ||
                    'El archivo no tiene el formato correcto. Usa la plantilla oficial.'
                );
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para realizar esta acción.');
            }

            const msg =
                error.response?.data?.message ||
                error.response?.data?.description ||
                'Error al procesar el archivo. Intenta de nuevo.';
            throw new Error(msg);
        }
    }

    /**
     * Subir Excel con alumnos por ID de escuela (admin o director)
     * POST /escuelas/:id/carga-masiva
     */
    async cargarAlumnosPorEscuela(
        escuelaId: number,
        file: File
    ): Promise<CargaMasivaResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('tipo', 'alumno');

            const response = await api.post<CargaMasivaResponse>(
                `/escuelas/${escuelaId}/carga-masiva`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error en carga masiva por escuela:', error);

            if (error.response?.status === 404) {
                throw new Error('Escuela no encontrada.');
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para realizar esta acción.');
            }

            const msg =
                error.response?.data?.message ||
                error.response?.data?.description ||
                'Error al procesar el archivo. Intenta de nuevo.';
            throw new Error(msg);
        }
    }
}

export const cargaMasivaService = new CargaMasivaService();