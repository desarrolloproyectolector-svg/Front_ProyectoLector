import api from '../../../utils/api';

// ============================================================================
// TYPES
// ============================================================================

export interface CargaMasivaAdminResponse {
    message: string;
    description?: string;
    total?: number;
    exitosos?: number;
    errores?: number;
    detalles?: string[];
}

export interface EscuelaOpcion {
    id: number;
    nombre: string;
    nivel?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

class CargaMasivaAdminService {

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
     * Obtener lista de escuelas disponibles para el selector
     * GET /escuelas
     */
    async obtenerEscuelas(): Promise<EscuelaOpcion[]> {
        try {
            const response = await api.get('/escuelas');
            // Adaptar según la estructura real de tu API
            return response.data?.data ?? response.data ?? [];
        } catch (error: any) {
            console.error('Error al obtener escuelas:', error);
            throw new Error('Error al cargar la lista de escuelas.');
        }
    }

    /**
     * Subir Excel con alumnos o maestros por escuela (admin)
     * POST /escuelas/:id/carga-masiva
     */
    async cargarAlumnos(
        escuelaId: number,
        file: File,
        tipo: 'alumno' | 'maestro' = 'alumno'
    ): Promise<CargaMasivaAdminResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('tipo', tipo);

            const response = await api.post<CargaMasivaAdminResponse>(
                `/escuelas/${escuelaId}/carga-masiva`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error en carga masiva admin:', error);

            if (error.response?.status === 400) {
                throw new Error(
                    error.response.data?.message ||
                    'El archivo no tiene el formato correcto. Usa la plantilla oficial.'
                );
            }
            if (error.response?.status === 403) {
                throw new Error('No tienes permisos para realizar esta acción.');
            }
            if (error.response?.status === 404) {
                throw new Error('Escuela no encontrada.');
            }

            const msg =
                error.response?.data?.message ||
                error.response?.data?.description ||
                'Error al procesar el archivo. Intenta de nuevo.';
            throw new Error(msg);
        }
    }
}

export const cargaMasivaAdminService = new CargaMasivaAdminService();