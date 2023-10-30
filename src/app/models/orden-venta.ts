import { Generic } from "./generic";
import { Medico } from "./medico";
import { Paciente } from "./paciente";

export class OrdenVenta implements Generic{

    id: number;
    totalSinDescuento: number;
    totalDespuesDescuento: number;
    paciente: Paciente;
    fechaVenta: string;
    medicoReferente: Medico;
    motivo: string;
    requiereFactura: boolean;
    pagado: boolean;
    aplicarDescuento: boolean;
    codigoPromocional: string;
}
