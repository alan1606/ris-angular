import { Generic } from "./generic";

export class Interpretacion implements Generic {
    id: number;
    interpretacion: string;
    estudiosIds?: number[];
}
