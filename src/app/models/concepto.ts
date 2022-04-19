import { Area } from "./area";
import { Instrucciones } from "./instrucciones";

export class Concepto {

    id: number;
    concepto: string;
    area: Area;
    dicom: boolean;
    instrucciones: Instrucciones;
    requiereSaberAntecedentes: boolean;

}