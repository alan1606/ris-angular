import { Concepto } from "./concepto";
import { EquipoDicom } from "./equipo-dicom";
import { Generic } from "./generic";
import { Medico } from "./medico";
import { OrdenVenta } from "./orden-venta";
import { Paciente } from "./paciente";
import { Tecnico } from "./tecnico";

export class VentaConceptos implements Generic {

    id: number;
    paciente: Paciente;
    fechaVenta: string;
    concepto: Concepto;
    idPacs: string;
    ordenVenta: OrdenVenta;
    fechaAsignado: string;
    horaAsignado: string;
    enWorklist: boolean;
    equipoDicom: EquipoDicom;
    estado: string;
    tecnico: Tecnico;
    medicoRadiologo: Medico;
    iuid: string;

}
