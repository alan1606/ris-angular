import { Antecedente } from "./antecedente";
import { Concepto } from "./concepto";
import { Generic } from "./generic";

export class AntecedenteConcepto implements Generic{
    id: number;
    antecedente: Antecedente;
    concepto: Concepto;
}
