import { Generic } from "src/app/models/generic";
import { Area } from "./area";

export class Concepto implements Generic{
    id: number;
    area: Area;
    precio: number;
}