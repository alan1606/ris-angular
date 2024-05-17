export class Movimiento {
  id: number;
  cantidad: number;
  descripcion: string;
  fecha:string;
  tipo: TipoMovimiento;
  corteTurnoId: number;
}

export enum TipoMovimiento {
  ENTRADA="ENTRADA",
  SALIDA="SALIDA"
}
