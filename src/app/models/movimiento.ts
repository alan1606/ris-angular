export class Movimiento {
  id: number;
  cantidad: number;
  descripcion: string;
  tipo: TipooMovimiento;
  corteId: number;
}

enum TipooMovimiento {
  ENTRADA,
  SALIDA,
}
