import { Horario } from "./horario";

export class Cita {
    id: number;
    estado: string;
    fechaYHora: string;
    horario: Horario;
    ventaConceptoId: number;
}
