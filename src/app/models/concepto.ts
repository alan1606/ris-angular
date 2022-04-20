import { Area } from "./area";
import { Generic } from "./generic";
import { Instrucciones } from "./instrucciones";

export class Concepto implements Generic{

    id: number;
    concepto: string;
    area: Area;
    dicom: boolean;
    instrucciones: Instrucciones;
    requiereSaberAntecedentes: boolean;

}