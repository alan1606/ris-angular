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
    whatsapp: string;
    token: string;
    radiologo: boolean;
    sexo:any;
    local: boolean;
    usuario: string;
    password: string;
    cedulaFederal: string;
    cedulaEstatal: string;
    empresa: string;
    validado:boolean;
}
