import { Concepto } from "src/app/models/concepto";
import { Generic } from "src/app/models/generic";

export class ConceptoPrecio implements Generic{
    id: number;
    concepto: Concepto;
    precio: number;
}