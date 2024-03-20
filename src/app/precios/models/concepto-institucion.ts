import { Concepto } from "src/app/models/concepto";
import { Institucion } from "src/app/models/institucion";

export class ConceptoInstitucion{
    id: number;
    concepto: Concepto;
    institucion: Institucion;
    idInterno: string;
}