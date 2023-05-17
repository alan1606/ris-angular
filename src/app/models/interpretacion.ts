import { Generic } from "./generic";
import { VentaConceptos } from "./venta-conceptos";

export class Interpretacion implements Generic {
    id: number;
    interpretacion: string;
    estudio: VentaConceptos;
}
