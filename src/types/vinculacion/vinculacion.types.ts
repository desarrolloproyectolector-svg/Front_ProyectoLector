// types/vinculacion/vinculacion.types.ts

export interface VincularAlumnoDTO {
    codigo: string;
}

export interface VincularAlumnoResponse {
    message: string;
    description: string;
    data: {
        alumnoId: number;
        padreId: number;
    };
}

export interface CodigoVinculacionResponse {
    message: string;
    description: string;
    data: {
        codigo: string;
        expiraEn: string;
        usado: boolean;
    };
}
