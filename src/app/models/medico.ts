import { Generic } from "./generic";

export class Medico implements Generic {

    id: number;
    nombres: string;
    apellidos: string;
    especialidad: string;
    telefono: string;
    correo: string;
    direccion: string;
    fechaNacimiento: string;
    whastapp: string;
    token: string;
    radiologo: boolean;
    local: boolean;
}
