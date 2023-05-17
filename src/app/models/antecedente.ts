import { Generic } from "./generic";

export class Antecedente implements Generic{
    id: number;
    nombre: string;
    padre: Antecedente;
    hijos: Antecedente[];
    seleccionado: boolean = false;
}
