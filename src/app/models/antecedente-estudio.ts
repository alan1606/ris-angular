import { Antecedente } from "./antecedente";
import { Generic } from "./generic";
import { VentaConceptos } from "./venta-conceptos";

export class AntecedenteEstudio implements Generic{
    id: number;
    antecedente: Antecedente;
    ventaConcepto: VentaConceptos;
}
