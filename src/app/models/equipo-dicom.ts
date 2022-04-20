import { Area } from "./area";
import { Generic } from "./generic";

export class EquipoDicom implements Generic {

    id: number;
    area: Area;
    modalidad: string;
    nombre: string;
    aeTitle: string;

}
