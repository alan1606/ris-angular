import { Area } from "src/app/models/area";

export class Concepto  {

    id: number;
    concepto: string;
    area: Area;
    precio: number;
    porcentajeDescuento?: number;
    montoDescuento?: number;
    precioDespuesDescuento?: number;
}