export class Movimiento {
  id: number;
  cantidad: number;
  descripcion: string;
  fecha:string;
  tipo: TipoMovimiento;
  corteId: number;
}

export enum TipoMovimiento {
  ENTRADA="ENTRADA",
  SALIDA="SALIDA"
}
