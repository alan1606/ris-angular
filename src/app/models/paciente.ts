import { Generic } from "./generic";

export class Paciente implements Generic{

    id: number;
    curp: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    email: string;
    sexo: number;
    fechaNacimiento: string;
    activo: boolean;
    fechaRegistro: string;
    nombreCompleto: string;
    firmaId: number;
}
