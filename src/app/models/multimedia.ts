import { Generic } from "./generic";
import { OrdenVenta } from "./orden-venta";

export class Multimedia implements Generic{

    id: number;
    ordenVenta: OrdenVenta;
    ruta: string;
    tipo: string;
}
