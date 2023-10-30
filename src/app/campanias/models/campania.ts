import { Concepto } from "src/app/models/concepto";

export class Campania {
    id: number;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    codigo: string;
    descripcion: string;
    fechaCreacion: string;
    activa: boolean;
    cantidadUsado: number;
    ordenes: number[];
    conceptos: Concepto[];
    limiteCanjeos: number;
}
