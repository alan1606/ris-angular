import { Area } from "./area";
import { Generic } from "./generic";

export class Concepto implements Generic{

    id: number;
    concepto: string;
    area: Area;
    dicom: boolean;
    requiereSaberAntecedentes: boolean;
    precio: number;
    porcentajeDescuento?: number;
    montoDescuento?: number;
    precioDespuesDescuento?: number;
    instrucciones: string;
}