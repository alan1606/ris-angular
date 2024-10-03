import { Horario } from './horario';
import { VentaConceptos } from './venta-conceptos';

export class Cita {
  id: number;
  estado: string;
  fechaYHora: string;
  horario: Horario;
  ventaConceptoId: number;
  estudio: VentaConceptos;
  institucion?: string; //esta propiedad se utiliza como DTO
}
