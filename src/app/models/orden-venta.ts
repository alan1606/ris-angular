import { Generic } from "./generic";
import { Medico } from "./medico";
import { Paciente } from "./paciente";

export class OrdenVenta implements Generic{

    id: number;
    totalEi: number;
    totelEl: number;
    paciente: Paciente;
    fechaVenta: string;
    medicoReferente: Medico;
    motivo: string;
    requiereFactura: boolean;
    pagado: boolean;
    
}
