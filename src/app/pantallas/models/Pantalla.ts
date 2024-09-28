import { Turno } from './Turno';

export class Pantalla {
  id: number;
  displayName: string;
  enabled: boolean;
  turnos: Turno[] = [];
}
