export type TipoCompra = 'licencia' | 'libro';

export type EstadoCompra = 'activa' | 'cancelada' | 'expirada';

export interface Compra {
  id: number;
  tipo: TipoCompra;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  fecha: string;
  estado: EstadoCompra;
}

export interface CompraStatsData {
  totalGastado: number;
  licenciasActivas: number;
  librosComprados: number;
  totalCompras: number;
}

export interface CrearCompraPayload {
  tipo: TipoCompra;
  productoId: number;
  cantidad: number;
}

export interface CompraResponse {
  data: Compra[];
}
